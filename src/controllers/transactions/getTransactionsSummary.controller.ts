import type{ FastifyRequest } from "fastify";
import type{ FastifyReply } from "fastify";
import type{ getTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import prisma from "../../config/prisma";
import { CategorySummary } from "../../types/categorie.type";
import { TransactionType } from "../../../generated/prisma/enums";
import {TransactionSummary} from "../../types/transaction.type"

export const getTransactionsSummary = async(request: FastifyRequest<{Querystring:getTransactionsSummaryQuery}>, reply:FastifyReply):Promise <void>=>{
    dayjs.extend(utc);

    const userId=request.userId;
    //Verificando se o usuário está autenticado

    // console.log(request.query)

    const {month,year} = request.query;

    if(!userId) return reply.status(400).send("Voce não está autenticado!")

    if(!month|| !year){
        reply.status(400).send({message:"Mês e ano são obrigatórios"})
        return;
    }

    //ano inicial e mes inicial - 01 (do inicio do mes para frente) | sempre começa do inicio do mes | convertendo em data
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();        
    const endDate = dayjs.utc(startDate).endOf('month').toDate();
    
        try {
            // console.log(`User ${userId} \n - Data de inicio ${startDate} \n - Data final ${endDate}`)

            //Consultando o banco inserindo as informações de filtro
            const transasctions = await prisma.transaction.findMany({
                //dados de filtro
                where:{
                    userId,
                    date:{
                        gte: startDate,
                        lte: endDate
                    }
                },
                //traga as categorias das transactions
                include:{
                    //traga essas informações específicas das categorias 
                    Category:true,
                },
            })

            // console.log(transasctions)

            let totalExpense=0
            let totalIncome=0
            const groupedExpenses=new Map <string,CategorySummary>()
           
            for(const transaction of transasctions){
                if(transaction.type===TransactionType.expense){
                
                    const existing=groupedExpenses.get(transaction.categoryId) ??{
                        categoryId:transaction.categoryId,
                        categoryName:transaction.Category?.name,
                        categoryColor:transaction.Category?.color,
                        amount:0,
                        percentage:0
                    }

                    existing.amount+=transaction.amount

                    groupedExpenses.set(transaction.categoryId,existing)

                    totalExpense+=transaction.amount

                }else{
                    totalIncome += transaction.amount;
                }

            }
            const summary:TransactionSummary={
                totalExpense,
                totalIncome,
                balance:Number((totalIncome-totalExpense).toFixed(2)),
                expesesByCategory:Array.from(groupedExpenses.values()).map((entry=>({
                    ...entry,
                    percentage: Number.parseFloat(((entry.amount/totalExpense)*100).toFixed(2))
                }))).sort((a,b)=>b.amount-a.amount),
            }
            // console.log(summary)
            reply.status(200).send(summary)
        } catch (error) {
            reply.status(500).send(
                {
                    message:"Houve um erro",
                    error:error
                }
            )
        }
}