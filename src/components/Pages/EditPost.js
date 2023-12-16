import Header from "../UI/Header";
import CreateReview from "../Review/CreateReview";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Context from "../Context/Context";
import EditReview from "../Review/EditReview";

const EditPost = () => {
  const context = useContext(Context);
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");

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
    if (id) {
      fetch("/getReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((review) => {
          setContent(review.content);
          setRating(review.rating);
          setTitle(review.title);
        });
    }
  }, [context.userId, context.isAuthenticated]);

  const updateTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const updateRatingHandler = (event) => {
    setRating(event.target.value);
  };

  return (
    <>
      <Header />
      <div className="mx-1 lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:gap-6 pt-5">
        <div className="lg:col-span-2 lg:col-start-2 rounded-md">
          <EditReview
            id={id}
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
      </div>
    </>
  );
};

export default EditPost;
