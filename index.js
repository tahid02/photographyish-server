const express = require("express");
const { findAllData, findFilteredData } = require("./lib/getData");
const { insertData } = require("./lib/postData");
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");
require("dotenv").config();
const { ObjectID } = require('mongodb')
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ers.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    console.log({ err });
  }
  // collections
  const servicesCollection = client
    .db("photographyishDB")
    .collection("services");
  const adminsCollection = client.db("photographyishDB").collection("admins");
  const ordersCollection = client.db("photographyishDB").collection("orders");
  console.log("database connected");

  // perform actions on the collection here

  app.post("/addServices", (req, res) => {
    const newServices = req.body;
    // console.log('adding new services: ', newServices)
    servicesCollection
      .insertOne(newServices)
      .then((result) => {
        // console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log({ err }));
  });

  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, services) => {
      res.send(services);
    });
  });

  app.get("/checkOut/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    // console.log(id)
    servicesCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/addOrder", (req, res) => {
    const newRent = req.body;
    // console.log('adding new event: ', newRent)
    ordersCollection
      .insertOne(newRent)
      .then((result) => {
        // console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log({ err }));
  });

  app.get("/userOrders", (req, res) => {
    const queryEmail = req.query.email;
    console.log("user orders", queryEmail);
    ordersCollection.find({ email: queryEmail }).toArray((err, documents) => {
      console.log(documents);
      res.send(documents);
    });
  });

  app.get("/allOrders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      // console.log(documents)
      res.send(documents);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    console.log("admin checking email", email);
    adminsCollection.find({ email: email }).toArray((err, admins) => {
      console.log(admins);
      res.send(admins.length > 0);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    servicesCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log("deleted", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
  });

  //   client.close();
});
// adminCollection
//   .insertOne({ email: "tanzim1463@gmail.com" })
//   .then((result) => {
//     console.log("inserted count", result.insertedCount);
//   });
// custom error handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
