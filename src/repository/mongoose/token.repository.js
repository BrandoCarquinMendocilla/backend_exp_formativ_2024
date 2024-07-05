const { connectToMongoDB } = require("../../../common/mongosse");

const optionsFindAndUpdate = {
    upsert: true
}

module.exports = {
    async saveToken(email, token, user) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('tokens');
            const filter = { email };
            const expirationDate = new Date();
            const ttlSeconds = 3600;
            expirationDate.setSeconds(expirationDate.getSeconds() + ttlSeconds);
            const update = { $set: { token, expirationDate, createdAt: new Date(), user } };
            collection.createIndex({ "expirationDate": 1 }, { expireAfterSeconds: 0 });
            const result = await collection.updateOne(filter, update, optionsFindAndUpdate);
            return result;
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error; // Relanza el error para que sea manejado en otro lugar
        }
    },

    async deleteToken(email) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('tokens');
            const filter = { email };
            const result = await collection.deleteOne(filter);
            console.log('delete', result)
            return result.deletedCount;
        } catch (error) {
            console.error("Error al eliminar token:", error);
            throw error;
        }
    }
    
}