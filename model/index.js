var orm = require('orm')
var url = require('../datebase.config')

var models = {}
var EXPORT = {}

orm.connect( url, function (err, db) {
    // EXPORT.db = db
    exports.db = db
    if (err) {
        console.log(err)
    } else {
        console.log('数据库连接成功')
        // 管理员user表
        models.Admin = db.define('admin', {
            id: { type: 'serial', key: true },
            username: String,
            password: String
        })
        // 用户表
        models.Customer = db.define('customer', {
            id: { type: 'serial', key: true },
            name: String,
            openid: String,
            encryptedData: String,
            img: String
        })
        // 商品表
        models.Goods = db.define('goods', {
            id: { type: 'serial', key: true },
            goods_name: String,
            goods_price: Number,
            goods_img: String,
            goods_text: String
        })
        // 商品评论表
        models.Comments = db.define('comments', {
            id: { type: 'serial', key: true },
            gid: Number,
            cid: Number,
            text: String,
            create_time: String,
            is_show: Number
        })
        // 文章表
        models.Doc = db.define('doc', {
            id: { type: 'serial', key: true },
            title: String,
            text: String,
            img: String,
            create_time: String
        })
    }

} )
// EXPORT.models = models
//
// module.exports = EXPORT
exports.models = models

