import react from "react";

const UnsubscribeButton = ({ userID, subscriberID, subButton }) => {
  const unsubscribeOnClickHandler = () => {
    fetch("/unsubscribe", {
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

  return <button onClick={unsubscribeOnClickHandler} className=" absolute top-5 right-10" >Unsubscribe</button>;
};

export default UnsubscribeButton;
