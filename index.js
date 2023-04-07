//get all imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//create app with express
const app = express();
// use encoded url
app.use(bodyParser.urlencoded({ extended: true }));
//connect to database
mongoose.connect(
  "mongodb+srv://gimble91:Testi12@apiproject.ju2r410.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
// creating new schema for te json data
const account = new mongoose.Schema({
  fname: String,
  lname: String,
  city: String,
  phone: Number
});
// put the schema in the constat Item
const Item = mongoose.model("Item", account);
// use bodyparser
app.use(bodyParser.json());
// get all items in the database
app.get("/api/getall", async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get 1 json data with spesific id
app.get("/api/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// add new data to the database
app.post("/api/add", async (req, res) => {
  const item = new Item({
    fname: req.body.fname,
    lname: req.body.lname,
    city: req.body.city,
    phone: req.body.phone
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// update old data in the database with spesific id
app.put("/api/update/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data not found" });
    }
    item.fname = req.body.fname || item.fname;
    item.lname = req.body.lname || item.lname;
    item.city = req.body.city || item.city;
    item.phone = req.body.phone || item.phone;
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// delete data with spesific id
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data not found" });
    }
    await item.deleteOne();
    res.status(200).json({ message: "Data removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// starting server and lisetning to port 3000
app.listen(3000, () =>
  console.log("Server started on http://localhost:3000/api/getall")
);
