import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createRecipeSchema, searchRecipesSchema } from '../schemas/recipesSchemas.js';
import * as recipeController from '../controllers/recipesControllers.js';

const recipesRouter = express.Router();

recipesRouter.get('/', validateBody(searchRecipesSchema, 'query'), recipeController.getAll);

recipesRouter.get('/popular', recipeController.getPopular);

recipesRouter.get('/own', auth, recipeController.getOwn);
recipesRouter.get('/favorites', auth, recipeController.getFavorites);

recipesRouter.get('/:id', recipeController.getById);

recipesRouter.post('/', auth, validateBody(createRecipeSchema), recipeController.create);
recipesRouter.post('/:id/favorite', auth, recipeController.addToFavorites);
recipesRouter.delete('/:id/favorite', auth, recipeController.removeFromFavorites);

recipesRouter.delete('/:id', auth, recipeController.remove);

export default recipesRouter;

/*
========================================
Swagger docs
========================================
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeOwner:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 3 }
 *         name: { type: string, example: "John Doe" }
 *         avatar: { type: string, nullable: true, example: "https://cdn.example.com/avatar.jpg" }
 *
 *     RecipeIngredientItem:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 12 }
 *         name: { type: string, example: "Salt" }
 *         img: { type: string, nullable: true, example: "https://cdn.example.com/salt.png" }
 *         RecipeIngredient:
 *           type: object
 *           properties:
 *             measure: { type: string, nullable: true, example: "1 tsp" }
 *
 *     RecipeSummary:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: "Borsch" }
 *         description: { type: string, nullable: true }
 *         thumb: { type: string, nullable: true }
 *         time: { type: integer, nullable: true, example: 90 }
 *         category:
 *           type: object
 *           properties:
 *             id: { type: integer }
 *             name: { type: string, example: "Beef" }
 *         area:
 *           type: object
 *           nullable: true
 *           properties:
 *             id: { type: integer }
 *             name: { type: string, example: "Ukrainian" }
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeIngredientItem'
 *
 *     RecipePopular:
 *       allOf:
 *         - $ref: '#/components/schemas/RecipeSummary'
 *         - type: object
 *           properties:
 *             favoritesCount: { type: integer, example: 42 }
 *             owner:
 *               $ref: '#/components/schemas/RecipeOwner'
 *
 *     RecipeDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/RecipeSummary'
 *         - type: object
 *           properties:
 *             instructions: { type: string }
 *             preview: { type: string, nullable: true }
 *             owner:
 *               $ref: '#/components/schemas/RecipeOwner'
 *             isFavorite:
 *               type: boolean
 *               description: "True if the requesting user added this recipe to favorites. Always false for unauthenticated requests."
 *               example: false
 *
 *     CreateRecipeBody:
 *       type: object
 *       required: [title, instructions, category_id]
 *       properties:
 *         title: { type: string, minLength: 2, maxLength: 150, example: "Borsch" }
 *         description: { type: string }
 *         instructions: { type: string }
 *         thumb: { type: string }
 *         time: { type: integer, minimum: 1, example: 90 }
 *         category_id: { type: integer, example: 2 }
 *         area_id: { type: integer, example: 5 }
 *         ingredients:
 *           type: array
 *           items: { type: integer }
 *           example: [12, 34, 56]
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total: { type: integer, example: 120 }
 *         page: { type: integer, example: 1 }
 *         limit: { type: integer, example: 10 }
 *         totalPages: { type: integer, example: 12 }
 *
 *     PaginationMetaWithNav:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationMeta'
 *         - type: object
 *           properties:
 *             hasNextPage: { type: boolean, example: true }
 *             hasPreviousPage: { type: boolean, example: false }
 */

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipes management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   # ── Reusable responses ──────────────────────────────────────────────────
 *
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid JWT token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Recipe not found
 *
 *     BadRequest:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "category must be a number"
 *
 *     Conflict:
 *       description: Resource conflict
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Recipe is already in favorites
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Search recipes by category, area and ingredient
 *     description: >
 *       All query params are optional and combinable.
 *       category, area and ingredient are integer IDs selected from dropdowns.
 *       Returns empty array when no recipes match — never 404.
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         description: Category ID
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: area
 *         description: Area (region of origin) ID
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: ingredient
 *         description: Ingredient ID
 *         schema:
 *           type: integer
 *           example: 12
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecipeSummary'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Get popular recipes sorted by favorites count
 *     description: >
 *       Popularity = COUNT(favorites.recipe_id) per recipe.
 *       Recipes with the most favorites appear first.
 *       Each item includes owner (id, name, avatar) and favoritesCount.
 *       page and limit are parsed manually in the controller (not validated by schema).
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of popular recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecipePopular'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMetaWithNav'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/own:
 *   get:
 *     summary: Get recipes created by the authenticated user
 *     description: >
 *       Filters by owner_id = req.user.id from JWT.
 *       Returns empty array with 200 if user has no recipes — never 404.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of own recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecipeSummary'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/favorites:
 *   get:
 *     summary: Get favorite recipes of the authenticated user
 *     description: >
 *       Returns paginated list of recipes added to user's favorites.
 *       Returns empty array with 200 if favorites list is empty.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of favorite recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecipeSummary'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe detail by ID
 *     description: >
 *       Returns a single recipe by integer primary key.
 *       Includes category, area, owner (id, name, avatar) and ingredients with measure.
 *       isFavorite is true only when the request is authenticated and the recipe is in the user's favorites.
 *       Throws 404 if the recipe does not exist.
 *     tags: [Recipes]
 *     security:
 *       - {}
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe integer ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Full recipe detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/RecipeDetail'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: >
 *       Creates a recipe owned by the authenticated user (owner_id = req.user.id).
 *       ingredients is an optional array of existing ingredient IDs to attach.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeBody'
 *           example:
 *             title: Borsch
 *             description: Traditional Ukrainian beet soup with cabbage
 *             instructions: 1. Boil beets for 40 min. 2. Add shredded cabbage...
 *             thumb: https://cdn.example.com/borsch.jpg
 *             time: 90
 *             category_id: 2
 *             area_id: 5
 *             ingredients: [12, 34, 56]
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/RecipeDetail'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   post:
 *     summary: Add recipe to authenticated user's favorites
 *     description: >
 *       Creates a favorite relation between current user and recipe.
 *       Returns 409 if recipe is already in favorites.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe integer ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Recipe successfully added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 11
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     recipe_id:
 *                       type: integer
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   delete:
 *     summary: Remove recipe from authenticated user's favorites
 *     description: >
 *       Removes a favorite relation between current user and recipe.
 *       Returns 404 if recipe does not exist or is not in favorites.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe integer ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Recipe successfully removed from favorites (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete own recipe by ID
 *     description: >
 *       Deletes a recipe only if owner_id matches the authenticated user.
 *       Returns 404 if recipe does not exist or belongs to another user.
 *       Returns 204 with no body on success.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe integer ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Recipe deleted successfully (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
