/*
  Schema de validação utilizando o ZOD (faz o mesmo que o YUP)
  Um arquivo dedicado só pra isso. (Esse arquivo não é para banco de dados KKKK)
*/

import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { TransactionType } from '../../generated/prisma/enums.js';

//verificando se o id é "tipo de id" especial só do mongo
const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);
//da erro, mas o ZOD esta sim enviando o id!

export const createTransactionSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.coerce.date({ error: () => ({ message: 'Data Inválida' }) }),
  //refine retorna falso ou positivo, ele serve para validar se o campo é ou não "correto"
  categoryId: z.string().refine(isValidObjectId, { message: 'Categoria inválida' }),
  //Eu estou validando se esse objectId é válido para os padrões do mongo (nele o id é um objeto, não só um número)

  type: z.enum([TransactionType.expense, TransactionType.income], { error: 'Erro no enum' }),
});

//É assim que os dados vão chegar, e eles vão chegar por meio de queryString, aqui estou validando os dados
export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], { error: 'Erro no enum' })
    .optional(),
  categoryId: z.string().refine(isValidObjectId, { message: 'Categoria inválida' }).optional(),
});

//criando um tipo para que possamos passar ele no controller, para que possamos informar de onde vem e como são os dados que vamos receber
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;

export const getTransactionsSummaryQuery = z.object({
  month: z.string({ message: 'O mês é obrigatório' }),
  year: z.string({ message: 'O ano é obrigatório' }),
});
//encima estou validando e embaixo eu crio uma tipagem que ja tem a validação embutida, muito massa
export type getTransactionsSummaryQuery = z.infer<typeof getTransactionsSummaryQuery>;

export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

export type getHistoricalTransactionsSchema = z.infer<typeof getHistoricalTransactionsSchema>;

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: 'id inválido' }), //dá erro, mas o ZOD vai enviar o id por debaixo dos panos,
});

export type deleteTransactionSchema = z.infer<typeof deleteTransactionSchema>;
