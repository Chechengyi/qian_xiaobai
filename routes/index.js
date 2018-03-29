var express = require('express');
var router = express.Router();
var Model = require('../model/index').models
var db = require('../model/index').db
var dataBase = require('../model/index')
var fs = require('fs')
var rootPath = require('../rootPath')
/*
*   保存图片模块设置
* */
var multer = require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
})


// 首页
router.get('/', function(req, res, next) {
    if ( !req.session.isLogin ) {
        res.render('err', {content: '请先登录', url: '/users/login'})
      return false
    }
    res.render('cont/index')
});

// 商品信息页
router.get('/goods', function (req, res) {
    if ( !req.session.isLogin ) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    console.log('sadasdsadasd')
    res.render('cont/goods')
})

/*
*  获取商品信息请求
*  page: 跳过几条记录
*  num  查询几条记录
* */
router.get('/goods_list', function (req, res) {
    var page = req.query.page
    var num = req.query.num
    Model.Goods.find().limit(parseInt(num)).offset(parseInt(page)).run( function (err, data) {
        res.send(JSON.stringify(data))
    } )
})

/*
*  商品名搜索商品， 模糊搜索
*  goods_name  需要搜索的商品
* */
router.get('/search_goods', function (req, res) {
    var goods_name = req.query.goods_name
    dataBase.db.driver.execQuery('SELECT * FROM goods WHERE goods_name LIKE "%'+goods_name+'%"', function (err, data) {
        res.send(JSON.stringify(data))
    })
})

// 添加商品页
router.get('/add_goods', function (req, res) {
    res.render('cont/add_goods')
})

//添加商品请求
router.post('/add_goods',upload.single('goods_img'), function (req, res) {
    if ( !req.session.isLogin ) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var goods_name = req.body.goods_name
    var goods_price = req.body.goods_price
    var gooos_text = req.body.goods_text
    // multer模块存图片的地址
    var imagePath = req.file.path
    var newPath = 'uploads/' + req.file.originalname
    fs.rename( imagePath, newPath, function (err) {
        Model.Goods.create({
            goods_name: goods_name,
            goods_price: goods_price,
            goods_text: gooos_text,
            goods_img: rootPath + '/' + newPath
        }, function (err, data) {
            res.redirect('/goods')
        } )
    })
})

// 删除商品请求
router.post('/delete_goods', function (req, res) {
    var id = req.body.id
    if ( !req.session.isLogin ) {
        res.send('/users/login')
        return false
    }
    Model.Goods.find({id: id}).remove( function (err) {
        res.send('/goods')
    } )
})

// 微信小程序端商品评论
router.post('/comments_goods', function (req, res) {
    var cid = req.body.cid
    var sid = req.body.sid
    var text = req.body.input
    var time = new Date().toLocaleDateString()

    Model.Comments.createAsync({
        cid: cid,
        gid: sid,
        text:text,
        create_time: time,
        is_show: 0
    })
        .then( function (result) {
            res.send('ok')
        } )

})

// 小程序端获取商品评论
router.get('/get_comments_goods', function (req, res) {
    var page = req.query.page
    var num = req.query.num
    var gid = req.query.gid
    dataBase.db.driver.execQuery('select * FROM comments as com, customer as cus, goods as goods WHERE goods.id='+gid+' and com.gid ='+gid + ' and com.is_show=1 limit '+num+' offset ' +page, function (err, data) {
        res.send(JSON.stringify(data))
    })
})

/*
*   修改商品信息页面
*   传入参数: id  需要修改的商品的id
* */
router.get('/write_goods', function (req, res) {
    if ( !req.session.isLogin ) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = parseInt(req.query.id)
    Model.Goods.find({id: id}, function (err, data) {
        res.render('cont/write_goods', {goods: data[0]})
    })
})

// 修改商品图片
router.post('/update_goods_img',upload.single('goods_img'), function (req, res) {
    if (!req.session.isLogin) {
        res.send('err')
    } else {
        var id = req.body.id
        var imagePath = req.file.path
        var newPath = 'uploads/' + req.file.originalname
        fs.rename( imagePath, newPath, function (err) {
            Model.Goods.find({id: id}).each( function (result) {
                result.goods_img = rootPath + '/' +newPath
            } ).save( function (err2) {
                res.send(newPath)
            } )
        })
    }
})

// 修改商品信息
router.post('/update_goods', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = req.body.id
    var goods_name = req.body.goods_name
    var goods_price = req.body.goods_price
    var goods_text = req.body.goods_text
    Model.Goods.find({id: id}).each( function (result) {
        result.goods_name = goods_name
        result.goods_price = goods_price
        result.goods_text = goods_text
    } ).save( function (err) {
        res.redirect('/goods')
    } )
})

// 管理员查看商品评论页面
router.get('/goods_comments', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var gid = req.query.gid
    Model.Goods.find({id: gid}, function (err, data) {
        res.render('cont/goods_comments', {goods: data[0]})
    })
})
// 管理员查看商品评论列表请求
router.get('/get/goods_comments_list', function (req, res) {
    var page = req.query.page
    var num = req.query.num
    var gid = req.query.gid
    var is_show = parseInt(req.query.is_show)

    dataBase.db.driver.execQuery('SELECT\n' +
        '\tcom.id AS id,\n' +
        '\tcus.img AS img,\n' +
        '\tcus.name AS `name`,\n' +
        '\tcom.create_time AS create_time,\n' +
        '\tcom.text AS text,\n' +
        '\tcom.is_show AS is_show\n' +
        'FROM\n' +
        '\tcomments AS com,\n' +
        '\tcustomer AS cus,\n' +
        '\tgoods AS goods\n' +
        'WHERE\n' +
        '\tgoods.id = '+gid+'\n' +
        'AND com.gid = '+gid+'\n' +
        'AND com.is_show = '+ is_show + ' ' +
        'LIMIT '+num+' OFFSET '+page, function (err, data) {
        res.send(JSON.stringify(data))
    })

})
// 管理员控制商品评论显示到微信端
router.get('/show_comments', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var gid = req.query.gid  // 商品id
    console.log(gid)
    var id = req.query.id    // 评论id
    Model.Comments.find({id: id}).each( function (result) {
        result.is_show = 1
    } ).save( function (err) {
        res.redirect('/goods_comments?gid=' +gid)
    } )
})
// 管理员控制商品评论在微信端不显示
router.get('/hide_comments', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var gid = req.query.gid
    var id = req.query.id
    Model.Comments.find({id: id}).each( function (result) {
        result.is_show = 0
    } ).save( function (err) {
        res.redirect('/goods_comments?gid=' +gid)
    } )
})
// 管理员删除评论
router.get('/delete_comments', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var gid = req.query.gid
    var id = req.query.id
    Model.Comments.find({id: id}).remove( function (err) {
        res.redirect('/goods_comments?gid=' +gid)
    } )
})

// 文章管理页面
router.get('/doc_page', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    res.render('cont/doc')
})
// 管理员添加文章页面
router.get('/add_doc_page', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    res.render('cont/add_doc')
})
// 管理员添加文章请求
router.post('/add_doc', upload.single("img"),function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var title = req.body.title
    var text = req.body.text
    var imagePath = req.file.path
    var newPath = 'uploads/' + req.file.originalname

    fs.rename(imagePath, newPath, function (err) {
        Model.Doc.create({
            title: title,
            text: text,
            img: rootPath + '/' + newPath,
            create_time: new Date().toLocaleDateString()
        }, function (err) {
            res.redirect('/doc_page')
        })
    })
})

// 文章内容上传图片
router.post('/magazines/upload_img', upload.single("upload"), function (req, res, next) {
    var image = req.file.path
    var newPath = 'uploads/' + req.file.originalname
    var CKEditorFuncNum = req.query.CKEditorFuncNum
    fs.rename( image, newPath, function (err) {
        if (err) {
            throw err
        } else {
            var back = '<script type="text/javascript" >' +
                "window.parent.CKEDITOR.tools.callFunction("+ CKEditorFuncNum + ",'" +rootPath+ "/" + newPath + "','')" +
                '</script>'
            res.send(back)
        }
    } )
})

// 获取文章列表  参数: page, num
router.get('/get_doc', function (req, res) {
    var page = req.query.page
    var num = req.query.num
    Model.Doc.find().limit(parseInt(num)).offset(parseInt(page)).run( function (err, data) {
        res.send(JSON.stringify(data))
    } )
})

// 搜索文章请求
router.get('/get_doc_search', function (req, res) {
    var keywords = req.query.keywords
    dataBase.db.driver.execQuery('SELECT * FROM doc WHERE title LIKE "%'+keywords+'%"', function (err, data) {
        res.send(JSON.stringify(data))
    })
})
// 管理员删除文章请求
router.post('/delete_doc', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = req.body.id
    Model.Doc.find({id: id}).remove( function (err) {
        res.send('ok')
    } )
})
// 文章展示页面
router.get('/write_doc', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = req.query.id
    Model.Doc.find({id: id}, function (err, data) {
        res.render('cont/write_doc', {data: data[0]})
    })
})

//修改文章配图请求
router.post('/update_doc_img', upload.single("img"), function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = req.body.id
    var imagePath = req.file.path
    var newPath = 'uploads/' + req.file.originalname
    fs.rename( imagePath, newPath, function (err) {
        Model.Doc.find({id: id}).each( function (result) {
            result.img = rootPath + '/' +newPath
        } ).save( function (err2) {
            res.send(newPath)
        } )
    })
})

//修改文章内容请求
router.post('/update_doc', function (req, res) {
    if (!req.session.isLogin) {
        res.render('err', {content: '请先登录', url: '/users/login'})
        return false
    }
    var id = req.body.id
    var title = req.body.title
    var text = req.body.text
    Model.Doc.find({id: id}).each( function (result) {
        result.title = title
        result.text = text
    } ).save( function (err) {
        res.redirect('/write_doc?id='+id)
    } )
})


module.exports = router;

