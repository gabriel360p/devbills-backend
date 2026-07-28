//assim que o server rodar, estou ja iniciando o arquivo app.ts
import app from './app.js';

//Importando o dotenv
// import dotenv from 'dotenv'
import { prismaConnect } from './config/prisma.js';
import { initializeCategoriesDefault } from './services/globalCategories.service.js';
//iniciando
// dotenv.config()

import { env } from './config/env.js';
import initializeFirebaseAdmin from './config/firebase.js';

//buscando a informação que queremos:
const serverport = env.PORT;

initializeFirebaseAdmin();

const start = async () => {
  //importando o banco para inicializar a conexão
  await prismaConnect();
  await initializeCategoriesDefault();

  try {
    await app.listen({ port: serverport });
    console.log(`Server on in port:${serverport}`);
  } catch (error) {
    console.error(error);
  }
};
start();
