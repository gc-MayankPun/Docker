const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Docker version 2!")
})

app.get("/about", (req, res) => {
    res.json({
        project: "Docker Learning",
        message: "My first containerized application"
    })
})

app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on PORT ${PORT}`));