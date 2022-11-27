var express = require("express");
var router = express.Router();
const db = require("../models/sqlite-db");
const sql = require("../models/user-sql");
const memoSql = require("../models/memo-sql");

router.post("/", function (req, res, next) {
  console.log("regsiterstart");
  const user = req.body;
  if (!user || !user.id || !user.password) {
    res.status(400).json({ error: "Invalid request." });
  }

  db.executeQuery(sql.selectOneUserSql(user.id), (err, rows) => {
    if (rows) {
      console.log(typeof rows);
      if (rows == (null || undefined) || rows.length == 0) {
        db.executeUpdate(sql.insertUser(user));
        res.status(200).json({ res: `회원가입에 성공했습니다` });
      } else {
        res.json({ res: "이미 존재하는 사용자입니다." });
      }
    } else {
      console.log(err);
      res.json({ error: error });
    }
  });

  res.status(200);
});

module.exports = router;
