import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { initializeDatabase } from './config/database';
import router from './routes';
import { koaSwagger } from 'koa2-swagger-ui';
import { swaggerSpec } from './config/swagger';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(
  koaSwagger({
      routePrefix: '/api-docs',
      swaggerOptions: {
          spec: swaggerSpec as Record<string, unknown>
      }
  })
);

const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

export default app;
