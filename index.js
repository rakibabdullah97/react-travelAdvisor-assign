const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId


require('dotenv').config();
const cors = require('cors')



const app = express();
const port = process.env.PORT || 5000;

// middleWere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzy7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelDeals')
        const dealsCollection = database.collection('deals')

        const database2 = client.db('travelDeals')
        const bookingCollection = database2.collection('booking')

        //Get Api
        app.get('/deals', async (req, res) => {
            const cursor = dealsCollection.find({})
            const deals = await cursor.toArray()
            res.send(deals)
        })
        //Get Single Service
        app.get('/deals/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const deal = await dealsCollection.findOne(query)
            res.json(deal)
        })
        // Post api
        app.post('/deals', async (req, res) => {
            //  console.log('post can go')
            //  res.send('post hitted')
            const deal = req.body
            const result = await dealsCollection.insertOne(deal)
            res.json(result)
        })
        //Add Booking
        app.post('/addbooking', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body);
            res.send(result)
        })
        //Get All booking
        app.get('/allbooking', async (req, res) => {
            const result = await bookingCollection.find({}).toArray()
            res.send(result)
        })
        //Delete Booking
        app.delete('/deletebooking/:id', async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.send(result)
        })

        //Update Deal Status
        app.put('/deletebooking/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const filter = {_id :ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: status
                },
              };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result)
            
        })
        //My Booking
        app.get('/mybooking/:email', async (req, res) => {
            const result = await bookingCollection.find({
                email: req.params.email
            }).toArray();
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }

}


run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Travel Advisor')
})

app.listen(port, () => {
    console.log('Running Travel Advisor', port)
})