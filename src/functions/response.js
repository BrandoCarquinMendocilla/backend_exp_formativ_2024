// response.js

const _ = require('lodash');

exports.success = (res, data = {}, statusCode = 200) => {
    if (data instanceof _) data = data.value();

    const obj = {
        success: true,
        body: {
            statusCode,
            data
        }
    };

    return res.status(statusCode).json(obj);
};

exports.error = (res, data = { errorMessage: 'Estimado socio, por favor vuelva a intentarlo en unos minutos.' }, errorCode = 500) => {
    const obj = {
        success: false,
        error: {
            errorCode: errorCode,
            data
        }
    };

    return res.status(errorCode).json(obj);
};

exports.handle = (errorMessage = 'Ocurrió un error', errorCode = 400, errorUser) => {
    const error = new Error(errorMessage);
    error.status = errorCode;

    if (typeof errorUser === 'string') error.user = errorUser;
    else if (errorUser === true) error.user = `Estimado socio, ${errorMessage}`;
    console.log(error);
    return error;
};
