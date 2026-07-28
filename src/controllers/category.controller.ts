import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../config/prisma.js';

/* 
    Controller bem diferente KKKKKKK

*/

/* 
    O TS não sabe que tipo de dados essa função vai receber, por isso devemos informar explicitamente:
    provalvemente isso foi definido nas configurações internas do servidor, por isso devemos inferir explicitamente
*/
export const getCategories = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    //buscando categorias do banco em ordem alfabetica
    const categories = await prisma.category.findMany({
      //nesse caso, como a variável ja esta recebendo um valor, não precisamos tipar, o ts infere automaticamente
      orderBy: { name: 'asc' },
    });

    reply.status(200).send(categories);
    //não precisa de um return, só o reply ja resolve
  } catch (error) {
    console.log(`Houve um erro ${error}`);
    reply.status(500).send({ error: error });
  }
};
