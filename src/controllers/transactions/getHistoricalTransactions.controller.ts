import dayjs from 'dayjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { getHistoricalTransactionsSchema } from '../../schemas/transaction.schema.js';
import 'dayjs/locale/pt-br.js';
import utc from 'dayjs/plugin/utc.js';
import prisma from '../../config/prisma.js';

dayjs.locale('pt-br');
dayjs.extend(utc);

export const getHistoricalTransactions = async (
  request: FastifyRequest<{ Querystring: getHistoricalTransactionsSchema }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;
  if (!userId) return reply.status(400).send('Voce não está autenticado!');
  //-----

  const { month, year, months = 6 } = request.query;

  const baseDate = new Date(year, month - 1, 1);
  const startDate = dayjs
    .utc(baseDate)
    .subtract(months - 1, 'month')
    .startOf('month')
    .toDate();

  const endDate = dayjs.utc(baseDate).endOf('month').toDate();
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    const monthlyData = Array.from({ length: months }, (_, i) => {
      const date = dayjs(baseDate).subtract(months - 1 - i, 'month');

      return {
        name: date.format('MMM/YYYY'),
        income: 0,
        expense: 0,
      };
    });
    transactions.forEach((transaction) => {
      const monthKey = dayjs(transaction.date).format('MMM/YYYY');
      const monthData = monthlyData.find((m) => m.name === monthKey);
      // console.log(monthData)
      if (monthData) {
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }
      }
    });
    reply.code(200).send({ history: monthlyData });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Erro ao buscar o histórico' });
  }
};
