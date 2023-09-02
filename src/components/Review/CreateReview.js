import React, { useState, useContext } from "react";
import Context from "../Context/Context";

function CreateReview() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState("");
  const context = useContext(Context);

  const updateTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const updateBodyHandler = (event) => {
    setBody(event.target.value);
  };

  const updateRatingHandler = (event) => {
    setRating(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (title === "" || body === "" || rating === "") {
      return;
    }
    await fetch("/createReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: title,
        comment: body,
        rating: rating,
        userID: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
    setTitle("");
    setBody("");
    setRating("");
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" onChange={updateTitleHandler} />
        <label htmlFor="body">Body</label>
        <input type="text" id="body" onChange={updateBodyHandler} />
        <label htmlFor="rating">Rating</label>
        <input type="text" id="rating" onChange={updateRatingHandler} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateReview;