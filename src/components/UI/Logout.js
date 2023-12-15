import react, {useContext} from "react";
import Context from "../Context/Context";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const context = useContext(Context);

  const onLogout = () => {
    context.updateAuth(false);
    context.updateUserId(null);
    Cookies.remove("loginToken");
    Cookies.remove("userID");
    navigate("/");
  };
  const navigate = useNavigate();

  return <button className="text-whitesmoke text-2xl" onClick={onLogout}>Logout</button>;
};

export default Logout;