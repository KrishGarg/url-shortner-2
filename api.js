const {
  denyAndEnd,
  updateDBWithShorten,
  getLongURLAndUpdateUses,
} = require("./helpers");
const { isUri } = require("valid-url");
const router = require("express").Router();

router.post("/shorten", async (req, res) => {
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

router.get("/shorten", async (req, res) => {
  const { shortURL } = req.query;
  if (!shortURL) return res.sendStatus(404);

  const data = await getLongURLAndUpdateUses(shortURL);
  if (!data) return res.sendStatus(404);

  return res.status(200).json({
    message: "Successfully found the longURL for the given code.",
    error: false,
    longURL: data.longURL,
    uses: data.uses,
  });
});

module.exports = router;
