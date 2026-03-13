import * as testimonialsService from '../services/testimonialsServices.js';

export const getTestimonialsController = async (req, res, next) => {
    try {
        const testimonials = await testimonialsService.getTestimonials();

        res.json(testimonials);
    } catch (error) {
        next(error);
    }
};
