const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');

const router = express.Router();

async function getListData(req, res){
    const perPage = 5; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = (req.query.page && parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
    if(page<1){
        return res.redirect('/address-book/list');
    }
    const conditions = {};  // 傳到 ejs 的條件
    let search = req.query.search ? req.query.search : '';
    search = search.trim(); // 去掉頭尾空白
    let sqlWhere = ' WHERE 1 ';
    if(search){
        sqlWhere += ` AND \`name\` LIKE ${db.escape('%'+search+'%')} `;
        conditions.search = search;
    }

    // 輸出
    const output = {
        // success: false,
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        conditions
    };

    const t_sql = `SELECT COUNT(1) num FROM member ${sqlWhere} `;
    // return res.send(t_sql); // 除錯用
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    // let totalPages = 0;
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;
        if(page > output.totalPages){
            // 到最後一頁
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }

        const sql = `SELECT * FROM \`member\` ${sqlWhere} ORDER BY member_id DESC LIMIT ${perPage*(page-1)}, ${perPage} `;
        const [rs2] = await db.query(sql);
        rs2.forEach(el=>{
            let str = res.locals.toDateString(el.birthday);
            if(str === 'Invalid date'){
                el.birthday = '沒有輸入資料';
            } else {
                el.birthday = str;
            }

        });
        output.rows = rs2;
    }

    return output;
}

router.get('/', async (req, res)=>{
    res.redirect('/address-book/list');
});
router.get('/list', async (req, res)=>{
    res.render('address-book/list', await getListData(req, res));
});
router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});

router.get('/add', async (req, res)=>{
    res.render('address-book/add');
});
// multipart/form-data
router.post('/add2', upload.none(), async (req, res)=>{
    res.json(req.body);
});
// application/x-www-form-urlencoded
// application/json
router.post('/add', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };
    /*
    const sql = "INSERT INTO member SET ?";
    const obj = {...req.body, created_at: new Date()};

    const [result] = await db.query(sql, [obj]);
    console.log(result);
    */

    // TODO: 資料格式檢查
    const sql = "INSERT INTO `member`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";
    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
    ]);
    console.log(result);
    output.success = !! result.affectedRows;
    output.result = result;

    res.json(output);
});
router.get('/delete/:member_id', async (req, res)=>{
    // req.get('Referer') // 從哪裡來
    const sql = "DELETE FROM member WHERE member_id=?";
    const [result] = await db.query(sql, [req.params.member_id]);
    res.redirect('/address-book/list');
});

router.get('/edit/:member_id', async (req, res)=>{
    const sql = "SELECT * FROM member WHERE member_id=?";
    const [rs] = await db.query(sql, [req.params.member_id]);

    if(! rs.length){
        return res.redirect('/address-book/list');
    }

    res.render('address-book/edit', rs[0]);
});

router.post('/edit/:member_id', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };

    const sql = "UPDATE `member` SET ? WHERE member_id=?";


    const [result] = await db.query(sql, [req.body, req.params.member_id]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
});

module.exports = router;