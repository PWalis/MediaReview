import React, { useEffect, useState } from "react";
import Review from "../Review/Review";
import Context from "../Context/Context";
import Login from "./Login";
import {Link} from "react-router-dom";

function Home() {
  const [reviews, setReviews] = useState([]);

  const context = React.useContext(Context);

  useEffect(() => {
    fetch("/reviews")
      .then((res) => res.json())
      .then((reviews) => setReviews(reviews));
  }, []);

  useEffect(() => {
    if (context.isAuthenticated) {
      fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: context.userId }),
      })
        .then((res) => res.json())
        .then((reviews) => setReviews(reviews));
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
      <button>
        <Link to="/login">Login</Link>
      </button>
      <button>
        <Link to="/register">Register</Link>
      </button>
    </>
  );

  return <>{context.isAuthenticated ? authenticatedPage : unauthenticatedPage}</>;
}

export default Home;
