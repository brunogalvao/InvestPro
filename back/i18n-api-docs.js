/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health Check
 *     description: Verifica o status da API e conexão com Redis
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
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 redis:
 *                   type: string
 *                   example: connected
 *                 environment:
 *                   type: string
 *                   example: development
 */

/**
 * @swagger
 * /api/languages:
 *   get:
 *     tags: [Translations]
 *     summary: Listar idiomas disponíveis
 *     description: Retorna lista de todos os idiomas configurados
 *     responses:
 *       200:
 *         description: Lista de idiomas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["en", "pt"]
 *       503:
 *         description: Serviço indisponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Serviço de traduções indisponível
 */

/**
 * @swagger
 * /api/translations/{lang}:
 *   get:
 *     tags: [Translations]
 *     summary: Obter traduções de um idioma
 *     description: Retorna as traduções para o idioma especificado
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, pt]
 *         description: Código do idioma (en para inglês, pt para português)
 *     responses:
 *       200:
 *         description: Traduções encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: InvestPro
 *                 subtitle:
 *                   type: string
 *                   example: Smart Investment Platform
 *                 language:
 *                   type: string
 *                   example: Language
 *                 hero:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Invest Smart, Grow Faster
 *                     subtitle:
 *                       type: string
 *                       example: Access the best investment opportunities
 *                     cta:
 *                       type: string
 *                       example: Start Investing
 *                     learn_more:
 *                       type: string
 *                       example: Learn More
 *                 exchange:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: USD/BRL Exchange Rate
 *                     last_update:
 *                       type: string
 *                       example: Last update
 *                     high:
 *                       type: string
 *                       example: High
 *                     low:
 *                       type: string
 *                       example: Low
 *                     variation:
 *                       type: string
 *                       example: Variation
 *       404:
 *         description: Idioma não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Idioma não encontrado
 *       503:
 *         description: Serviço indisponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Serviço de traduções indisponível
 */

/**
 * @swagger
 * /api/translations/{lang}:
 *   put:
 *     tags: [Translations]
 *     summary: Atualizar traduções de um idioma
 *     description: Atualiza as traduções para o idioma especificado
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do idioma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: InvestPro
 *               subtitle:
 *                 type: string
 *                 example: Plataforma de Investimentos Inteligente
 *               hero:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Invista Inteligente, Cresça Mais Rápido
 *                   subtitle:
 *                     type: string
 *                     example: Acesse as melhores oportunidades de investimento
 *                   cta:
 *                     type: string
 *                     example: Começar a Investir
 *                   learn_more:
 *                     type: string
 *                     example: Saiba Mais
 *     responses:
 *       200:
 *         description: Traduções atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Traduções atualizadas com sucesso
 *       400:
 *         description: Dados inválidos
 *       503:
 *         description: Serviço indisponível
 */

/**
 * @swagger
 * /api/translations:
 *   post:
 *     tags: [Translations]
 *     summary: Adicionar novo idioma
 *     description: Adiciona um novo idioma com suas traduções
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lang, translations]
 *             properties:
 *               lang:
 *                 type: string
 *                 description: Código do idioma
 *                 example: es
 *               translations:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: InvestPro
 *                   subtitle:
 *                     type: string
 *                     example: Plataforma de Inversión Inteligente
 *                   hero:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Invierte Inteligente, Crece Más Rápido
 *                       cta:
 *                         type: string
 *                         example: Comenzar a Invertir
 *     responses:
 *       201:
 *         description: Idioma adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Idioma adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       503:
 *         description: Serviço indisponível
 */

/**
 * @swagger
 * /api/translations/{lang}:
 *   delete:
 *     tags: [Translations]
 *     summary: Remover idioma
 *     description: Remove um idioma e suas traduções
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do idioma
 *     responses:
 *       200:
 *         description: Idioma removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Idioma removido com sucesso
 *       503:
 *         description: Serviço indisponível
 */

/**
 * @swagger
 * /api/exchange-rate:
 *   get:
 *     tags: [Exchange Rate]
 *     summary: Cotação USD/BRL em tempo real
 *     description: Retorna a cotação atual do dólar americano em relação ao real brasileiro
 *     responses:
 *       200:
 *         description: Cotação obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rate:
 *                   type: number
 *                   example: 5.4797
 *                 high:
 *                   type: number
 *                   example: 5.495
 *                 low:
 *                   type: number
 *                   example: 5.45961
 *                 variation:
 *                   type: number
 *                   example: 0.192716
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 name:
 *                   type: string
 *                   example: Dólar Americano/Real Brasileiro
 *                 code:
 *                   type: string
 *                   example: USD
 *                 codein:
 *                   type: string
 *                   example: BRL
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/exchange-rate/cached:
 *   get:
 *     tags: [Exchange Rate]
 *     summary: Cotação USD/BRL com cache Redis
 *     description: Retorna a cotação do dólar com cache Redis para melhor performance
 *     responses:
 *       200:
 *         description: Cotação obtida com sucesso (pode ser do cache)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - type: object
 *                   properties:
 *                     rate:
 *                       type: number
 *                       example: 5.4797
 *                     high:
 *                       type: number
 *                       example: 5.495
 *                     low:
 *                       type: number
 *                       example: 5.45961
 *                     variation:
 *                       type: number
 *                       example: 0.192716
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     name:
 *                       type: string
 *                       example: Dólar Americano/Real Brasileiro
 *                     code:
 *                       type: string
 *                       example: USD
 *                     codein:
 *                       type: string
 *                       example: BRL
 *                 - type: object
 *                   properties:
 *                     cached:
 *                       type: boolean
 *                       description: Indica se a resposta veio do cache
 *                     cacheAge:
 *                       type: number
 *                       description: Idade do cache em segundos
 *       503:
 *         description: Serviço indisponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Serviço de traduções indisponível
 */
