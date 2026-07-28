import type { FastifyInstance } from 'fastify';
import { getCategories } from '../controllers/category.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

//grupo de rotas / rota única pq o usuário só vai ver as categorias

const categoryRoutesGroup = async (fastify: FastifyInstance): Promise<void> => {
  fastify.addHook('preHandler', authMiddleware);

  fastify.get('categorias', getCategories);
};

export default categoryRoutesGroup;
