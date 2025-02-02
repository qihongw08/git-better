// defines the port 3000 for localhost use
const PORT = 3000;
// imports the express library
const express = require("express");
// initializes an express application
const app = express();

// imports routers from different files that work on requests from each endpoint
const createPullRequest = require("./routes/create-pull-request");

// Tells the app to use each router for its respective api endpoint
app.use("/create-pull-request", createPullRequest);

app.listen(PORT, () => console.log(`Local server is listening on port ${PORT}`));