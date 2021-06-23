const express = require("express");
require("./db/mongoose");
const User = require("./models/users");
const Task = require("./models/tasks");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const router = new express.Router();
router.get("/test", (req, res) => {
  res.send("this is from my other router");
});

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(router);
app.use(userRouter);
app.use(taskRouter);
// promise
// app.post("/users", (req, res) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then(() => {
//       res.status(201).send(user);
//     })
//     .catch((error) => {
//       console.log("user post has error", error);
//       res.status(400).send(error);
//     });
// });

app.listen(port, () => {
  console.log("Server is up on port" + port);
});

const jwt = require("jsonwebtoken");
const myfunction = () => {
  const token = jwt.sign({ _id: "abs123" }, "this is my new course", {
    expiresIn: "5 seconds",
  });
  console.log(token);

  const data = jwt.verify(token, "this is my new course");
  console.log(data);
};

myfunction();
