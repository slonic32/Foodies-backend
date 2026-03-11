import { validate } from '../helpers/validate.js';
import { registerSchema } from '../schemas/userSchemas.js';

export async function authValidate(req, res, next) {
    try {
        validate(registerSchema, req.body);
        next();
    } catch (error) {
        next(error);
    }
}
