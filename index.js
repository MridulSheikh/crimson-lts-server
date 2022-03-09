const express = require('express');
const app = express();
const cors = require("cors")
require('dotenv').config()
const {MongoClient} = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const port = process.env.PORT || 5000;

//middlewars
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&writeConcern=majority`;
const client = new MongoClient(uri);

async function run(){
    try{
        await client.connect()
        const databse = client.db('delta-medicale')
        const serviceCollection = databse.collection('service')
        const appointmentCollection = databse.collection('appointments')
        const contectCollection = databse.collection('Contect')
        const usersCollection = databse.collection('users')
        const adminCollection = databse.collection('Admin')
        app.get('/service',async (req, res)=>{
            const curser = serviceCollection.find({});
            const service = await curser.toArray();
            res.send(service);
        })
        app.get(`/service/:id`, async(req, res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id : ObjectId(id)};
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        app.put('/appointment', async (req, res)=>{
            const body = req.body;
            console.log(body)
            const fillter = {_id : ObjectId(body.id)};
            const updateDoc = {
                $set:{
                    status : body.status
                },
            };
            const result = await appointmentCollection.updateOne(fillter, updateDoc);
            res.json(result)
        })
        app.post('/appointment', async (req, res)=>{
            const body = (req.body);
            const appointment = await appointmentCollection.insertOne(body)
            res.json(appointment)
        })
        app.get('/appointment', async (req, res) => {
            const cursor = appointmentCollection.find({});
            const appointment = await cursor.toArray();
            res.send(appointment);
        })
        app.get('/appointment/:email', async (req, res) =>{
             const email = req.params.email;
             const cursser = appointmentCollection.find({});
             const appointment = await cursser.toArray();
             const query = appointment.filter(data => data.userEmail === email);
             res.send(query)
             
        })
        app.post('/contect', async (req, res)=>{
            const body = req.body;
            const contect = await contectCollection.insertOne(body);
            res.json(contect)
        })
        app.get('/contect', async (req, res)=>{
            const curser = contectCollection.find({});
            const contect = await curser.toArray();
            res.send(contect)
        })
        app.get('/contect/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await contectCollection.findOne(query);
            res.send(result)
        })
        app.delete('/contect/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await contectCollection.deleteOne(query);
            res.send(result)
        })
        app.delete('/appointment/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await appointmentCollection.deleteOne(query)
            res.json(result)
        })
        app.put('/users', async (req, res)=>{
            const user = req.body;
            console.log(user)
            const fillter = {email : user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(fillter, updateDoc, options);
            res.json(result)
        })
        app.get('/users', async(req, res)=>{
            const curser = usersCollection.find({});
            const users = await curser.toArray();
            res.send(users)
        })
        app.get('/users/:email', async(req, res) =>{
            const email = req.params.email;
            const cuser = usersCollection.find({});
            const users = await cuser.toArray();
            const query = users.filter(user => user.email === email);
            res.send(query)
        })
        app.post('/admin', async (req, res)=>{
            const body = req.body;
            const admin = await adminCollection.insertOne(body);
            res.json(admin)
        })
        app.get('/admin', async (req, res)=>{
            const curser = adminCollection.find({});
            const admin = await curser.toArray();
            res.send(admin)
        })
        app.delete('/admin/:email', async (req, res)=>{
            const email = req.params.email;
            const query = {email : email};
            const result = await adminCollection.deleteOne(query);
            res.json(result)
        })
        app.get('/admin/:email', async (req, res)=>{
            const email = req.params.email;
            const query = {email : email};
            const admin = await adminCollection.findOne(query);
            res.json(admin)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)
app.get('/',(req, res)=>{
    res.send('delta medicale server running this port')
})
app.listen(port, () => {
    console.log (`server running ${port}`)
})