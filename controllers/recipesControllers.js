import * as recipesService from '../services/recipesServices.js';

const parsePage = (value, defaultValue = 1) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1) {
        return defaultValue;
    }
    return Math.floor(num);
};

const parseLimit = (value, defaultValue = 10, maxValue = 50) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1) {
        return defaultValue;
    }
    return Math.min(Math.floor(num), maxValue);
};

const parseRecipeId = (value) => {
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const num = Number(value);
    if (!Number.isSafeInteger(num) || num < 1) {
        return null;
    }
    return num;
};

export const getAll = async (req, res, next) => {
    try {
        const { category, area, ingredient } = req.query;
        const page = parsePage(req.query.page, 1);
        const limit = parseLimit(req.query.limit, 10, 50);

        const { recipes, meta } = await recipesService.listRecipes({
            category,
            area,
            ingredient,
            page,
            limit,
        });

        res.json({ data: { recipes, meta } });
    } catch (error) {
        next(error);
    }
};

export const getPopular = async (req, res, next) => {
    try {
        const page = parsePage(req.query.page, 1);
        const limit = parseLimit(req.query.limit, 10, 50);

        const { recipes, meta } = await recipesService.getPopularRecipes({ page, limit });

        res.json({ data: { recipes, meta } });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const idParam = req.params.id;
        if (!/^\d+$/.test(idParam)) {
            return res.status(400).json({ message: 'Invalid recipe id' });
        }
        const recipeId = Number(idParam);
        if (!Number.isInteger(recipeId) || recipeId < 1) {
            return res.status(400).json({ message: 'Invalid recipe id' });
        }

        const recipe = await recipesService.getRecipeDetail(recipeId);

        res.json({ data: recipe });
    } catch (error) {
        next(error);
    }
};

export const getOwn = async (req, res, next) => {
    try {
        const page = parsePage(req.query.page, 1);
        const limit = parseLimit(req.query.limit, 10, 50);

        const { recipes, meta } = await recipesService.getUserRecipes({
            owner_id: req.user.id,
            page,
            limit,
        });

        res.json({ data: { recipes, meta } });
    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req, res, next) => {
    try {
        const page = parsePage(req.query.page, 1);
        const limit = parseLimit(req.query.limit, 10, 50);

        const { recipes, meta } = await recipesService.getUserFavoriteRecipes({
            user_id: req.user.id,
            page,
            limit,
        });

        res.json({ data: { recipes, meta } });
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const recipe = await recipesService.createRecipe(req.user.id, req.body);

        res.status(201).json({ data: recipe });
    } catch (error) {
        next(error);
    }
};

export const addToFavorites = async (req, res, next) => {
    try {
        const recipeId = parseRecipeId(req.params.id);
        if (recipeId === null) {
            return res.status(400).json({ message: 'Invalid recipe id' });
        }

        const favorite = await recipesService.addRecipeToFavorites(req.user.id, recipeId);

        res.status(201).json({ data: favorite });
    } catch (error) {
        next(error);
    }
};

export const removeFromFavorites = async (req, res, next) => {
    try {
        const recipeId = parseRecipeId(req.params.id);
        if (recipeId === null) {
            return res.status(400).json({ message: 'Invalid recipe id' });
        }

        await recipesService.removeRecipeFromFavorites(req.user.id, recipeId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const recipeId = parseRecipeId(req.params.id);
        if (recipeId === null) {
            return res.status(400).json({ message: 'Invalid recipe id' });
        }

        await recipesService.deleteRecipe(req.user.id, recipeId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
