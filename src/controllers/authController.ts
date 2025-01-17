import { Context } from 'koa';
import { AuthService } from '../services/auth.service';
import { userPoolId } from '../config/cognito';

export class AuthController {
    private authService = new AuthService();

    public signInOrRegister = async (ctx: Context) => {
        try {
            const { email, password } = ctx.request.body as { email: string; password: string };
            const result = await this.authService.signInOrRegister(email, password);
            ctx.body = result;
        } catch (error: any) {
            ctx.status = 400;
            ctx.body = { message: 'Authentication failed', error: error.message };
        }
    };

    public confirmUser = async (ctx: Context)=> {
        const { email } = ctx.request.body as {email: string;};
    
        if (!email || !userPoolId) {
          ctx.status = 400;
          ctx.body = { error: 'Parâmetros `username` e `userPoolId` são obrigatórios.' };
          return;
        }
    
        try {
          const result = await this.authService.confirmUserAccount(email, userPoolId);
          ctx.status = 200;
          ctx.body = { message: `Usuário ${email} confirmado com sucesso.` };
        } catch (error: any) {
          ctx.status = 500;
          ctx.body = { error: error.message };
        }
      }
}
