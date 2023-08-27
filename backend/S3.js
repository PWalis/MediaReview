require("dotenv").config()

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { hashFilename } = require("./saltAndHash.js");

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({region: REGION, credentials: {accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY}});

// Uploads a file to S3
const uploadFile = async (file, username) => {
  const filename = hashFilename(file.originalname, username);
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const returnedUpload = await s3Client
    .send(new PutObjectCommand(params))
    .then((data) => {
      console.log("Successfully uploaded file.");
    })
    .catch((error) => {
      console.log("Error uploading file.", error);
    });
};

//get presigned url
const getPresignedUrl = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  const command = new GetObjectCommand(params);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log(signedUrl);
  return signedUrl;
};


// delete file from s3
const deleteFile = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  await s3Client
    .send(new DeleteObjectCommand(params))
    .then((data) => {
      console.log("Successfully deleted file.", data);
      return data;
    })
    .catch((error) => {
      console.log("Error deleting file.", error);
    });
};

module.exports = { uploadFile, deleteFile, getPresignedUrl };
