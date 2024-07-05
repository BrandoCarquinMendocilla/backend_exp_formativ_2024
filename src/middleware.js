const { connectToMongoDB } = require('../common/mongosse');
const request = require('./functions/request');
const res = require('./functions/response');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const response = require('../src/functions/response');

const rateLimiter = new RateLimiterMemory({
	points: 10,
	duration: 1,
	blockDuration: 5 * 60
});

exports.handleErr = async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		ctx.status = e.status || 500;
		ctx.body = res.error(e.message, e.user, ctx.status);
		console.error(e, ctx);
	}
};

exports.log = async (ctx, next) => {
	const {
		method,
		url,
		query,
		files,
		request: {
			body,
			headers,
			headers: { 'content-type': type }
		}
	} = ctx;

	console.log('request:', method, url);
	if (Object.keys(query).length) console.log('query:', query);
	if (files) console.log('files:', files);
	if (type != 'text/plain') console.log('body:', body);
	console.log('headers:', headers);

	await next();

	const { response: { status, body: resBody } } = ctx;
	console.log('response:', status, resBody);
};

exports.limiter = async (ctx, res, next) => {
	try {
		const currentLimit = await rateLimiter.consume(ctx.ip);

		console.log(`Request Number: ${currentLimit.consumedPoints}`);
		console.log(`Remaining Requests: ${currentLimit.remainingPoints}`);
	} catch (limitError) {
		console.log(`Blocked IP: ${ctx.ip}`);
		console.log(`Request Number: ${limitError.consumedPoints}`);

		throw res.handle('Too Many Requests', 429);
	}

	await next();
};

exports.loadSession = async (req, res, next) => {
	const token = req.session.token
	console.log('token', req.session.token);
	if (token) {
		const db = await connectToMongoDB();
		const collection = db.collection('tokens');
		const getToken = await collection.findOne({ token: token });
		if (!getToken) {
			return response.error(res, { message: 'El token enviado es invalido' }, 401);
		} else {
			req.session.user = getToken.user;
			req.session.token = token;
		}

	} else {
		req.session.token = null;
		return response.error(res, { message: 'Debe enviar el Authorization: Bearer [token]' }, 401);
	}
	await next();
};
/*
exports.decryptBody = async (ctx, next) => {
	const { request: { body, headers: { 'content-type': type } } } = ctx;

	if(process.env.NODE_ENV == 'production'){
		if(type != 'text/plain') throw res.handle('hubo un problema al asegurar el inicio de sesión', 400, true);

		try {
			console.log('encrypted body:', body);
			const decrypted = encryption.decryptObj(body);
			console.log('decrypted body:', decrypted);
			
			ctx.request.body = decrypted;
		} catch(e) {
			console.error(e);
			throw res.handle('hubo un problema al asegurar el inicio de sesión', 400, true);
		}
	}

	await next();
};

exports.secureRequest = async (ctx, next) => {
	const { header, state: { session } } = ctx; 
	const { ['x-totp']: otp } = header;
	const { documentNumber: username } = session;

	if(process.env.ACTIVE_SECURITY == '1'){
		if(!otp || !username) throw res.handle('No se envió la cabecera necesaria.', 401, 'No se puede validar esta transacción');

		const params = {
			method: 'POST',
			rejectUnauthorized: false,
			uri: `${process.env.ENDPOINT_VU}${cons.REQUEST.TOTP_LOGIN}`,
			body: {
				otp,
				username
			},
			json: true
		};

		let response = await request(params);

		if(response.code != 201) 
			throw res.handle(response.message, 400, 'Estimado socio, su token digital se encuentra desactivado. Por favor vuelva a realizar la identificación de su identidad');
	}

	await next();
};*/
