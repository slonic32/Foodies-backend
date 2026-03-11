import HttpError from '../helpers/HttpError.js';
import { validate } from '../helpers/validate.js';

// check request
export function validateBody(schema) {
    function funcValidate(req, res, next) {
        try {
            validate(schema, req.body);
            next();
        } catch (error) {
            next(error);
        }
    }

    return funcValidate;
}
