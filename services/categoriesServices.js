import { Category } from '../db/models/categoriesModel.js';

export const getCategories = async () => {
    return Category.findAll({
        attributes: ['id', 'name'],
    });
};
