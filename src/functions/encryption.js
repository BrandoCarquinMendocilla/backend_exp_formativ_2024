const crypto = require('crypto');

const encryptKey = process.env.ENCRYPTION_KEY_LOGIN;
const encryptIv = process.env.ENCRYPTION_IV_LOGIN;
const imageKey = process.env.ENCRYPTION_KEY_RENIEC;
const imageIv = process.env.ENCRYPTION_IV_RENIEC;

const encrypt = (value, key = encryptKey, iv = encryptIv) => {
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(value);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return encrypted.toString('base64');
};

const decrypt = (value, key, iv) => {
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(value, 'base64');
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
};

exports.generateKeys = length => {
	return crypto.randomBytes(length)
		.toString('base64')
		.slice(0, length);
};

exports.encryptImage = (image, token) => {
	const keyBuffer = Buffer.from(`${imageKey}${token.slice(0, 20)}`, 'utf8');
	const keyToUse = crypto.createHash('sha256').update(keyBuffer).digest('sha256');
	const ivToUse = Buffer.from(imageIv, 'utf8');

	const encryptedImage = encrypt(image, keyToUse, ivToUse);

	return encryptedImage;
};

exports.encryptObj = obj => {
	const stringify = JSON.stringify(obj);
	return encrypt(stringify);
};

exports.decryptObj = obj => {
	const stringify = decrypt(obj);
	return JSON.parse(stringify);
};