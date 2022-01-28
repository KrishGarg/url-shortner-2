const express = require("express");
const { join } = require("path");
const cors = require("cors");
const apiRouter = require("./api");
const { getLongURLAndUpdateUses } = require("./helpers");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname, "frontend", "dist")));
app.use("/api", apiRouter);

app.get("/", (req, res) =>
  res.sendFile(join(__dirname, "frontend", "dist", "index.html"))
);

app.get("/docs", (_, res) => {
  res.redirect("https://github.com/KrishGarg/url-shortner-2/wiki/API-Routes");
});

app.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;
  const data = await getLongURLAndUpdateUses(shortURL);
  if (!data) return res.sendStatus(404);
  return res.redirect(data.longURL);
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}

module.exports = app;
