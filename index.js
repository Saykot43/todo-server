const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://saykot:lcQucXFcmcIDcO47@cluster0.jwoc8.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("todo").collection("user");

        // Read all data
        app.get('/users', async (req, res) => {
            const quary = req.query;
            const cursor = userCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // Create a data
        app.post('/userAdd', async (req, res) => {

            const data = req.body;

            const result = await userCollection.insertOne(data);
            res.send(result);
            // console.log('user added successfully');
        })

        // Update a data

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...data,
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // // Delete a data

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})