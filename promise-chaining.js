require("./src/db/mongoose");
const User = require("./src/models/users");

//60c711515add23341b026ae2

User.findByIdAndUpdate("60c711515add23341b026ae2", { age: 11 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 11 });
  })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
