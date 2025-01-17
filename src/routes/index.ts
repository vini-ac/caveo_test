import Router from '@koa/router';
import { authMiddleware, adminOnly } from '../middlewares/auth';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';

const router = new Router();
const authController = new AuthController();
const userController = new UserController();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Sign in or register a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Authentication failed
 */
router.post('/auth', authController.signInOrRegister);

/**
 * @swagger
 * /confirm-user:
 *   post:
 *     summary: Confirm a user in Cognito
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Authentication failed
 */
router.post('/confirm-user', authController.confirmUser); 

// Rotas protegidas - todos os usuários autenticados
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, userController.getMe);


/**
 * @swagger
 * /edit-account:
 *   put:
 *     summary: Update user account information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's new name
 *               role:
 *                 type: string
 *                 description: User's role (admin only)
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isOnboarded:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (for role updates)
 *       404:
 *         description: User not found
 */
router.put('/edit-account', authMiddleware, userController.editAccount);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   isOnboarded:
 *                     type: boolean
 *                   cognitoId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       403:
 *         description: Forbidden - User is not an admin
 */
router.get('/users', authMiddleware, adminOnly, userController.getAllUsers);

/**
* @swagger
* /users/add-admin:
*   post:
*     summary: Adiciona um usuário ao grupo "admin"
*     tags: [User]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 description: Nome do usuário no Cognito
*     responses:
*       200:
*         description: Usuário adicionado ao grupo "admin" com sucesso
*       400:
*         description: Requisição inválida
*       500:
*         description: Erro no servidor
*/
router.post("/users/add-admin", userController.addAdminGroup);

export default router;
