import { Recipe } from '../db/models/recipesModel.js';
import { Ingredient } from '../db/models/ingredientsModel.js';
import { Favorite } from '../db/models/favoritesModel.js';
import { sequelize } from '../db/sequelize.js';
import { Category } from '../db/models/categoriesModel.js';
import { Area } from '../db/models/areasModel.js';
import { RecipeIngredient } from '../db/models/recipeIngredientsModel.js';
import { User } from '../db/models/usersModel.js';
import HttpError from '../helpers/HttpError.js';
import { UniqueConstraintError } from 'sequelize';

export const listRecipes = async ({ category, area, ingredient, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category_id = category;
    if (area) where.area_id = area;

    const ingredientInclude = {
        model: Ingredient,
        as: 'ingredients',
        through: { model: RecipeIngredient, attributes: [] },
        attributes: ['id', 'name'],
        ...(ingredient && {
            where: { id: ingredient },
            required: true,
        }),
    };

    const { count, rows } = await Recipe.findAndCountAll({
        where,
        include: [
            ingredientInclude,
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: Area, as: 'area', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true,
    });

    return {
        recipes: rows,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};

export const getRecipeDetail = async (id, userId = null) => {
    const recipe = await Recipe.findByPk(id, {
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: Area,
                as: 'area',
                attributes: ['id', 'name'],
            },
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'avatar'],
            },
            {
                model: Ingredient,
                as: 'ingredients',
                attributes: ['id', 'name', 'img'],
                through: { model: RecipeIngredient, attributes: ['measure'] },
            },
        ],
    });

    if (!recipe) throw HttpError(404, 'Recipe not found');

    let isFavorite = false;
    if (userId) {
        const favorite = await Favorite.findOne({
            where: { user_id: userId, recipe_id: id },
        });
        isFavorite = !!favorite;
    }

    return { ...recipe.toJSON(), isFavorite };
};

export const getPopularRecipes = async ({ page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;

    const total = await Favorite.count({ col: 'recipe_id', distinct: true });

    const recipes = await Recipe.findAll({
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('favorites.recipe_id')), 'favoritesCount']],
        },
        include: [
            { model: Favorite, as: 'favorites', attributes: [] },
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: Area, as: 'area', attributes: ['id', 'name'] },
            { model: User, as: 'owner', attributes: ['id', 'name', 'avatar'] },
        ],
        group: ['Recipe.id', 'category.id', 'area.id', 'owner.id'],
        order: [[sequelize.literal('"favoritesCount"'), 'DESC']],
        limit,
        offset,
        subQuery: false,
    });

    return {
        recipes,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};
export const getUserRecipes = async ({ owner_id, page, limit }) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Recipe.findAndCountAll({
        where: { owner_id },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true,
    });

    return {
        recipes: rows,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};

export const getUserFavoriteRecipes = async ({ user_id, page, limit }) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Recipe.findAndCountAll({
        include: [
            {
                model: Favorite,
                as: 'favorites',
                attributes: [],
                where: { user_id },
                required: true,
            },
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: Area, as: 'area', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true,
    });

    return {
        recipes: rows,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};

export const createRecipe = async (userId, data) => {
    return await Recipe.create({ ...data, owner_id: userId });
};

export const addRecipeToFavorites = async (userId, recipeId) => {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
        throw HttpError(404, 'Recipe not found');
    }

    try {
        return await Favorite.create({
            user_id: userId,
            recipe_id: recipeId,
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw HttpError(409, 'Recipe is already in favorites');
        }
        throw error;
    }
};

export const removeRecipeFromFavorites = async (userId, recipeId) => {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
        throw HttpError(404, 'Recipe not found');
    }

    const deletedCount = await Favorite.destroy({
        where: {
            user_id: userId,
            recipe_id: recipeId,
        },
    });

    if (!deletedCount) {
        throw HttpError(404, 'Recipe is not in favorites');
    }

    return true;
};

export const deleteRecipe = async (userId, recipeId) => {
    const recipe = await Recipe.findOne({ where: { id: recipeId, owner_id: userId } });
    if (!recipe) return null;
    await recipe.destroy();
    return true;
};
