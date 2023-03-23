const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const userRoutes = require("./routes/user");

console.log(config);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//now connect to mongoDB
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log(`connected to mongoDB dataBase`);
    StartServer();
  })
  .catch((error) => {
    console.log(`Unable to connect to DB`);
    console.log(error);
  });

app.listen(config.server.port, () => {
  console.log(`server started on port ${config.server.port}`);
});

//  only start if server is connected
const StartServer = () => {
  app.use((req, res, next) => {
    console.log(`method: ${req.method}, URL: ${req.url}`);
    next();
  });

  app.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "Routers are working fine" })
  );
  app.use("/userroute", userRoutes);
  app.use((req, res, next) => {
    const error = new Error("Request not matched - not found");
    console.log(error);
    return res.status(404).json({ message: error.message });
  });
};
