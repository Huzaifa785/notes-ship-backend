const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(PORT, () => {
  console.log(`App listening at PORT: ${PORT}`);
});
