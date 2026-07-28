import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import { createTransactionSchema } from '../../schemas/transaction.schema.js';

export const storeTransaction = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  //mandando os dados para validação
  const result = createTransactionSchema.safeParse(request.body);
  // console.log(result)

  //Verificando se o usuário está autenticado
  const userId = request.userId;
  if (!userId) return reply.status(400).send('Voce não está autenticado!');

  //Verificando se existe algum erro na validação
  if (!result.success)
    return reply.status(400).send({ message: 'Erro de validação', error: result.error });

  //Se nada deu problema, estamos agora pegando os dados validados
  const transaction = result.data;

  try {
    //verificando se a categoria existe de verdade
    const categorie = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        type: transaction.type,
      },
    });
    if (!categorie) return reply.status(400).send({ message: 'Categoria inexistente' });

    //formando em formato de data se a string de data estiver correta
    const parseDate = new Date(transaction.date);
    const newTransaction = await prisma.transaction.create({
      //SpreadOperator-> o campo date vai ser sobreescrito (overwritter) e userId estou informando agora
      data: { ...transaction, userId, date: parseDate },
      //afirmando a presença de relacionamento, e que ele deve ser acessível
      include: {
        Category: true,
      },
    });

    //Mensagem de sucesso em salvar
    reply.status(201).send({
      message: 'Nova transação salva',
      newTransaction,
    });
  } catch (error) {
    //mensagem de erro
    reply.status(400).send({ message: 'Erro ao salvar', error: error });
  }
};
