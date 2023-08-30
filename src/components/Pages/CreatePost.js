import React, { useContext, useState} from "react";
import Context from "../Context/Context.js";
import CreateReview from "../Review/CreateReview.js";

function CreatePost() {
  // const [reviews, setReviews] = useState({name: null, rating: null, comment: null}); 
  // const context = useContext(Context);

  // const 

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.target);
  //   data.append("userID", context.userId);
  //   await fetch("/createReview", {
  //     method: "POST",
  //     contentType: "application/json",
  //     body: data,
  //     });
  //   };

  return (
    <div>
      <CreateReview/>
    </div>
  );
}

export default CreatePost;
