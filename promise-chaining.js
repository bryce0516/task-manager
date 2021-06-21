require("./src/db/mongoose");
const User = require("./src/models/users");

//60c711515add23341b026ae2

// User.findByIdAndUpdate("60c711515add23341b026ae2", { age: 11 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 11 });
//   })
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// const updateAgeAndCount = async (id, age) => {
//   const user = await User.findByIdAndUpdate(id, { age });
//   const count = await User.countDocuments({ age });
//   return count;
// };

// updateAgeAndCount("60c711515add23341b026ae2", 2)
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((error) => console.log(error));

const deleteTaskAndCount = async (id) => {
  const task = await User.findByIdAndDelete(id);
  const count = await User.countDocuments({ name: "Andrew" });
  return count;
};

deleteTaskAndCount("60c711515add23341b026ae2")
  .then((res) => console.log("this is result", res))
  .catch((error) => {
    console.log("this is eroor", error);
  });
