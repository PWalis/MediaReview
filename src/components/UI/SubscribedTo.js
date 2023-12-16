import react from "react";
import Modal from "./Modal";

//uses the modal component to display the list of users subscribed to the user

const SubscribedTo = ({ subscribedToList, exitButton }) => {
  return (
    <Modal>
      <div className="flex flex-col items-center justify-center relative">
        <button
          id="exit modal"
          className="absolute -top-6 -right-6 z-30"
          onClick={exitButton}
        >
          <img
            onClick={exitButton}
            src={require("../../assets/exit.png")}
            className="w-10"
          ></img>
        </button>
        <h1 className="text-2xl pt-3 font-bold text-cerulean">Subscriptions</h1>
        <div className="flex flex-col items-center justify-center">
          {subscribedToList &&
            subscribedToList.map((user) => (
              <div
                key={user._id}
                className="flex flex-col items-center justify-center"
              >
                <h1 className="text-xl font-bold">{user.username}</h1>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default SubscribedTo;
