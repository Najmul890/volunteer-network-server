const express=require('express');
const MongoClient = require('mongodb').MongoClient;
const cors= require('cors');
const bodyParser= require('body-parser');
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pukwa.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;


// const pass=
// const user=VN_tasks_user
const app= express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const tasksCollection = client.db("volunteerNetwork").collection("tasks");
  const regInfo = client.db("volunteerNetwork").collection("regInfo");

  app.post('/addTasks', (req,res)=>{
    const tasks= req.body;
    
    tasksCollection.insertMany(tasks)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})
app.get('/tasks', (req,res)=>{
    tasksCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
 
  app.get('/task/:id', (req,res)=>{
    tasksCollection.find({id: req.params.id})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/addRegInfo', (req, res) => {
    const newRegister = req.body;
    regInfo.insertOne(newRegister)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })
  app.get('/regEvents',(req,res)=>{
    regInfo.find({email:req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    regInfo.deleteOne({id: req.params.id})
    .then(result=>{
      res.send(result)
    })
  })

  
});



app.get('/',(req,res)=>{
    res.send('db connected')
})

app.listen(process.env.PORT || port );