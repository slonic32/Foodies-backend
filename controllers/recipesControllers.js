import * as recipesService from '../services/recipesServices.js';

export const getAll = async (req, res, next) => {
    try {
        const { category, area, ingredient, page, limit } = req.query;

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
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 50);

        const { recipes, meta } = await recipesService.getPopularRecipes({ page, limit });

        res.json({ data: { recipes, meta } });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const recipe = await recipesService.getRecipeDetail(req.params.id);

        res.json({ data: recipe });
    } catch (error) {
        next(error);
    }
};

export const getOwn = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 50);

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

export const create = async (req, res, next) => {
    try {
        const recipe = await recipesService.createRecipe(req.user.id, req.body);

        res.status(201).json({ data: recipe });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await recipesService.deleteRecipe(req.user.id, req.params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
