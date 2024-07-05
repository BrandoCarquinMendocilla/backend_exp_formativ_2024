const { connectToMongoDB } = require("../../../common/mongosse");

const optionsFindAndUpdate = {
    upsert: true
}

module.exports = {

    async getPagesByRole(role_id) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('pages');
            const filter = { role_id };            
            const result = await collection.findOne(filter);
            return result.pages; 
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error; // Relanza el error para que sea manejado en otro lugar
        }
    },
}