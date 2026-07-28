import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth } from 'firebase-admin/auth';

declare module 'fastify' {
  //adicionando um novo campo ao fastify request - estou tipando isso por causa do typescript, então preciso avisar
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    reply.code(401).send('Token de autorização não fornecido');
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    request.userId = decodedToken.uid;
  } catch (error) {
    request.log.error(`Erro ao verificar token ${error}`);
    reply.code(401).send({ error: 'token invalido ou expirado' });
  }
};
