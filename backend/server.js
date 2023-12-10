// const password = require("./EnvVariables/MongoDBVars.js");
const {
  ReviewSchema,
  UserSchema,
  TokenSchema,
  ProfileImgSchema,
} = require("./schema.js");
require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const {
  saltAndHashPassword,
  hashSaltedPassword,
  hashFilename,
} = require("./saltAndHash.js");
const uri = process.env.URI;
const multer = require("multer");
const { uploadFile, getPresignedUrl } = require("./S3.js");

const connection = mongoose.createConnection(uri);
const Review = connection.model("Review", ReviewSchema);
const User = connection.model("User", UserSchema);
const Token = connection.model("Token", TokenSchema);
const ProfileImg = connection.model("ProfileImg", ProfileImgSchema);

// app.use(express.static(path.resolve(__dirname, "../build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.get("*", function (req, res) {
//   res.sendFile(path.resolve(__dirname, "../build", "index.html"));
// });

//creates a review and adds it to the user's ref array
app.post("/createReview", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID }); //find user by id
  if (!user) {
    res.send("No user found");
    return;
  }

  const review = new Review({
    title: req.body.title,
    rating: req.body.rating,
    content: req.body.content,
    draft: req.body.draft,
  });

  review
    .save()
    .then((review) => {
      res.json("Review added successfully");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
  if (req.body.draft) {
    user.drafts.push(review);
  } else {
    user.reviews.push(review);
  }
  await user.save();
});

//list Drafts
app.post("/drafts", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID })
    .populate("drafts")
    .exec();
  if (!user) {
    res.send("No user found");
    return;
  } else if (user.drafts.length === 0) {
    res.send("No drafts found");
    return;
  }
  res.send(user.drafts);
  await user.depopulate("drafts");
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
  await user.depopulate("reviews");
});

//get review
app.post("/getReview", async (req, res) => {
  const review = await Review.findOne({ _id: req.body.id });
  if (!review) {
    res.send("No review found");
    return;
  }
  res.send(review);
});

//update review
app.put("/update", async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.body.id },
    {
      title: req.body.title,
      rating: req.body.rating,
      content: req.body.content,
      draft: req.body.draft,
    }
  )
    .then((review) => {
      res.json({ message: "Review updated successfully" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "unable to update the database", error: err });
    });
});

//Move review from drafts to reviews
app.put("/publish", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.send("No user found");
    return;
  } else if (user.drafts.length === 0) {
    res.send("No drafts found");
    return;
  } else {
    const review = await Review.findOneAndUpdate(
      { _id: req.body.id },
      {
        content: req.body.content,
        title: req.body.title,
        rating: req.body.rating,
        draft: false,
      }
    );
    user.reviews.push(review);
    user.drafts.splice(user.drafts.indexOf(review), 1);
    console.log(review._id);
    await user.save();
    res.send("Review published");
  }
});

//delete review
app.delete("/delete", async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.body.id })
    .then((review) => {
      res.json({ message: "Review deleted successfully" });
    })
    .catch((err) => {
      res.status(400).send("unable to delete from database");
    });
});

//delete all reviews and drafts from user
app.delete("/deleteAll", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.send("No user found");
    return;
  } else if (user.reviews.length === 0) {
    res.send("No reviews found");
    return;
  } else {
    user.reviews.forEach(async (review) => {
      await Review.deleteOne({ _id: review._id });
    });
    if (user.drafts.length !== 0) {
      user.drafts.forEach(async (draft) => {
        await Review.deleteOne({ _id: draft._id });
      });
    }
    user.drafts = [];
    user.reviews = [];
    await user.save();
    res.send({ message: "Reviews and Drafts deleted" });
  }
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
    res.send({ message: "That username is already taken" });
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

//Search user
app.post("/SearchUser", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.send({ message: "No users found with that username" });
    return;
  }
  const profileImage = await ProfileImg.findOne({ userID: user._id });
  if (!profileImage) {
    res.send({ username: user.username, profilePic: null, userID: user._id });
    return;
  }
  res.send({
    username: user.username,
    profilePic: profileImage.signedUrl,
    userID: user._id,
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
  const s3Response = await getPresignedUrl("media-review", filename);
  const profileImg = new ProfileImg({
    fileName: filename,
    userID: req.body.userId,
    signedUrl: s3Response,
  });
  await profileImg
    .save()
    .then((profileImg) => {
      res.json({ message: "Profile image added successfully" });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

//get profile
app.post("/profile", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID })
    .populate("reviews")
    .populate("subscribers")
    .populate("subscribed")
    .exec();
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    res.send({
      userID: user._id,
      username: user.username,
      reviews: user.reviews,
      subscribers: user.subscribers.map((subscriber) => {
        return { username: subscriber.username, _id: subscriber._id };
      }),
      subscribedTo: user.subscribed.map((subscribed) => {
        return { username: subscribed.username, _id: subscribed._id };
      }),
      description: user.description,
    });
    await user
      .depopulate("reviews")
      .depopulate("subscribers")
      .depopulate("subscribed");
  }
});

//get image
app.post("/image", async (req, res) => {
  await ProfileImg.findOne({ userID: req.body.userID })
    .then(async (profileImg) => {
      if (profileImg.createdAt < Date.now() - 604800000) {
        const s3Response = await getPresignedUrl(
          "media-review",
          profileImg.fileName
        );

        await ProfileImg.updateOne(
          { userID: req.body.userId },
          { signedUrl: s3Response },
          { createdAt: Date.now() }
        );

        res.send({ signedUrl: s3Response, message: "updated" });
      } else {
        res.send({ signedUrl: profileImg.signedUrl });
      }
      await profileImg.save();
    })
    .catch((err) => {
      res.status(400).send("unable to find image in database");
    });
});

//upload description
app.put("/updateDescription", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    user.description = req.body.description;
    res.send({ message: "description updated" });
    await user.save();
  }
});

//get description
app.post("/description", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    res.send({ description: user.description });
  }
});

//subscribe to user
app.post("/subscribe", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  const subscriber = await User.findOne({ _id: req.body.subscriberID });
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    user.subscribers.push(req.body.subscriberID);
    res.send({ message: "subscribed" });
    await user.save();
  }
  if (!subscriber) {
    res.send({ message: "No subscriber found" });
  } else {
    subscriber.subscribed.push(req.body.userID);
    await subscriber.save();
  }
});

//unsubscribe from user
app.post("/unsubscribe", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  const subscriber = await User.findOne({ _id: req.body.subscriberID });
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    user.subscribers.splice(user.subscribers.indexOf(req.body.subscriberID), 1);
    res.send({ message: "unsubscribed" });
    await user.save();
  }
  if (!subscriber) {
    res.send({ message: "No subscriber found" });
  } else {
    subscriber.subscribed.splice(
      subscriber.subscribed.indexOf(req.body.userID),
      1
    );
    await subscriber.save();
  }
});

//checks if user is subscribed to another user
app.post("/isSubscribed", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    if (user.subscribers.includes(req.body.subscriberID)) {
      res.send({ message: "subscribed", subscribed: true });
    } else {
      res.send({ message: "not subscribed", subscribed: false });
    }
  }
});

//return a chronologically orders list of reviews from users that the user is subscribed to
app.post("/subscribedReviews", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID })
    .populate({
      path: "subscribed",
      populate: {
        path: "reviews",
        options: { sort: { createdAt: -1 } },
      },
    })
    .exec();
  if (!user) {
    res.send({ message: "No user found" });
  } else {
    const reviews = [];
    user.subscribed.forEach((subscribed) => {
      subscribed.reviews.forEach((review) => {
        reviews.push(review);
      });
    });
    res.send(reviews);
    await user.depopulate("subscribed");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
