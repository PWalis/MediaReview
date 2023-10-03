import React, { useState, useContext } from "react";
import Context from "../Context/Context";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Prompt from "../UI/Prompt";

function CreateReview({
  editing,
  content,
  setContent,
  rating,
  setRating,
  title,
  setTitle,
  updateTitleHandler,
  updateRatingHandler,
  id,
}) {
  const context = useContext(Context);

  const submitHandler = async (event, draft, update, publish) => {
    event.preventDefault();
    if (content === "" || rating === "") {
      return;
    } else if (update) {
      await fetch("/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          rating: rating,
          draft: true,
          id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data.message));
      setContent("");
      setRating("");
      setTitle("");
    } else if (publish) {
      fetch("/publish", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          rating: rating,
          id: id,
          userID: context.userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data.message));
      setContent("");
      setRating("");
      setTitle("");
    } else {
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
    }
  };

  const publish = async (event) => {
    if (content !== "" && rating !== "" && title !== "") {
      await submitHandler(event, false, false, false);
    } else {
      alert("Please enter a title, rating, and content");
    }
  };

  const draft = async (event) => {
    if (content !== "" && rating !== "" && title !== "") {
      await submitHandler(event, true, false, false);
    } else {
      alert("Please enter a title, rating, and content");
    }
  };

  const updateOnClickHandler = async (event) => {
    if (content !== "" && rating !== "" && title !== "") {
      await submitHandler(event, false, true, false);
    } else {
      alert("Please enter a title, rating, and content");
    }
  };

  const publishDraftOnClickHandler = async (event) => {
    if (content !== "" && rating !== "" && title !== "") {
      await submitHandler(event, false, false, true);
    } else {
      alert("Please enter a title, rating, and content");
    }
  };

  return (
    <div className=" h-full m-auto max-w-sm md:max-w-4xl pt-5">
      {content !== "" ? (
        <Prompt
          when={true}
          message="Are you sure you want to leave before saving?"
        />
      ) : null}
      <form
        onSubmit={submitHandler}
        className="shadow-md shadow-slate-400 p-5 rounded-lg"
      >
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
          className="mb-10 h-112 w-full"
        />
        <div className="flex gap-20 justify-center align-middle p-10">
          {editing ? (
            <>
              <button
                className="ml-5 p-1 rounded-lg bg-blue-400 shadow-slate-700 shadow-md"
                type="submit"
                onClick={updateOnClickHandler}
              >
                Update
              </button>
              <button
                className="ml-5 p-1 rounded-lg bg-blue-400 shadow-slate-700 shadow-md"
                type="submit"
                onClick={publishDraftOnClickHandler}
              >
                Publish Draft
              </button>
            </>
          ) : (
            <>
              <button
                className="ml-5 p-1 rounded-lg bg-blue-400 shadow-slate-700 shadow-md"
                onClick={publish}
                type="submit"
              >
                Publish
              </button>
              <button
                className="ml-5 p-1 rounded-lg  bg-blue-400 shadow-slate-700 shadow-md"
                onClick={draft}
                type="submit"
              >
                Save Draft
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateReview;
