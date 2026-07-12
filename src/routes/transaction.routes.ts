import type { FastifyInstance } from 'fastify';
import { storeTransaction } from '../controllers/transactions/createTransaction.controller';
import zodToJsonSchema from 'zod-to-json-schema';
import { createTransactionSchema, deleteTransactionSchema, getHistoricalTransactionsSchema, getTransactionsSchema, getTransactionsSummaryQuery } from '../schemas/transaction.schema';
import { getTransactions } from '../controllers/transactions/getTransactions.controller';
import { getTransactionsSummary } from '../controllers/transactions/getTransactionsSummary.controller';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import { deleteTransaction } from '../controllers/transactions/deleteTransaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { getHistoricalTransactions } from '../controllers/transactions/getHistoricalTransactions.controller';

const transactionRoutes = async(fastify:FastifyInstance):Promise<void> =>{
   
    //middleware de validação! Igual ao express, tudo abaixo esta sendo validado
    fastify.addHook('preHandler',authMiddleware)

    //rota de salvar transações
    fastify.route({
        method: "POST",
        url: "/transactions",

        //esquema dos dados que vou enviar
        schema:{
            //
            body: zodToJsonSchema(createTransactionSchema),//validação de dados via rotas
        },    

        //chamada do controller
        handler:storeTransaction,
    });

    //rota de pegar transações filtradas
    fastify.route({
        method:"GET",
        url:"/transactions",
        schema:{
            //validação de dados
            querystring:zodToJsonSchema(getTransactionsSchema)
        },
        handler: getTransactions
    });

    //rota para buscar o resumo
    fastify.route({
        method:"GET",
        url:"/transactions/resume",
        schema:{
            //validação de dados
            querystring:zodToJsonSchema(getTransactionsSummaryQuery)
        },
        handler: getTransactionsSummary
    });

    //rota para buscar o resumo
    fastify.route({
        method:"GET",
        url:"/transactions/historical",
        schema:{
            //validação de dados
            querystring:zodToJsonSchema(getHistoricalTransactionsSchema)
        },
        handler: getHistoricalTransactions
    });


    //rota para apagar transação
    fastify.route({
        method:"DELETE",
        url:"/transactions/:id",
        schema:{
            //validação de dados
            params:zodToJsonSchema(deleteTransactionSchema)
        },
        handler: deleteTransaction
    });
}

export default transactionRoutes;