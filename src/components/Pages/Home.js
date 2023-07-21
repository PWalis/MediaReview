import React, { useEffect, useState } from "react";

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviews")
      .then((res) => res.json())
      .then((reviews) => setReviews(reviews));
  }, []);

  return (
    <div>
      {reviews.map((review) => (
        <>
          <p>{review.name}</p>
          <p>{review.rating}</p>
          <p>{review.comment}</p>
        </>
      ))}
    </div>
  );
}

export default Home;
