import Resizer from "react-image-file-resizer";

// resize buffer image
const resizeImage = (file, ) => {
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        console.log(uri);
      },
      "base64"
    );
  });
};

export default resizeImage;
