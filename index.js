const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config()

app.get("/", (req, res) => {
  res.send("Server On Fire");
});

// const uri = `mongodb://localhost:27017/`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const run = async () => {
  try {
    const serviceCollection = client.db("geniusCar").collection("services");
    const orderCollection = client.db("geniusCar").collection("orders");
    const poroductColation = client.db("geniusCar").collection("products");
    const blogPostColation = client.db("geniusCar").collection("blogPost");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await serviceCollection.findOne(query);
      res.send(cursor);
    });
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = orderCollection.find(query);
      const orders = await result.toArray();
      console.log(orders);
      res.send(orders);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const result = poroductColation.find(query);
      const products = await result.toArray();
      res.send(products);
    });

    app.post("/blog/post", async (req, res) => {
      const blogPost = req.body;
      console.log(blogPost)
      const result = await blogPostColation.insertOne(blogPost);
      console.log(result)
      res.send(result);
    });

    app.get('/blogs',async(req,res)=>{
        const query = {}
        const result = blogPostColation.find(query)
        const blogPost = await result.toArray()
        res.send(blogPost);
    })

    app.get('/blog/:id',async(req,res)=>{
        const id =  req.params.id
        const query = {_id:ObjectId(id)}
        const result = await  blogPostColation.findOne(query);
        res.send(result);
    })


  } finally {
  }
};

run();

app.listen(port, () => {
  console.log(`Server fire On ${port}`);
});
