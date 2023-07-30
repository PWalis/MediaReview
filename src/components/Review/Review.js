import React, { useState, useEffect } from "react";

const Review = (props) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [rating, setRating] = useState(props.rating);
  const [publishedBy, setPublishedBy] = useState(props.published);
  const [isAuthor, setIsAuthor] = useState(false);
  const [id, setId] = useState(props.id);

  useEffect(() => {
    setTitle(props.title);
    setBody(props.body);
    setRating(props.rating);
    setPublishedBy(props.published);
    setIsAuthor(props.isAuthor);
    setId(props.id);
  }, [props.title, props.body, props.rating, props.publishedBy, props.isAuthor]);

  const editOnClickHandler = () => {
    setEditable(true);
  };

  const updateTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const updateBodyHandler = (event) => {
    setBody(event.target.value);
  };

  const updateRatingHandler = (event) => {
    setRating(event.target.value);
  };

  const saveOnClickHandler = async () => {
    setEditable(false);
    await fetch("/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        comment: body,
        rating: rating,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
  };

  const editButton = (
    <button onClick={editOnClickHandler}>
      <i class="fa fa-edit" ></i>
    </button>
  );
  const BasicReview = (
    <div>
      <h3>{title}</h3>
      <p>{body}</p>
      <p>{rating}</p>
      <p>{publishedBy}</p>
      {isAuthor ? editButton : null}
    </div>
  );

  const EditableReview = (
    <div>
      <label htmlFor="title">Title</label>
      <input value={title} onChange={updateTitleHandler}></input>
      <label htmlFor="body">Body</label>
      <input value={body} onChange={updateBodyHandler}></input>
      <label htmlFor="rating">Rating</label>
      <input value={rating} onChange={updateRatingHandler}></input>
      <button onClick={saveOnClickHandler}>
        <i class="fa fa-save" ></i>
      </button>
    </div>
  );

  return <>{!editable ? BasicReview : EditableReview}</>;
};

export default Review;
