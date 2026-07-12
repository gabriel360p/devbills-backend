//iniciando o fastify
import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import routes from './routes/index.js';
import { env } from './config/env.js';

//"instanciando o fastify"
const app: FastifyInstance = Fastify({
	logger:{
		//definindo o level debbuguer
		level:env.NODE_ENV==="dev" ? "info":"error" ,
	}, //bom para debugar em ambiente dev
});

app.register(fastifyCors,{
	origin:true,
	methods:['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
})
//registrando rotas plug-in-play
app.register(routes,{prefix:"/api/"});

export default app;


