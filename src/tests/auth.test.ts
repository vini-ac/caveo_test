import { AuthService } from '../services/auth.service';
import { AppDataSource } from '../config/database';

describe('AuthService', () => {
    let authService: AuthService;

    beforeAll(async () => {
        await AppDataSource.initialize();
        authService = new AuthService();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    it('should register a new user successfully', async () => {
        const result = await authService.signInOrRegister('test@example.com', 'Password123@');
        expect(result).toHaveProperty('message', 'User registered successfully. Please check your email for verification.');
    });

    it('should authenticate existing user', async () => {
        const result = await authService.signInOrRegister('test@example.com', 'Password123@');
        expect(result).toHaveProperty('token');
        expect(result).toHaveProperty('user');
    });

    it('should fail to register a new user successfully', async () => {
        const result = await authService.signInOrRegister('test2@example.com', 'password123');
        expect(result).toHaveProperty('message', 'Authentication failed: Password did not conform with policy: Password must have uppercase characters');
    });
});
