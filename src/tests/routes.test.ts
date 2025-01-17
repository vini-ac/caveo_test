import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';

describe('API Routes', () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    describe('POST /auth', () => {
        it('should authenticate user with valid credentials', async () => {
            const response = await request(app.callback())
                .post('/auth')
                .send({
                    email: 'test@example.com',
                    password: 'Password123@'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });
});
