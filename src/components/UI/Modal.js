import react from "react";  

const Modal = (props) => {
    return (
        <div className="fixed flex z-10 bg-gray-800 bg-opacity-60 w-screen h-screen pb-52">
            <div  className="m-auto bg-white rounded-lg shadow-lg p-10 z-20">
                {props.children}
            </div>
        </div>
    )
}

export default Modal;