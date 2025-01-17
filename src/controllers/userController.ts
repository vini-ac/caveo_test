import { Context } from 'koa';
import { UserService } from '../services/user.service';

export class UserController {
    private userService = new UserService();

    public getMe = async (ctx: Context) => {
        const user = await this.userService.findByCognitoId(ctx.state.user.sub);
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }
        ctx.body = user;
    };

    public editAccount = async (ctx: Context) => {
        try {
            console.log('group', ctx.state.user)
            const { name, role } = ctx.request.body as { name: string; role?: string };
            const user = await this.userService.updateUser(ctx.state.user.sub, { 
                name, 
                role: ctx.state.user['cognito:groups']?.includes('admin') ? role : undefined 
            });
            ctx.body = { message: 'Account updated successfully', user };
        } catch (error: any) {
            ctx.status = 400;
            ctx.body = { message: error.message };
        }
    };

    public getAllUsers = async (ctx: Context) => {
        if (!ctx.state.user['cognito:groups']?.includes('admin')) {
            ctx.status = 403;
            ctx.body = { message: 'Access denied' };
            return;
        }
        const users = await this.userService.getAllUsers();
        ctx.body = users;
    };

    public addAdminGroup = async (ctx: Context) => {
        const { username } = ctx.request.body as {username: string;};;
    
        if (!username) {
          ctx.status = 400;
          ctx.body = { error: "O campo 'username' é obrigatório." };
          return;
        }
    
        try {
          await this.userService.addUserToAdminGroup(username);
    
          ctx.status = 200;
          ctx.body = { message: `Usuário ${username} adicionado ao grupo admin com sucesso.` };
        } catch (error: any) {
          ctx.status = 500;
          ctx.body = { error: error.message };
        }
      }
}
