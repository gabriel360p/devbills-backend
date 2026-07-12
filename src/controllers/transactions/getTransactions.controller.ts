import type{ FastifyReply, FastifyRequest } from "fastify";
import type{ GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionsFilter } from "../../types/transaction.type";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import prisma from "../../config/prisma";

export const getTransactions = async(
    //tipando os dados que vamos receber, poiscele pode ser qualquer coisa (ou seja o ts não consegue inferir) então
    //  precisamos tipar eles, criando um tipo específico
    request: FastifyRequest<{Querystring:GetTransactionsQuery}>,

    reply:FastifyReply):

     Promise <void> =>{


        dayjs.extend(utc);

        //Verificando se o usuário está autenticado
    const userId=request.userId;

        if(!userId) return reply.status(400).send("Voce não está autenticado!")
        
        //desestruturando a nossa querystring
        const{month,year,categoryId,type} = request.query
        
        //Validando os dados que vamos receber na nossa querystring e MONTANDO pois vamos filtrar as o nosso objeto 
        // de filtro para podermos filtrar de acordo com os dados/opções
        const filters:TransactionsFilter={userId}

        //Range filter de data
        if(month && year){

            /* 
                Nós definimos date como opcional por isso fazemos no if. Pegamos os dados enviados e organizamos a data corretamente
            */

            //ano inicial e mes inicial - 01 (do inicio do mes para frente) | sempre começa do inicio do mes | convertendo em data
            const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();        
            const endDate = dayjs.utc(startDate).endOf('month').toDate();

            //inserindo dentro da nossa variável de filtro a data se o usuário passar, ela é uma OPÇÃO DE FILTRO
            filters.date = {gte:startDate, lte:endDate}
        }
        if(type) filters.type = type;

        if(categoryId) filters.categoryId = categoryId;

        try {
            //Consultando o banco inserindo as informações de filtro
            const filteredTransactions = await prisma.transaction.findMany({
                //dados de filtro
                where:filters,
                //ordem que os dados devem vim
                orderBy:{date:'desc'},
                //traga as categorias das transactions
                include:{
                    //traga essas informações específicas das categorias 
                    Category:{select:{
                        color:true,
                        name:true,
                        type:true,
                    }}
                }
            })

            reply.status(200).send(filteredTransactions)
        } catch (error) {
            reply.status(500).send(
                {
                    message:"Houve um erro",
                    error:error
                }
            )
        }
    }