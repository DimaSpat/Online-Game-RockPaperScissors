const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
  },
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/gamedb");
  console.log("Connected successfully to the server");

  UserSchema.methods.done = function () {
    const greeting = `User ${this.login} has been successfully registered`;
    console.log(greeting);
  };

  const User = mongoose.model("User", UserSchema);

  const user = new User({
    login: "dima",
    password: "qwerty",
  });

  const findUser = await User.findOne({ login: "dima" });
  if (!findUser) {
    await user.save();
  } else {
    console.log(`login ${findUser.login} is already taken`);
  }
}

main().catch((err) => console.log(err));
