import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { storeTransaction } from '../controllers/transactions/createTransaction.controller.js';
import { deleteTransaction } from '../controllers/transactions/deleteTransaction.controller.js';
import { getHistoricalTransactions } from '../controllers/transactions/getHistoricalTransactions.controller.js';
import { getTransactions } from '../controllers/transactions/getTransactions.controller.js';
import { getTransactionsSummary } from '../controllers/transactions/getTransactionsSummary.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getHistoricalTransactionsSchema,
  getTransactionsSchema,
  getTransactionsSummaryQuery,
} from '../schemas/transaction.schema.js';

const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  //middleware de validação! Igual ao express, tudo abaixo esta sendo validado
  fastify.addHook('preHandler', authMiddleware);

  //rota de salvar transações
  fastify.route({
    method: 'POST',
    url: '/transactions',

    //esquema dos dados que vou enviar
    schema: {
      //
      body: z.toJSONSchema(createTransactionSchema, { target: 'draft-07', unrepresentable: 'any' }), //validação de dados via rotas
    },

    //chamada do controller
    handler: storeTransaction,
  });

  //rota de pegar transações filtradas
  fastify.route({
    method: 'GET',
    url: '/transactions',
    schema: {
      //validação de dados
      querystring: z.toJSONSchema(getTransactionsSchema, { target: 'draft-07' }),
    },
    handler: getTransactions,
  });

  //rota para buscar o resumo
  fastify.route({
    method: 'GET',
    url: '/transactions/resume',
    schema: {
      //validação de dados
      querystring: z.toJSONSchema(getTransactionsSummaryQuery, { target: 'draft-07' }),
    },
    handler: getTransactionsSummary,
  });

  //rota para buscar o resumo
  fastify.route({
    method: 'GET',
    url: '/transactions/historical',
    schema: {
      //validação de dados
      querystring: z.toJSONSchema(getHistoricalTransactionsSchema, { target: 'draft-07' }),
    },
    handler: getHistoricalTransactions,
  });

  //rota para apagar transação
  fastify.route({
    method: 'DELETE',
    url: '/transactions/:id',
    schema: {
      //validação de dados
      params: z.toJSONSchema(deleteTransactionSchema, { target: 'draft-07' }),
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
