const mongoose = require("mongoose");

exports.connectdb = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then((e) => console.log(`Mongodb connected at ${e.connection.host}`))
    .catch((e) => console.log(e));
};

const userschema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

exports.User = mongoose.model("user", userschema);
