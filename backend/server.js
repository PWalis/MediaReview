const password = require("./EnvVariables/MongoDBVars.js");
const { ReviewSchema, UserSchema } = require("./schema.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const { saltAndHashPassword, hashSaltedPassword } = require("./saltAndHash.js");
const uri = `mongodb+srv://pwalis:${password}@clusterwilky.k8hppvu.mongodb.net/?retryWrites=true&w=majority`;

const connection = mongoose.createConnection(uri);
const Review = connection.model("Review", ReviewSchema);
const User = connection.model("User", UserSchema);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//creates a review and adds it to the user's ref array
app.post("/createReview", async (req, res) => {
  const user = await User.findOne({ username: req.body.username }); //eventually change this to _id
  const review = new Review({
    name: req.body.name,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  review
    .save()
    .then((review) => {
      res.json("Review added successfully");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
  user.ref.push(review);
  await user.save();
});

//list reviews
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find({});
  res.send(reviews);
});

//update review
app.put("/update", async (req, res) => {
  const review = await Review.findOneAndUpdate({_id: req.body.id}, {
    name: req.body.title,
    rating: req.body.rating,
    comment: req.body.comment,
  })
    .then((review) => {
      res.json({message: "Review updated successfully"});
    })
    .catch((err) => {
      res.status(400).send({message: "unable to update the database"});
    });
});

//delete all reviews
app.delete("/delete", async (req, res) => {
  const reviews = await Review.deleteMany({});
  res.send(reviews);
});

//create user
app.post("/createUser", async (req, res) => {
  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) {
    res.send("That username is already taken");
    return;
  }
  const { salt, hash } = saltAndHashPassword(req.body.password);
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    hash: hash,
    salt: salt,
  });
  user
    .save()
    .then((user) => {
      res.json("User added successfully");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

//list users
app.get("/listUsers", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

//delete all users
app.delete("/deleteUsers", async (req, res) => {
  const users = await User.deleteMany({});
  res.send(users);
});

//delete one user
app.delete("/deleteOneUser", async (req, res) => {
  await User.deleteOne({ username: req.body.username });
  res.send("User deleted");
});

//authenticate user
app.post("/authenticate", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.send({message: "User not found"});
  } else {
    const hash = hashSaltedPassword(req.body.password, user.salt);
    if (user.hash === hash) {
      res.send({ message: "User authenticated", id: user._id, authenticated: true });
    } else {
      // res.send("User not authenticated" + "\nSalt: " + user.salt + "\nhash: " + user.hash + "\nreturned Hash: " + hash);
      res.send({ message: "User not authenticated" });
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
