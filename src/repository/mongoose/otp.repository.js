const { connectToMongoDB } = require("../../../common/mongosse");

const optionsFindAndUpdate = {
    upsert: true
}

module.exports = {
    async saveOtp(event, otp, email) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('otp');
            const filter = { email, event };
            const expirationDate = new Date();
            const ttlSeconds = 900;
            expirationDate.setSeconds(expirationDate.getSeconds() + ttlSeconds);
            const update = { $set: { otp, expirationDate, createdAt: new Date(), } };
            collection.createIndex({ "expirationDate": 1 }, { expireAfterSeconds: 0 });
            const result = await collection.updateOne(filter, update, optionsFindAndUpdate);
            return result;
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error; // Relanza el error para que sea manejado en otro lugar
        }
    },

    async getOtp(email, otp, event) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('otp');
            const filter = { email, event, otp };            
            const result = await collection.findOne(filter);
            return result !== null; 
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error; // Relanza el error para que sea manejado en otro lugar
        }
    },

    async deleteOtp(email, otp, event) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('otp');
            const filter = { email, event, otp };            
            const result = await collection.deleteOne(filter);
            return result !== null; 
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error; // Relanza el error para que sea manejado en otro lugar
        }
    }
}