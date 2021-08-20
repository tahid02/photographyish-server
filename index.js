const express = require("express");
const { findAllData, findFilteredData } = require("./lib/getData");
const { insertData } = require("./lib/postData");
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");
require("dotenv").config();
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
  const adminCollection = client.db("photographyishDB").collection("admins");
  const ordersCollection = client.db("photographyishDB").collection("orders");
  console.log("database connected");

  // perform actions on the collection here

  app.post("/addServices", async (req, res) => {
    const postData = await insertData(servicesCollection, req.body);
    res.send(postData);
  });

  app.get("/services", (req, res) => {
    const findData = findAllData(servicesCollection);
    res.send(findData);
  });

  app.get("/checkOut/:id", async (req, res) => {
    const id = ObjectID(req.params.id);
    const paramData = await findFilteredData(servicesCollection, _id, id);
    res.send(paramData[0]);
  });

  app.post("/addOrder", async (req, res) => {
    const postData = await insertData(ordersCollection, req.body);
    res.send(postData);
  });

  app.get("/userOrder", async (req, res) => {
    const paramData = await findFilteredData(
      ordersCollection,
      email,
      req.query.email
    );
    res.send(paramData);
  });

  app.get("/allOrder", async (req, res) => {
    const findData = await findAllData(ordersCollection);
    res.send(findData);
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
