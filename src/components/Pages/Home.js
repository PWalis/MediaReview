import React, { useEffect, useState } from "react";
import Review from "../Review/Review";
import Context from "../Context/Context";
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import Header from "../UI/Header";

function Home() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const context = React.useContext(Context);

  useEffect(() => {
    if (context.isAuthenticated) {
      fetch("/subscribedReviews", {
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
        navigate("/login");
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
    <section className="bg-whitesmoke h-screen">
      <div className="grid grid-cols-5 gap-5 pt-5 bg-whitesmoke">
        {reviews.map((review) => (
          <Review
            key={review._id}
            id={review._id}
            title={review.title}
            body={review.content}
            rating={review.rating}
            createdAt={review.createdAt}
            isAuthor={false}
          />
        ))}
      </div>
    </section>
  );

  const unauthenticatedPage = (
    <>
      <p>Welcome to the website give me all your money</p>
    </>
  );

  return (
    <>
      <Header />
      {context.isAuthenticated ? authenticatedPage : unauthenticatedPage}
    </>
  );
}

export default Home;
