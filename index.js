const express = require("express");
const router = require("./routes/users");
const swipeRoutes = require("./routes/swipes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api", router);
app.use("/api", swipeRoutes);

app.listen(PORT, () => {
  console.log("Express.js is running on port:", PORT);
});
