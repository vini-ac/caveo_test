import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { addUserToGroup } from '../utils/cognitoUtils';

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByCognitoId(cognitoId: string) {
        return this.userRepository.findOne({ where: { cognitoId } });
    }

    async updateUser(sub: string, data: { name: string; role?: string }) {
        const user = await this.findByCognitoId(sub);
        if (!user) {
            throw new Error('User not found');
        }
        user.name = data.name;
        if (data.role) {
            user.role = data.role;
        }
        user.isOnboarded = true;

        return this.userRepository.save(user);
    }

    async addUserToAdminGroup(username: string): Promise<void> {
        const userPoolId = process.env.COGNITO_USER_POOL_ID!;
        const groupName = "admin";
    
        try {
          await addUserToGroup(username, userPoolId, groupName);
        } catch (error: any) {
          throw new Error(`Erro ao adicionar usuário ao grupo admin: ${error.message}`);
        }
      }

    async getAllUsers() {
        return this.userRepository.find();
    }
}
