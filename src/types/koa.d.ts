import 'koa';

declare module 'koa' {
  interface Request {
    body?: unknown;
    rawBody: string;
  }
}
