const { connectToMongoDB } = require("../../../common/mongosse");


module.exports = {

    async getPropuesta() {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('propuesta');     
            const result = await collection.findOne({});
            return result
        } catch (error) {
            console.error("Error al guardar OTP:", error);
            throw error;
        }
    }
}