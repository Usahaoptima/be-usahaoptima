const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const MainRoutes = require("./Routes/index");
app.use("/api/v1", MainRoutes);

app.get("/", (req, res) => res.send("this is API"));

app.listen(port, () => console.log(`Server listening on port: ${port}`));

const ConnectionMongoDB = require("./Models/ConnectionMongoDB");
ConnectionMongoDB();
