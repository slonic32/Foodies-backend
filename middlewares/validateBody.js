import HttpError from '../helpers/HttpError.js';
import { validate } from '../helpers/validate.js';

// check request
export function validateBody(schema, source = 'body') {
    function funcValidate(req, res, next) {
        try {
            validate(schema, req[source]);
            next();
        } catch (error) {
            next(error);
        }
    }

    return funcValidate;
}
