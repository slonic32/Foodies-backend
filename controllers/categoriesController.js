import * as categoriesService from '../services/categoriesServices.js';

export const getCategoriesController = async (req, res, next) => {
    try {
        const categories = await categoriesService.getCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};
