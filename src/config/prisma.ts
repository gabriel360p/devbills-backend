/*
    O PrismaClient é responsável para que a gente consiga fazer operações dentro do banco,
    logo a gente precisa dele.

*/

import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';

const prisma = new PrismaClient();

//estabalecendo conexão com o banco e exportando ele para ser importado em server
export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log('DB Conectado');
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

//exportando a nossa forma de se comunicar com o banco
export default prisma;
