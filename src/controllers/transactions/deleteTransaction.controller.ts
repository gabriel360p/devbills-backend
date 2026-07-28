import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import type { deleteTransactionSchema } from '../../schemas/transaction.schema.js';

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: deleteTransactionSchema }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) return reply.status(400).send('Voce não está autenticado!');

  const { id } = request.params;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });
    // console.log("APAGADO")
    // console.log(transaction)

    if (!transaction) return reply.status(400).send({ error: 'Id de transação inválido' });

    //------
    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    reply.status(200).send({ message: 'Transação apagada' });
    return;
  } catch (_error) {
    reply.status(500).send({ message: 'Erro ao apagar transação', error: 'error' });
    return;
  }
};
