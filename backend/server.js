const password = require("./EnvVariables/MongoDBVars.js");
const {
  ReviewSchema,
  UserSchema,
  TokenSchema,
  ProfileImgSchema,
} = require("./schema.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const {
  saltAndHashPassword,
  hashSaltedPassword,
  hashFilename,
} = require("./saltAndHash.js");
const uri = `mongodb+srv://pwalis:${password}@clusterwilky.k8hppvu.mongodb.net/?retryWrites=true&w=majority`;
const multer = require("multer");
const { uploadFile, getFile, deleteFile, getPresignedUrl } = require("./S3.js");

const connection = mongoose.createConnection(uri);
const Review = connection.model("Review", ReviewSchema);
const User = connection.model("User", UserSchema);
const Token = connection.model("Token", TokenSchema);
const ProfileImg = connection.model("ProfileImg", ProfileImgSchema);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  user.reviews.push(review);
  await user.save();
});

//list reviews
app.post("/reviews", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID })
    .populate("reviews")
    .exec();
  if (!user) {
    res.send("No user found");
    return;
  } else if (user.reviews.length === 0) {
    res.send("No reviews found");
    return;
  }
  res.send(user.reviews);
});

//update review
app.put("/update", async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.body.id },
    {
      name: req.body.title,
      rating: req.body.rating,
      comment: req.body.comment,
    }
  )
    .then((review) => {
      res.json({ message: "Review updated successfully" });
    })
    .catch((err) => {
      res.status(400).send({ message: "unable to update the database" });
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

//authenticate user and create token: use this route if user doesn't have a non-expired token
app.post("/authenticate", async (req, res) => {
  const generatedToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.send({ message: "User not found" });
  } else {
    const token = new Token({
      token: generatedToken,
      userId: req.body.userId,
    });
    token.save().catch((err) => {
      res.status(400).send({ message: "unable to save to database" });
    });
    const hash = hashSaltedPassword(req.body.password, user.salt);
    if (user.hash === hash) {
      res.send({
        message: "User authenticated",
        id: user._id,
        authenticated: true,
        token: generatedToken,
        expires: "432000",
      });
    } else {
      // res.send("User not authenticated" + "\nSalt: " + user.salt + "\nhash: " + user.hash + "\nreturned Hash: " + hash);
      res.send({ message: "User not authenticated" });
    }
  }
});

//authenticate with token: use this route when user has a non-expired token
app.post("/authenticateToken", async (req, res) => {
  const token = await Token.findOne({ userId: req.body.userId });
  if (!token) {
    res.send({ message: "Token not found" });
  } else {
    if (token.token === req.body.token) {
      res.send({ message: "User authenticated", authenticated: true });
    } else {
      res.send({ message: "User not authenticated" });
    }
  }
});

//list tokens
app.get("/listTokens", async (req, res) => {
  const tokens = await Token.find({});
  res.send(tokens);
});

//upload image
app.post("/upload", upload.single("image"), async (req, res) => {
  if (await ProfileImg.findOne({ userID: req.body.userId })) {
    await ProfileImg.deleteOne({ userID: req.body.userId });
  }
  await uploadFile(req.file, req.body.username);
  const filename = hashFilename(req.file.originalname, req.body.username);
  const profileImg = new ProfileImg({
    fileName: filename,
    userID: req.body.userId,
  });
  console.log("username: " + req.body.userId);
  await profileImg
    .save()
    .then((profileImg) => {
      res.json({ message: "Profile image added successfully" });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

//get image
app.post("/image", async (req, res) => {
  console.log("username: " + req.body.userId);
  await ProfileImg.findOne({ userID: req.body.userId })
    .then(async (profileImg) => {
      const s3Response = await getPresignedUrl(
        "media-review",
        profileImg.fileName
      );
      res.send({ signedUrl: s3Response });
    })
    .catch((err) => {
      res.status(400).send("unable to find image in database");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
