const request = require('request-promise-native');
const _ = require('lodash');
const res = require('../functions/response');
const cons = require('../constants');

module.exports = async (params) => {
	try {
		let currentUri = params.uri;
		if(params.qs) {
			let query = [];
			_(Object.keys(params.qs)).each(item => {
				query.push(`${item}=${params.qs[item]}`);
			});
			currentUri = `${currentUri}?${query.join('&')}`;
		}

		params.timeout = 30000;
		params.rejectUnauthorized = false;
		params.json = true;

		logger.log('Request Uri:', currentUri);
		logger.log('Request Params:', params);

		const currentRequest = await request(params);

		logger.log('Request Body:', currentRequest);

		switch (true) {
			case currentUri.includes(cons.REQUEST.NEW_INSURANCE):
			case currentUri.includes(cons.REQUEST.INSURANCE_SOAT):
				break;
			case currentUri.includes(process.env.ENDPOINT_APP):
				if ((currentRequest.codigoError && cons.ALLOWED_ERRORS.indexOf(currentRequest.codigoError) == -1) || !currentRequest.codigoError){
					const error = new Error;
					error.statusCode = 400;
					error.error = currentRequest;
					error.fatal = !currentRequest.codigoError;
					throw error;
				}
				break;
			case currentUri.includes(process.env.ENDPOINT_DINERSCLUB_JOIN):
				if ((currentRequest.codigoError && cons.ALLOWED_ERRORS_JOIN.indexOf(currentRequest.codigoError) == -1) || !currentRequest.codigoError){
					const error = new Error;
					error.statusCode = 400;
					error.error = currentRequest;
					error.fatal = !currentRequest.codigoError;
					throw error;
				}
				break;
		}
		
		return currentRequest;
	} catch(e) {
		let currentError;
		let requestBody = `Request Uri: ${params.uri} Request Body: ${JSON.stringify(e.error)}`;
		if(e.error && !e.error.code) currentError = e.error.descripcion || e.error.error_description || e.error.error || e.error.message || e.error.errorMessage || 'Ocurrió un error.';
		if(currentError instanceof Object) currentError = currentError.errorMessage || 'Ocurrió un error.';
		if(currentError && !currentError.toUpperCase().includes('ESTIMADO SOCIO')) currentError = `Estimado Socio, ${currentError.toLowerCase()}`;
		if(e.fatal) {
			currentError = 'Estimado socio, por favor vuelva a intentarlo en unos minutos.';
		}

		throw res.handle(requestBody, e.statusCode, currentError);
	};
};