import Joi from 'joi';

const id = () =>
    Joi.number().integer().positive().messages({
        'number.base': '{{#label}} must be a number',
        'number.integer': '{{#label}} must be an integer',
        'number.positive': '{{#label}} must be a positive number',
    });

export const searchRecipesSchema = Joi.object({
    category: id(),
    area: id(),
    ingredient: id(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
});

export const createRecipeSchema = Joi.object({
    title: Joi.string().trim().min(3).max(120).required().messages({
        'string.min': 'title must be at least 3 characters',
        'string.max': 'title must be at most 120 characters',
        'any.required': 'title is required',
    }),

    description: Joi.string().trim().min(10).max(1000).required().messages({
        'string.min': 'description must be at least 10 characters',
        'any.required': 'description is required',
    }),

    instructions: Joi.string().trim().min(20).required().messages({
        'string.min': 'instructions must be at least 20 characters',
        'any.required': 'instructions is required',
    }),

    thumb: Joi.string().uri().allow('', null).messages({
        'string.uri': 'thumb must be a valid URL',
    }),

    time: Joi.number().integer().min(1).max(1440).allow(null).messages({
        'number.min': 'time must be at least 1 minute',
        'number.max': 'time must be at most 1440 minutes (24 h)',
    }),

    category_id: id().allow(null).messages({
        'number.integer': 'category_id must be an integer ID',
    }),

    area_id: id().allow(null).messages({
        'number.integer': 'area_id must be an integer ID',
    }),

    ingredients: Joi.array().items(id().required()).min(1).default([]).messages({
        'array.min': 'provide at least one ingredient',
        'number.integer': 'each ingredient must be an integer ID',
    }),
});
