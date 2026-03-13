import { Testimonial } from '../db/models/testimonialsModel.js';

export const getTestimonials = async () => {
    return Testimonial.findAll({
        attributes: ['id', 'owner_id', 'testimonial'],
    });
};
