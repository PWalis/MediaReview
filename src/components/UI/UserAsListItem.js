import react from "react";
import { Link } from "react-router-dom";

const UserAsListItem = ({ signedUrl, username, userID }) => {
  return (
    <>
      <Link to={`/User/${userID}`}>
        <div className="w-full m-auto flex gap-2">
          <img className=" w-14 h-14" src={signedUrl} />
          <p className="">{username}</p>
        </div>
      </Link>
    </>
  );
};

export default UserAsListItem;
