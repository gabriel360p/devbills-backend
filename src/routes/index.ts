import type { FastifyInstance } from 'fastify';

import categoryRoutesGroup from './categories.routes';
import transactionRoutes from './transaction.routes';

//informando a tipagem do fastify:
async function routes(fastify: FastifyInstance): Promise<void> {
	console.log('rotas rodando');

	//registrando as rotas que foram "agrupadas"
	fastify.register(categoryRoutesGroup)
	fastify.register(transactionRoutes)

	fastify.get('home', async () => {
		return {
			status: 'Ok',
			mensage: 'DevBills API rodando',
		};
	});


}

export default routes;
