const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require("../models/tasks");

// router.post("/tasks", auth, (req, res) => {
//   const task = new Task(req.body);
//   task
//     .save()
//     .then(() => {
//       res.status(201).send(task);
//     })
//     .catch((error) => {
//       console.log("task post has error", error);
//       res.status(400).send(error);
//     });
// });

// async 
router.post("/tasks", auth,  async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try{
    await task.save()
    res.status(201).send(task)
  }catch(error){
    res.status(400).send(error)
  }
});

// router.get("/tasks", (req, res) => {
//   Task.find({})
//     .then((tasks) => {
//       res.send(tasks);
//     })
//     .catch((error) => {
//       console.log("task get has error", error);
//       res.status(500).send(error);
//     });
// });

router.get("/tasks", auth, async (req, res) => {

  const match = {}

  if(req.query.completed) {
    match.completed = req.query.completed === "true" ? "true": "false"
  }

  try{
    await req.user.populate({
      path: 'tasks',
      match: {
        completed: true
      }
    }).execPopulate()
    res.send(req.user.tasks)
  }catch(error) {
    res.status(500).send(error)
  }
})
// router.get("/tasks/:id", auth, (req, res) => {
//   const _id = req.params.id;
//   Task.findById(_id)
//     .then((task) => {
//       if (!task) {
//         return res.status(404).send();
//       }
//       res.send(task);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

router.get("/tasks/:id", auth,  async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({_id, owner: req.user._id})
    if(!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)
  }catch(error) {
    res.status(500).send()
  } 
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findOne({_id:req.params.id, owner:req.user._id});
    // const task = await Task.findById(req.params.id);


    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id",auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
