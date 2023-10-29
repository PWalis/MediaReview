import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Context from "../Context/Context";
import Header from "../UI/Header";
import Review from "../Review/Review";
import { useNavigate } from "react-router-dom";
import UnsubscribeButton from "../UI/UnsubscribeButton";
import SubscribeButton from "../UI/SubscribeButton";

const OtherUserProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState({
    picture:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    file: "",
  });
  const [reviews, setReviews] = useState([]);
  const [description, setDescription] = useState("");
  const context = useContext(Context);
  const { userID } = useParams();
  const [subscribed, setSubscribed] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // when user searches themselves, redirect to profilePage
    if (userID === context.userId) {
      navigate("/profilePage");
    }
    if (
      profilePicture.picture ===
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
    ) {
      fetch("/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userID }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProfilePicture({ picture: data.signedUrl });
        });
    } else {
      console.log("profilePicture.picture is: " + profilePicture.picture);
    }
    if (context.isAuthenticated) {
      fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userID }),
      })
        .then((res) => res.json())
        .then((reviews) => setReviews(reviews))
        .catch((err) => console.log(err));
    }

    fetch("/description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userID }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDescription(data.description);
      });

    fetch("/isSubscribed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userID, subscriberID: context.userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSubscribed(data.subscribed);
      });
  }, []);

  const subButtonOnClickHandler = () => {
    setSubscribed(!subscribed);
  };

  const Profile = ({ src }) => (
    <div className="container m-auto pt-4 max-w-6xl ">
      <div
        id="profile picture"
        className="grid md:grid-cols-4 md:grid-rows-1 grid-cols-2 grid-rows-2 relative"
      >
        <div className="md:col-span-1 col-span-2 m-auto">
          <img
            htmlFor=""
            src={src}
            className="shadow rounded-full max-h-48 m-auto align-content-middle border-none flex-shrink-0 object-contain mb-4"
          />
        </div>
        <div
          id="Subscribers and Description"
          className="grid grid-rows-4 md:col-start-2 md:col-span-3 col-start-1 col-span-2 p-5"
        >
          <p className="row-span-1">Subscribers 100</p>
          <p className="row-start-2 row-span-3">{description}</p>
        </div>
        {subscribed ? (
          <UnsubscribeButton subButton={subButtonOnClickHandler} userID={userID} subscriberID={context.userId} />
        ) : (
          <SubscribeButton subButton={subButtonOnClickHandler} userID={userID} subscriberID={context.userId} />
        )} 
      </div>
    </div>
  );

  const ReviewsList = (
    <div id="" className="container flex flex-col space-y-10 m-auto">
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
  );

  return (
    <>
      <Header />
      <div className="shadow-slate-400 shadow-md max-w-6xl m-auto rounded-2xl">
        <section>
          <Profile src={profilePicture.picture} />
        </section>
        <section>
          <div className="relative overflow-auto max-h-144 max-w-6xl m-auto">
            {ReviewsList}
          </div>
        </section>
      </div>
    </>
  );
};

export default OtherUserProfilePage;
