import { Ingredient } from '../db/models/ingredientsModel.js';

export const getAllIngredients = async () => {
    const ingredients = await Ingredient.findAll({
        attributes: ['id', 'name', 'description', 'img'],
        order: [['name', 'ASC']],
    });

    return ingredients;
};
