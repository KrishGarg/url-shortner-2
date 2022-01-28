const { nanoid } = require("nanoid");
const { Deta } = require("deta");

const db = getDB();

async function getLongURLAndUpdateUses(shortURL) {
  const data = await db.get(shortURL);
  if (!data) return null;
  const { longURL, uses } = data;
  await db.update(
    {
      uses: db.util.increment(1),
    },
    shortURL
  );
  return { longURL, uses: uses + 1 };
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

function getDB() {
  let deta;

  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    deta = Deta(process.env.DETA_PROJECT_KEY);
  } else {
    deta = Deta();
  }

  const db = deta.Base("url-shortner");
  return db;
}

module.exports = {
  getLongURLAndUpdateUses,
  updateDBWithShorten,
  denyAndEnd,
  getDB,
};
