import React, { useContext, useEffect, useState } from "react";
import Context from "../Context/Context.js";
import CreateReview from "../Review/CreateReview.js";
import DraftList from "../Review/DraftList.js";
import Header from "../UI/Header.js";

function CreatePost() {
  const [drafts, setDrafts] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [editing, setEditing] = useState(false);
  const context = useContext(Context);

  useEffect(() => {
    if (!context.isAuthenticated) {
      const cookieValues = document.cookie.split("; ");
      console.log(document.cookie);
      if (!cookieValues.find((item) => item.startsWith("loginToken"))) {
        context.updateAuth(false);
      } else {
        context.updateAuth(true);
        context.updateUserId(
          cookieValues.reduce((acc, item) => {
            if (item.startsWith("userID")) {
              return item.split("=")[1];
            } else {
              return acc;
            }
          }),
          null
        );
      }
    }
    fetch("/drafts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: context.userId }),
    })
      .then((res) => res.json())
      .then((drafts) => setDrafts(drafts))
      .catch((err) => console.log(err));
  }, [context.userId, context.isAuthenticated]);

  const loadDraft = ({ content, title, rating, _id }) => {
    setContent(content);
    setTitle(title);
    setRating(rating);
    setEditing(true);
    setId(_id);
  };

  const updateTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const updateRatingHandler = (event) => {
    setRating(event.target.value);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col xl:grid xl:grid-cols-4 md:grid-rows-1 md:gap-6 pt-5">
        <div className="col-start-2 col-span-2 rounded-md">
          <CreateReview
            id={id}
            editing={editing}
            updateRatingHandler={updateRatingHandler}
            updateTitleHandler={updateTitleHandler}
            content={content}
            setContent={setContent}
            title={title}
            rating={rating}
            setTitle={setTitle}
            setRating={setRating}
          />
        </div>
        <div className="flex flex-col m-4 overflow-auto max-h-176 drop-shadow-lg shadow-slate-500 p-2">
          <DraftList drafts={drafts} handleOnClick={loadDraft} />
        </div>
      </div>
    </>
  );
}

export default CreatePost;
