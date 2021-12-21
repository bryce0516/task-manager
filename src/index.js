const express = require("express");
require("./db/mongoose");
const User = require("./models/users");
const Task = require("./models/tasks");
const app = express();
const port = process.env.PORT || 3000;

const multer = require("multer")
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // if(!file.originalname.endsWith(".pdf")) {
    //   return cb(new Error('Please upload a PDF'))
    // }
    if(!file.originalname.match(/\.(doc|docx)$/)){
      return cb(new Error("please upload doc, docx"))
    }
    cb(undefined, true)
    // cb(new Error('File must be a PDF'))
    // cb(undefined, false)
  }
})

app.post("/upload",upload.single("upload"),  (req, res) => {
  res.send()
})
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disable");
//   } else {
//     next();
//   }
//   console.log(req.method, req.path);
//   // next();
// });

// block the web site
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down, Check back Soon!");
// });

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

// const main = async () => {
//   // const task = await Task.findById('613204e91adcc20793e54d8f')
//   // await task.populate('owner').execPopulate()
//   // console.log('this is task.owner ',task.owner)


//   const user = await User.findById('613202488866e9f7aa1aa885')
//   await user.populate('tasks').execPopulate()
//   console.log(user.tasks)

// }

// main()
// const jwt = require("jsonwebtoken");
// const myfunction = () => {
//   const token = jwt.sign({ _id: "abs123" }, "this is my new course", {
//     expiresIn: "5 seconds",
//   });
//   console.log(token);

//   const data = jwt.verify(token, "this is my new course");
//   console.log(data);
// };

// myfunction();
