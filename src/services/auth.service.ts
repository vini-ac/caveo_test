import { AuthFlowType, InitiateAuthCommand, InitiateAuthCommandInput, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito";
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import crypto from 'crypto';
import { verifier } from "../middlewares/auth";
import { confirmUser } from '../utils/cognitoUtils';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    private calculateSecretHash(username: string): string {
        const message = username + process.env.COGNITO_CLIENT_ID!;
        const key = process.env.COGNITO_CLIENT_SECRET!;
        const hmac = crypto.createHmac('SHA256', key);
        return hmac.update(message).digest('base64');
    }

    private async authenticateUser(email: string, password: string) {
        const params: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: this.calculateSecretHash(email)
            }
        };

        const command = new InitiateAuthCommand(params);
        return await cognitoClient.send(command);
    }

    private async registerUser(email: string, password: string) {
        const signUpCommand = new SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: email,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
            SecretHash: this.calculateSecretHash(email)
        });

        const signUpResult = await cognitoClient.send(signUpCommand);
    
        await this.getOrCreateLocalUser(email, signUpResult.UserSub);
    }

    private async getOrCreateLocalUser(email: string, cognitoId?: string) {
        let user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            user = this.userRepository.create({ 
                email,
                name: email, 
                role: 'user',
                cognitoId: cognitoId
            });
            await this.userRepository.save(user);
        }
        return user;
    }

    async signInOrRegister(email: string, password: string) {
        try {
            // Tenta registrar primeiro
            await this.registerUser(email, password);
            return {
                message: 'User registered successfully. Please check your email for verification.'
            };
        } catch (error: any) {
            // Se o usuário já existe, tenta autenticar
            if (error.message?.includes('User already exists')) {
                const authResult = await this.authenticateUser(email, password);
                const decodedToken = await verifier.verify(authResult.AuthenticationResult?.AccessToken!);
                const user = await this.getOrCreateLocalUser(email, decodedToken.sub);

                return {
                    token: authResult.AuthenticationResult?.AccessToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        isOnboarded: user.isOnboarded,
                        cognitoId: user.cognitoId
                    }
                };
            }
            
            throw new Error('Authentication failed: ' + error.message);
        }
    }

    async confirmUserAccount(username: string, userPoolId: string): Promise<void> {
        try {
          await confirmUser(username, userPoolId);
        } catch (error: any) {
          throw new Error(error.message);
        }
    }
}


