import react from "react";

const SubscribeButton = ({ userID, subscriberID, subButton }) => {
  const subscribeOnClickHandler = () => {
    fetch("/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userID, subscriberID: subscriberID }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
      
    subButton();
  };

  return (
    <button
      onClick={subscribeOnClickHandler}
      className="absolute sm:top-5 sm:right-10"
    >
      Subscribe
    </button>
  );
};

export default SubscribeButton;
