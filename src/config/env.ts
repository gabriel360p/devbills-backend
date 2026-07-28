//VALIDAÇÃO DO DOTENV

//carregando o dotenv
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3001),
  NODE_ENV: z.string('NODE_ENV inválido, por favor informe dev ou test').default('dev'),
  DATABASE_URL: z.string().min(5, 'DATABASE_URL é obrigatório'),

  //Firebase
  FIREBASE_CLIENT_EMAIL: z.string().min(5, 'FIREBASE_CLIENT_EMAIL é obrigatório'),
  FIREBASE_PRIVATE_KEY: z.string().min(5, 'FIREBASE_PRIVATE_KEY é obrigatório'),
  FIREBASE_PROJECT_ID: z.string().min(5, 'FIREBASE_PROJECT_ID é obrigatório'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error('Variáveis de ambiente inválidas ou inexistentes');

  //ele para o app e informa que tem um erro
  process.exit(1);

  //ele para o app e não informa o erro
  // process.exit(0)
}
//vamos exportar para toda a aplicação esse env, ao invés do env direto do dotenv
export const env = _env.data;
