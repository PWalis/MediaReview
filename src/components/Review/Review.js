import React, { useState, useEffect } from "react";

const Review = (props) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [rating, setRating] = useState(props.rating);
  const [publishedBy, setPublishedBy] = useState(props.published);
  const [isAuthor, setIsAuthor] = useState(false);
  const [createdAt, setCreatedAt] = useState(props.createdAt);
  const [id, setId] = useState(props.id);

  useEffect(() => {
    setTitle(props.title);
    setBody(props.body);
    setRating(props.rating);
    setPublishedBy(props.published);
    setIsAuthor(props.isAuthor);
    setId(props.id);
  }, [
    props.title,
    props.body,
    props.rating,
    props.publishedBy,
    props.isAuthor,
  ]);

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
    <button
      className="absolute bottom-1 right-3 scale-125"
      onClick={editOnClickHandler}
    >
      <i class="fa fa-edit"></i>
    </button>
  );
  const BasicReview = (
    <div className="relative border-2 border-slate-400 bg-slate-300 bg-opacity-30 shadow-md max-w-5xl w-full m-auto rounded-lg p-3">
      <h3 className="text-3xl">{title}</h3>
      <div className="text-lg" dangerouslySetInnerHTML={{__html: body}}></div>
      <p className="">{`${rating}/10`}</p>
      <p className="absolute top-3 right-5">
        {new Date(createdAt).toLocaleDateString("en-us", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      {isAuthor ? editButton : null}
    </div>
  );

  const EditableReview = (
    <div className="flex flex-col relative border-2 border-slate-400 bg-slate-300 bg-opacity-30 shadow-md max-w-5xl w-full m-auto rounded-lg p-3">
      <label htmlFor="title">Title</label>
      <input
        className="bg-slate-100 max-w-4xl"
        value={title}
        onChange={updateTitleHandler}
      ></input>
      <label htmlFor="body">Body</label>
      <input
        className="bg-slate-100 max-w-4xl"
        value={body}
        onChange={updateBodyHandler}
      ></input>
      <label htmlFor="rating">Rating</label>
      <input
        className="bg-slate-100 max-w-4xl"
        value={rating}
        onChange={updateRatingHandler}
      ></input>
      <button
        className="absolute bottom-1 right-3 scale-150"
        onClick={saveOnClickHandler}
      >
        <i class="fa fa-save"></i>
      </button>
      <button onClick={() => props.deleteOnClickHandler(id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="absolute top-1 right-2 h-7 fill-red-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );

  return <>{!editable ? BasicReview : EditableReview}</>;
};

export default Review;
