import React, { useState, useContext } from "react";
import Context from "../Context/Context";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Prompt from "../UI/Prompt";

function CreateReview() {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");
  const context = useContext(Context);

  const updateTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const updateRatingHandler = (event) => {
    setRating(event.target.value);
  };

  const submitHandler = async (event, draft) => {
    event.preventDefault();
    if (content === "" || rating === "") {
      return;
    }
    await fetch("/createReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
        rating: rating,
        draft: draft,
        userID: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
    setContent("");
    setRating("");
    setTitle("");
  };

  const publish = async (event) => {
    if (content === "" || rating === "" || title === "") {
      await submitHandler(event, false);
    }
  };

  const draft = async (event) => {
    if (content === "" && rating === "" && title === "") {
      await submitHandler(event, true);
    }
  };

  return (
    <div className="m-auto max-w-sm md:max-w-4xl">
      {content!=="" ? <Prompt
        when={true}
        message="Are you sure you want to leave before saving?"
      /> : null}
      <form onSubmit={submitHandler} className="">
        <div className="flex gap-20 justify-center align-middle mb-5">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={updateTitleHandler}
            className="h-10 w-1/2 p-4"
          />
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={updateRatingHandler}
            max="10"
            className="h-10 w-1/2 p-4"
          />
        </div>
        <ReactQuill
          theme="snow"
          id="body"
          value={content}
          onChange={setContent}
          className="mb-5 h-4/5 w-full"
        />
        <div className="flex gap-20 justify-center align-middle pb-5">
          <button
            className="ml-5 p-1 rounded-lg border-2 border-black"
            onClick={publish}
            type="submit"
          >
            Publish
          </button>
          <button
            className="ml-5 p-1 rounded-lg border-2 border-black"
            onClick={draft}
            type="submit"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReview;
