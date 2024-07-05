const { connectToMongoDB } = require("../../../common/mongosse");

const optionsFindAndUpdate = {
    upsert: true
}

module.exports = {
    async savePrestamista(email, sedeId, estado = "ACTIVO", ocupation = 0) {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('prestamista');
            const filter = { email, sedeId };
            const update = {
                $setOnInsert: { createdAt: new Date() },
                $set: { ocupation, estado, updatedAt: new Date() }
            };
            const result = await collection.updateOne(filter, update, optionsFindAndUpdate);
            return result !== null; 
        } catch (error) {
            console.error("Error al guardar token:", error);
            throw error;
        }
    },

    async getPrestamistasBySedeIdAndOcupation(sedeId, estado = "ACTIVO") {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection('prestamista');
            const filterOcupation0 = { sedeId, ocupation: 0, estado };
            const filterOcupation1 = { sedeId, ocupation: 1, estado };
            const projection = { _id: 0 };
            const sort = { updatedAt: -1 };
            console.log("Result: ");

            // Buscar prestamistas con ocupation igual a 0
            let result = await collection.findOne(filterOcupation0, { sort, projection });
            console.log("Result: ",result);
            // Si no se encuentra ninguno, buscar el último prestamista con ocupation igual a 1
            if (!result) {
                result = await collection.findOne(filterOcupation1, { sort, projection });
            }
    
            return result;
        } catch (error) {
            console.error("Error al listar prestamistas ocupados con ocupation igual a 0:", error);
            throw error;
        }
    }

}