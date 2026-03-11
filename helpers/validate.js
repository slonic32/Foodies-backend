import HttpError from './HttpError.js';

export function validate(schema, body) {
    const { value, error } = schema.validate(body);
    if (error) {
        throw HttpError(400, error.details.map((err) => err.message).join(' ; '));
    }
}

export function validateID(contactId) {
    // only  integers
    if (!/^[1-9]\d*$/.test(String(contactId))) {
        return false;
    }

    return true;
}
