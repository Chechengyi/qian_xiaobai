var express = require('express');
var router = express.Router();
var Model = require('../model/index').models
var https = require('https')
var weex = require('../weex')

// 管理员登录请求
router.post('/login', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    Model.Admin.find( {username: username, password: password}, function (err, user) {
        if (user.length === 0) {
            res.render('err', {content: '用户名或密码错误', url: '/users/login'})
        } else {
            req.session.isLogin = true
            res.redirect('/')
        }
    } )
});

// 管理员退出登录
router.get('/logout', function (req, res) {
    req.session.isLogin = false
    res.redirect('/users/login')
})

// 管理员登录页面路径
router.get('/login', function (req, res, next) {
    res.render('index', { title: '登录页面' });
})

//微信用户登录请求
router.post('/weex', function (req, res) {
    var code = req.body.code
    var nickName = req.body.nickName
    var encryptedData = req.body.encryptedData
    var img = req.body.img
    var returnData = {}
    // 通过code获取用户的openid
    // a06801df9a98d29d4040e442a2d1d24b   secret值
    https.get('https://api.weixin.qq.com/sns/jscode2session?appid='+ weex.appid +'&secret='+weex.secret+'&js_code='+code+'&grant_type=authorization_code', function (weex) {
        weex.setEncoding('utf8');
        weex.on('data', function (data) {
            var open_id = JSON.parse(data).openid
            Model.Customer.find({openid: open_id}, function (err, data) {
                if ( data.length === 0 ) {
                    Model.Customer.create({
                        openid: open_id,
                        name: nickName,
                        encryptedData: encryptedData,
                        img: img
                    }, function (err, data) {
                        returnData.id = data.id
                        returnData.status = 'ok'
                        returnData.name = data.name
                        res.send( JSON.stringify(returnData) )
                    })
                } else {
                    returnData.id = data[0].id
                    returnData.status = 'ok'
                    returnData.name = nickName
                    // res.send( JSON.stringify(returnData) )
                    Model.Comments.find({ id:data[0].id }).each( function (result) {
                        result.img = img
                        result.name = nickName
                    } ).save( function (err2, data) {
                        res.send(JSON.stringify(returnData))
                    } )
                }
            } )
        })
        weex.on('end', function () {
            // console.log(returnData)
            // res.send(JSON.stringify(returnData))
        } )
    }).end( function () {
    } )
})

module.exports = router;
