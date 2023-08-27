import React, { useState, useEffect, useContext } from "react";
import Context from "../Context/Context";
import "./ProfilePage.css";

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

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img htmlFor="photo-upload" src={src} />
    </div>
    <input id="photo-upload" type="file" onChange={onChange} name="image" />
  </label>
);

const Profile = ({ onSubmit, src }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Profile Card</h1>
      <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img htmlFor="photo-upload" src={src} />
        </div>
      </label>
      <button type="submit" className="edit">
        Edit Profile{" "}
      </button>
    </form>
  </div>
);

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState({
    picture:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    file: "",
  });
  const [active, setActive] = useState("edit");
  const context = useContext(Context);

  useEffect(() => {
    // const cookieValues = document.cookie.split("; ");
    // console.log(document.cookie);
    // if (!cookieValues.find((item) => item.startsWith("loginToken"))) {
    //   context.updateAuth(false);
    // } else {
    //   context.updateAuth(true);
    //   context.updateUserId(
    //     cookieValues.reduce((acc, item) => {
    //       if (item.startsWith("userID")) {
    //         return item.split("=")[1];
    //       } else {
    //         return acc;
    //       }
    //     })
    //   );
    // };
    fetch("/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: context.userId }),
    })
    .then ((res) => res.json())
    .then ((data) => {
      console.log(data);
      setProfilePicture({picture: data.signedUrl});
    }
    )
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let activeP = active === "edit" ? "profile" : "edit";
    setActive(activeP);
  };

  const Edit = ({ onSubmit, children }) => (
    <div className="card">
      <form onSubmit={onSubmit}>
        <h1>Profile Card</h1>
        {children}
        <button type="submit" className="save">
          Save{" "}
        </button>
      </form>
    </div>
  );

  const photoUpload = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setProfilePicture({
        file: file,
        picture: reader.result,
      });
    };
    reader.readAsDataURL(file);
    await postImage(file, context.userId);
  };

  return (
    <>
      <section>
        <div>
          {active === "edit" ? (
            <Edit onSubmit={handleSubmit}>
              <ImgUpload onChange={photoUpload} src={profilePicture.picture} />
            </Edit>
          ) : (
            <Profile onSubmit={handleSubmit} src={profilePicture.picture} />
          )}
        </div>
      </section>
      <section></section>
    </>
  );
};

export default ProfilePage;
