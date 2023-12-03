const sharp = require("@img/sharp-linux-x64");

// resize buffer image
const resizeImage = (buffer, width, height) => {
    const resizedImage = sharp(buffer)
        .resize(width, height)
        .toBuffer()
        .then((data) => {
            console.log("Successfully resized image.");
        return data;
        })
        .catch((err) => {
        console.log("Error resizing image.", err);
        });
    return resizedImage;
    };

module.exports = { resizeImage };
