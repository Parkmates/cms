
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://febriantopermana16:fp160201@febh8.p4n2u.mongodb.net/?retryWrites=true&w=majority&appName=FebH8";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("FinalProject")

export default database
