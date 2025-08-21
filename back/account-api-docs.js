/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health Check
 *     description: Verifica o status da API e conexão com banco
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 ts:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *                 environment:
 *                   type: string
 *                   example: development
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário com endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cpf, rg, income, password, address]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               phone:
 *                 type: string
 *                 minLength: 8
 *                 example: "11999999999"
 *               cpf:
 *                 type: string
 *                 minLength: 11
 *                 maxLength: 14
 *                 example: "12345678901"
 *               rg:
 *                 type: string
 *                 minLength: 5
 *                 example: "1234567"
 *               income:
 *                 type: string
 *                 example: "5000.00"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *               address:
 *                 type: object
 *                 required: [street, cep, city, state]
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Rua das Flores, 123
 *                   cep:
 *                     type: string
 *                     example: "01234-567"
 *                   city:
 *                     type: string
 *                     example: São Paulo
 *                   state:
 *                     type: string
 *                     maxLength: 2
 *                     example: SP
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error
 *                 details:
 *                   type: array
 *       409:
 *         description: Usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 *       503:
 *         description: Serviço indisponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Service temporarily unavailable
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login de usuário
 *     description: Autentica usuário por email ou telefone e retorna JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error
 *                 details:
 *                   type: array
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Credenciais inválidas
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     tags: [Accounts]
 *     summary: Listar usuários
 *     description: Retorna lista de todos os usuários cadastrados
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   cpf:
 *                     type: string
 *                   rg:
 *                     type: string
 *                   income:
 *                     type: number
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     tags: [Accounts]
 *     summary: Buscar usuário por ID
 *     description: Retorna dados de um usuário específico com endereço
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 rg:
 *                   type: string
 *                 income:
 *                   type: number
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 address:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     cep:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 */

/**
 * @swagger
 * /accounts/{id}:
 *   put:
 *     tags: [Accounts]
 *     summary: Atualizar usuário
 *     description: Atualiza dados de um usuário existente
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               cpf:
 *                 type: string
 *                 minLength: 11
 *                 maxLength: 14
 *               rg:
 *                 type: string
 *                 minLength: 5
 *               income:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   cep:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                     maxLength: 2
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     tags: [Accounts]
 *     summary: Deletar usuário
 *     description: Remove um usuário e seu endereço
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Não autorizado
 */
