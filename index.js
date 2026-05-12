
const dns = require("node:dns");
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();

const app = express()
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

// middleware
app.use(cors());
app.use(express.json());

// --------------------------mongodb start--------------------------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    
    // -----------server db code start---------------
    const db = client.db('wanderlast');
    const destinationCollection = db.collection('destinations');

    // get
    app.get('/destination', async (req, res) => {
      const result = await destinationCollection.find().toArray();
      console.log(result);
      // res.send(result);
      res.json(result);
    });

    // post
    app.post('/destination', async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);
      // console.log(result);
      // res.send(result);
      res.json(result);
    });

    // update

    // delete
    // -----------server db code ends----------------


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// --------------------------mongodb ends---------------------------------------

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});