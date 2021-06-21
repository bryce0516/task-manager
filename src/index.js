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
app.use(router);
app.use(userRouter);

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

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      console.log("task post has error", error);
      res.status(400).send(error);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((error) => {
      console.log("task get has error", error);
      res.status(500).send(error);
    });
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.patch("/tasks/:id", (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
