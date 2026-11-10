import express from "express";

const app = express();

app.get("/", (req, res) => res.json({ message: "API working" }));

app.listen(3000, () => console.log("Server listening on PORT 3000"));
