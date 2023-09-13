import React, { useEffect, useState } from "react";
import Review from "../Review/Review";
import Context from "../Context/Context";
import Login from "./Login";
import { Link } from "react-router-dom";
import ProfilePage from "./ProfilePage";

function Home() {
  const [reviews, setReviews] = useState([]);

  const context = React.useContext(Context);

  useEffect(() => {
    if (context.isAuthenticated) {
      fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: context.userId }),
      })
        .then((res) => res.json())
        .then((reviews) => setReviews(reviews))
        .catch((err) => console.log(err));
    } else {
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
  }, [context.isAuthenticated]);

  const authenticatedPage = (
    <div>
      {reviews.map((review) => (
        <Review
          key={review._id}
          id={review._id}
          title={review.name}
          body={review.comment}
          rating={review.rating}
          isAuthor={true}
        />
      ))}
    </div>
  );

  const unauthenticatedPage = (
    <>
      <p>Welcome to the website give me all your money</p>
    </>
  );

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {context.isAuthenticated ? authenticatedPage : unauthenticatedPage}
    </>
  );
}

export default Home;
