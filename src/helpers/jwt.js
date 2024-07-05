const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { connectToMongoDB } = require('../../common/mongosse');
const TokenRepository = require('../repository/mongoose/token.repository');

module.exports = {
    signAccessToken: async (user) => {
        try {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1h',
                issuer: 'pickurpage.com',
                audience: user.correo,
            };

            const token = JWT.sign(payload, secret, options);
            await TokenRepository.saveToken(user.correo, token, user);
            return token;
        } catch (error) {
            console.error(error.message);
            throw createError.InternalServerError();
        }
    },

    verifyAccessToken: async (req, res, next) => {
        try {
            if (!req.headers['authorization']) throw createError.Unauthorized();

            const authHeader = req.headers['authorization'];
            const bearerToken = authHeader.split(' ');
            const token = bearerToken[1];

            const cn = new connectToDatabase;
            const db = await cn.connectMongo();
            const collection = db.collection('tokens');
            const existingToken = collection.findOne({ token });

            if (!existingToken || !existingToken.isValid()) {
                throw createError.Unauthorized('Invalid access token');
            }


            const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.payload = decoded;
            next();
        } catch (error) {
            const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
            next(createError.Unauthorized(message));
        }
    },


};
