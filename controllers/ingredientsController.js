import { getAllIngredients } from '../services/ingredientsServices.js';

export const getIngredientsController = async (req, res, next) => {
    try {
        const ingredients = await getAllIngredients();

        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
};
