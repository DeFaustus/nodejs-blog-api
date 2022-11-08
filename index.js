const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const router = require("./route/index");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// const db = require("./database/config");
// const model = require("./model/index");
// db.sync({ force: true })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
app.use("/api", router);
app.listen(process.env.PORT, () => {
  console.log(`run in port ${process.env.PORT}`);
});
