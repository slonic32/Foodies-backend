import { Testimonial } from '../db/models/testimonialsModel.js';
import { User } from '../db/models/usersModel.js';


export const getTestimonials = async () => {
    const testimonials = await Testimonial.findAll({
        attributes: ['id', 'owner_id', 'testimonial'],
        include: [
            {
                model: User,
                as: 'owner',
                attributes: ['name'],
            },
        ],
    });

    return testimonials.map((item) => ({
        id: item.id,
        testimonial: item.testimonial,
        owner_id: item.owner_id,
        ownerName: item.owner?.name || '',
    }));
};