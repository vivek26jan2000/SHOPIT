import mongoose from "mongoose";

export const connectDatabase = async () => {
  let DB_URI = "";
  if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.LOCAL_DB_URI;
  if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  mongoose.connect(DB_URI).then((con) => {
    console.log(
      `MongoDB database is connect with host:${con?.connection?.host}`
    );
  });
};
