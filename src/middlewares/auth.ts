import { Context, Next } from 'koa';
import { CognitoJwtVerifier } from "aws-jwt-verify";

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
  throw new Error('Cognito environment variables are not set');
}

export const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  clientId: process.env.COGNITO_CLIENT_ID!,
  tokenUse: "access",
});

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'No token provided' };
    return;
  }

  try {
    const payload = await verifier.verify(token);
    ctx.state.user = payload;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid token' };
  }
};

export const adminOnly = async (ctx: Context, next: Next) => {
  if (!ctx.state.user['cognito:groups']?.includes('admin')) {
      ctx.status = 403;
      ctx.body = { message: 'Access denied. Admin only.' };
      return;
  }
  await next();
};
