const express = require("express");
const db = require("./../modules/connect-db");
const upload = require("./../modules/upload-imgs");
const router = express.Router();


// 自訂的 middleware
router.use((req, res, next) => {
  res.locals.shin += " admin2";
  next();
});

router.get("/", (req, res) => {
  res.send("admin2: root");
});

router.get("/abc", (req, res) => {
  res.json({
    originalUrl: req.originalUrl,
    "locals.shin": res.locals.shin,
  });
});

//從資料庫取資料 0307
router.get("/myform/:id", async (req, res) => {
  const mem_id = parseInt(req.params.id) || 0;
  console.log(mem_id)
  const [rs] = await db.query(
    `SELECT * FROM member WHERE member_id=${mem_id}`
  );
  console.log(rs)
  res.json(rs);
});
// 修改資料 要用put方法 0307
router.put("/myform/:id", upload.single('avatar') ,async (req, res) =>{
    let modifyAvatar = '';
    if(req.file && req.filename){
        modifyAvatar = ` ,member_photo_img_path='${req.file.filename}' `;
    } ;
    const sql = `UPDATE member SET member_nickname=? ${modifyAvatar} WHERE member_id =? `;
    
    const result = await db.query(sql, [req.body.nickname, req.params.id ]);

    res.json(result);

});

router.get("/def", (req, res) => {
  res.json({
    originalUrl: req.originalUrl,
    "locals.shin": res.locals.shin,
  });
});

router.get("/:p1?/:p2?", (req, res) => {
  let { params, url, originalUrl, baseUrl } = req;

  res.json({
    params,
    url,
    originalUrl,
    baseUrl,
    "locals.shin": res.locals.shin,
  });
});

module.exports = router;
