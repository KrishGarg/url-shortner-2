const express = require("express");
const { Deta } = require("deta");
const { isUri } = require("valid-url");
const { nanoid } = require("nanoid");
const { join } = require("path");

let deta;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  deta = Deta(process.env.DETA_PROJECT_KEY);
} else {
  deta = Deta();
}

const app = express();
app.use(express.json());

app.use(express.static(join(__dirname, "frontend", "dist")));

const db = deta.Base("url-shortner");

app.get("/", (req, res) =>
  res.sendFile(join(__dirname, "frontend", "dist", "index.html"))
);

app.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;
  const longURL = await getLongURLAndUpdateUses(shortURL);
  if (!longURL) return res.sendStatus(404);
  return res.redirect(longURL);
});

app.post("/api/shorten", async (req, res) => {
  const { longURL } = req.body;

  if (!longURL) {
    return denyAndEnd("No long URL in the body.", res);
  }

  if (!isUri(longURL)) {
    return denyAndEnd("Not a valid URI.", res);
  }

  const { key: shortURL } = await updateDBWithShorten(longURL);

  return res.status(200).json({
    shortURL,
    message: "Successfully shortened.",
    error: false,
  });
});

app.get("/api/shorten", async (req, res) => {
  const { shortURL } = req.query;
  const longURL = await getLongURLAndUpdateUses(shortURL);
  if (!longURL) return res.sendStatus(404);
  return res.status(200).json({
    message: "Successfully found the longURL for the given code.",
    error: false,
    longURL,
  });
});

async function getLongURLAndUpdateUses(shortURL) {
  const data = await db.get(shortURL);
  if (!data) return null;
  const { longURL } = data;
  await db.update(
    {
      uses: db.util.increment(1),
    },
    shortURL
  );
  return longURL;
}

function denyAndEnd(message, res) {
  return res.status(400).json({
    message,
    error: true,
  });
}

async function updateDBWithShorten(longURL) {
  const id = nanoid(8);
  try {
    const res = await db.insert({ longURL, uses: 0 }, id);
    return res;
  } catch {
    return updateDBWithShorten(longURL);
  }
}

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}

module.exports = app;
