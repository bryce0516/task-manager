const express = require("express");
const router = new express.Router();
const User = require("../models/users");
router.get("/test", (req, res) => {
  res.send("From a new file");
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    console.log("this is jwt token", token);
    res.send({ user, token: token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    console.log("passs here");
    const user = await User.findById(req.params.id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    // user.name = "Something else";
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.log("user get has error", error);
      res.status(500).send(error);
    });
});

router.get(`/users/:id`, (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  console.log(req.params);
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
