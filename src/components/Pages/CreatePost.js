import React, { useContext, useEffect, useState } from "react";
import Context from "../Context/Context.js";
import CreateReview from "../Review/CreateReview.js";
import DraftList from "../Review/DraftList.js";

function CreatePost() {
  const [drafts, setDrafts] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [editing, setEditing] = useState(false); 
  const context = useContext(Context);

  useEffect(() => {
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
  }, [context.userId]);

  const loadDraft = ({content, title, rating, _id}) => {
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
    <div className="grid grid-cols-4 grid-rows-1 gap-6">
      <div className="flex flex-col m-4 overflow-auto max-h-176 drop-shadow-lg shadow-slate-500 p-2">
        <DraftList drafts={drafts} handleOnClick={loadDraft}/>
      </div>
      <div className="col-span-2">
        <CreateReview id={id} editing={editing} updateRatingHandler={updateRatingHandler} updateTitleHandler={updateTitleHandler} content={content} setContent={setContent} title={title} rating={rating} setTitle={setTitle} setRating={setRating}/>
      </div>
    </div>
  );
}

export default CreatePost;
