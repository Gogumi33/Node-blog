// env 파일에 저장된 db URI를 가져와 그 경로로 접속하도록 한다.
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const connectDb = asyncHandler(async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected: ${connect.connection.host}`);
});

module.exports = connectDb;