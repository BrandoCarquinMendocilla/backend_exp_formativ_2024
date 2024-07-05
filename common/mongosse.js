const { MongoClient } = require('mongodb');
require('dotenv').config();

async function connectToMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    return client.db(); // Retorna el objeto de base de datos
  } catch (error) {
    throw error;
  }
}


 module.exports = {connectToMongoDB};
