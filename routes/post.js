const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "myfirst post",
      descriptino: "random data you shoudent Access",
    },
  });
});

module.exports = router;
