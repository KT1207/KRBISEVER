var express = require("express");
var router = express.Router();
const db = require("../models/sqlite-db");
const sql = require("../models/user-sql");
/* GET users listing. */
router.get("/", function (req, res, next) {});

router.post("/login", function (req, res, next) {
  const { userid, password } = req.body;
  console.log(userid, password);

  if (!userid || !password) {
    return res.status(400).json({
      error: "Invalid parameters",
    });
  }

  async function login(rows) {
    console.log(rows);
    let user = null;
    if (rows != null) user = rows[0];
    if (user == null) {
      throw new Error("Login failed");
    } else {
      console.log(user);
      if (user.password == password) return user;
      else throw new Error("Login failed");
    }
  }

  async function authorize(user) {
    const payload = {
      sub: user.userid,

      aud: "miniServer", // receiver
      iat: Math.floor(Date.now() / 1000), // issued at
    };
    const option = {
      algorithm: "HS256",
      expiresIn: "1000d",
      issuer: "miniServer",
    };
    const result = {
      userid: user.userid,
    };
    console.log(result);
    return result;
  }

  async function respond(result) {
    res.json(result);
  }

  const onError = (error) => {
    res.status(403).json({
      error: error.message,
    });
  };

  db.executeQuery(sql.selectOneUserSql(userid), (error, rows) => {
    login(rows)
      .then(() => {
        console.log("succes");
        console.log("succes");
        if (rows) {
          if (rows == (null || undefined) || rows.length == 0) {
            res
              .status(403)
              .json({ res: `아이디 또는 비밀번호를 확인해 주십시오` });
          } else {
            res.json({ res: "로그인 되었습니다." });
          }
        } else {
          console.log(err);
          res.json({ error: error });
        }
      })
      .then(respond)
      .catch(onError);
  });
});

module.exports = router;
