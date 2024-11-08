const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const morgan = require('morgan'); 

const projectRoute = require("./routes/project");
const stageRoute = require("./routes/stage");
const taskRoute = require("./routes/task");
const userRoute = require("./routes/user");


const app = express();
dotenv.config();
app.use(morgan('combined'));

app.use(express.json());

const { MONGO_URL, PORT } = process.env || 8080;
// const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/project", projectRoute);
app.use("/api/stage", stageRoute);
app.use("/api/task", taskRoute);
app.use("/api/user", userRoute);


// mongoo connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("succesfully connected to database");
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("an error occured", err);
  });


