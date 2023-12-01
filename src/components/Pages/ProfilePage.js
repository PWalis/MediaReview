import React, { useState, useEffect, useContext } from "react";
import "./ProfilePage.css";
import Header from "../UI/Header";
import Context from "../Context/Context";
import Review from "../Review/Review";
import Modal from "../UI/Modal";
import SubscribedTo from "../UI/SubscribedTo";
import Subscribers from "../UI/Subscribers";
// import Resizer from "react-image-file-resizer";

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState({
    picture:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    file: "",
  });
  const [menuActive, setMenuActive] = useState(false);
  const [effect, setEffect] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [subscribeModals, setSubscribeModals] = useState({
    subscribedTo: false,
    subscribers: false,
  });
  const context = useContext(Context);
  const [profile, setProfile] = useState({});

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
    if (context.isAuthenticated) {
      if (
        profilePicture.picture ===
        "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
      ) {
        fetch("/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: context.userId }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setProfilePicture({ picture: data.signedUrl });
          });
      } else {
        console.log("profilePicture.picture is: " + profilePicture.picture);
      }
      fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: context.userId }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
    }
    document.addEventListener("mousedown", (event) => {
      if (
        event.target.id === "More Button" ||
        event.target.id === "More menu" ||
        event.target.id === "exit modal" ||
        event.target.id === "Edit Button" ||
        event.target.id === "Subscribers Button" ||
        event.target.id === "Subscriptions Button"
      ) {
        return;
      }
      setMenuActive(false);
    });
    fetch("/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: context.userId }),
    })
      .then((res) => res.json())
      .then((profile) => {
        console.log(profile);
        setProfile({
          username: profile.username,
          description: profile.description,
          subscribers: profile.subscribers,
          subscribedTo: profile.subscribedTo,
          reviews: profile.reviews,
        });
      });
  }, [context.isAuthenticated]);

  const handleClick = () => {
    setMenuActive(!menuActive);
    setEffect(!effect);
  };

  const deleteReview = async (id) => {
    await fetch("/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
    setProfile({
      ...profile,
      reviews: profile.reviews.filter((review) => review._id !== id),
    });
  };

  const menuToggle = menuActive ? "scale-100" : "scale-0";

  async function postImage(image, userId) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", userId);

    console.log("userId is: " + userId);
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    return response.json();
  }

  // const resizeImage = (file, ) => {
  //   new Promise((resolve) => {
  //     Resizer.imageFileResizer(
  //       file,
  //       200,
  //       200,
  //       "JPEG",
  //       100,
  //       0,
  //       (uri) => {
  //         setProfilePicture({
  //           file: file,
  //           picture: uri,
  //         });;
  //       },
  //       "base64"
  //     );
  //   });
  // };

  const photoUpload = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    // await resizeImage(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setProfilePicture({
        file: file,
        picture: reader.result,
      });
    };
    await postImage(file, context.userId);
  };

  const editOnClickHandler = () => {
    setModalActive(!modalActive);
  };

  const descriptionChangeHandler = (event) => {
    setProfile({ ...profile, description: event.target.value });
  };

  const descriptionSubmitHandler = async (event) => {
    event.preventDefault();
    await fetch("/updateDescription", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: profile.description,
        userID: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
    setProfile({ ...profile, description: profile.description });
  };

  const subscribedToOnClickHandler = () => {
    setSubscribeModals({
      ...subscribeModals,
      subscribedTo: !subscribeModals.subscribedTo,
    });
  };
  const subscribersOnClickHandler = () => {
    setSubscribeModals({
      ...subscribeModals,
      subscribers: !subscribeModals.subscribers,
    });
  };

  const Profile = ({ src }) => (
    <div className="container m-auto pt-4 max-w-6xl">
      <div
        id="profile picture"
        className="grid md:grid-cols-4 md:grid-rows-1 grid-cols-2 grid-rows-2 relative "
      >
        <button
          onClick={handleClick}
          id="More Button"
          className={`absolute top-3 right-3 ${effect && "animate-wiggle"}`}
          onAnimationEnd={() => {
            setEffect(false);
          }}
        >
          <img
            src={require("../../assets/more.png")}
            className="object-contain max-w-10 max-h-10"
          ></img>
        </button>
        <div
          id="More menu"
          className={`absolute block -top-2 right-7 justify-start transform transition-all duration-150 ease-out w-40 h-52  ${menuToggle}`}
        >
          <button
            id="Subscriptions Button"
            onClick={subscribedToOnClickHandler}
            className="absolute top-0 right-3 bg-blue-500 border-blue-500 hover:bg-cyan-500 hover:border-cyan-500 border-2 rounded-xl text-white"
          >
            Subscriptions
          </button>
          <button
            id="Subscribers Button"
            onClick={subscribersOnClickHandler}
            className="absolute top-8 right-3 bg-blue-500 rounded-xl border-blue-500 border-2 hover:bg-cyan-500 hover:border-cyan-500 text-white"
          >
            Subscribers
          </button>
          <button
            id="Edit Button"
            onClick={editOnClickHandler}
            className="absolute top-16 right-3 bg-blue-500 rounded-xl border-blue-500 border-2 hover:bg-cyan-500 hover:border-cyan-500 text-white"
          >
            Edit
          </button>
        </div>
        <div className="md:col-span-1 col-span-2 m-auto">
          <img
            htmlFor=""
            src={src}
            className="shadow rounded-full max-h-48 m-auto align-content-middle border-none flex-shrink-0 object-cover h-52 w-52 mb-4"
          />
        </div>
        <div
          id="Subscribers and Description"
          className="grid grid-rows-4 md:col-start-2 md:col-span-3 col-start-1 col-span-2 p-5"
        >
          <h1 className="row-span-1 text-2xl">{profile.username}</h1>
          <p className="row-start-2 row-span-3 pt-5">{profile.description}</p>
        </div>
      </div>
    </div>
  );

  const EditProfile = (
    <Modal onClick={editOnClickHandler}>
      <div className="flex relative flex-col">
        <button
          id="exit modal"
          className="absolute -top-6 -right-6 z-30"
          onClick={editOnClickHandler}
        >
          <img
            onClick={editOnClickHandler}
            src={require("../../assets/exit.png")}
            className="w-10"
          ></img>
        </button>
        <div className="relative group w-52 m-auto">
          <img
            src={profilePicture.picture}
            className="rounded-full m-auto group-hover:opacity-40 object-cover h-52 w-52"
          />
          <p className="scale-0 group-hover:scale-100 absolute text-align-center top-1/2 right-16 font-extrabold">
            Upload Photo
          </p>
          <input
            type="file"
            onChange={photoUpload}
            className="opacity-0 absolute h-52 w-52 z-40 top-0 cursor-pointer"
          ></input>
        </div>
        <div className=" w-96 p-5 relative">
          <form className="w-1/4" onSubmit={descriptionSubmitHandler}>
            <label htmlFor="description"></label>
            <textarea
              id="description"
              type="text"
              onChange={descriptionChangeHandler}
              maxLength="200"
              value={profile.description}
              placeholder="Your Description"
              className="p-2 w-80"
            ></textarea>
            <button type="submit" className="bg-blue-500 rounded-lg p-1">
              Save
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );

  // List of reviews
  const ReviewsList = (
    <div id="" className="container flex flex-col space-y-10 m-auto pb-3 ">
      {profile.reviews &&
        profile.reviews.map((review) => (
          <Review
            key={review._id}
            id={review._id}
            title={review.title}
            body={review.content}
            rating={review.rating}
            createdAt={review.createdAt}
            isAuthor={true}
            deleteOnClickHandler={deleteReview}
          />
        ))}
    </div>
  );

  return (
    <>
      {modalActive && EditProfile}
      {subscribeModals.subscribedTo && (
        <SubscribedTo
          subscribedToList={profile.subscribedTo}
          exitButton={subscribedToOnClickHandler}
        />
      )}
      {subscribeModals.subscribers && (
        <Subscribers
          subscribedToList={profile.subscribers}
          exitButton={subscribersOnClickHandler}
        />
      )}
      <Header />
      <div className=" shadow-md max-w-6xl m-auto rounded-2xl bg-whitesmoke">
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

export default ProfilePage;
