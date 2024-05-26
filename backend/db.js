const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  // Set strictQuery to false to suppress the warning
  mongoose.set("strictQuery", false);

  try {
    mongoose.connect(process.env.MONGO_DB_URI, connectionParams);
    console.log("Connected to database successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};
