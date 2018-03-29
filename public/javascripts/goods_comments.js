$(document).ready( function () {

    var gid = $('#gid').html()
    var page = 0
    var num = 9
    var is_show = 0
    var wrapDom = $('#comments_box')
    var pageDom = $('#page')
    var showDom = $('#show')
    var hideDom = $('#hide')

    function select_Dom (index) {
        if (index === 0) {
            hideDom.addClass('btn-primary')
            showDom.removeClass('btn-primary')
        } else {
            showDom.addClass('btn-primary')
            hideDom.removeClass('btn-primary')
        }
    }

    select_Dom(is_show)

    // 点击显示微信客户端显示的评论
    showDom.click( function () {
        is_show = 1
        page = 0
        num = 9
        select_Dom(1)
        Ajax(page, num, is_show)
    } )
    // 点击显示微信客户端不显示的评论
    hideDom.click( function () {
        is_show = 0
        page = 0
        num = 9
        select_Dom(0)
        Ajax(page, num, is_show)
    } )

    $('#prev').click( function () {
        if (page <= 0) {
            return false
        }
        page --
        pageDom.html(page+1)
        Ajax(page, num, is_show)
    } )
    $('#next').click( function () {
        page ++
        pageDom.html(page+1)
        Ajax(page, num, is_show)
    } )
    $('#reset').click( function () {
        window.location.href='/goods_comments?gid='+gid
    } )

    Ajax(page, num, is_show)

    function Ajax ( page, num, is_show ) {
        $.ajax({
            url: '/get/goods_comments_list',
            type: 'GET',
            data: {
                page: page * num ,
                num: num,
                gid: gid,
                is_show: is_show
            },
            success: function (res) {
                console.log(res)
                render(JSON.parse(res))
            }
        })
    }

    function render (data) {
        var html = ''
        if (data.length === 0) {
            html = '<h4 style="text-align:center" >没有内容了</h4>'
        } else {
            for ( var i=0 ;i<data.length; i++ ) {
                if ( data[i].is_show === 0 ) {
                    html += '<div class="comments-item" >' +
                        '<div class="user-info-box" >' +
                        '<div>' +
                        '<img width="80" height="80" src="'+data[i].img+'" alt="用户头像">' +
                        '</div>' +
                        '<div style="margin-top: 10px" ><p>'+data[i].name+'</p></div>'+
                        '</div>' +
                        '<div class="content-box" >' +
                        '<div style="overflow: hidden" >' +
                        '<div class="type-box" >' +
                        '<p>评论是否显示: <span style="color: red" >未显示</span></p>' +
                        '</div>' +
                        '<div class="btn-box" >' +
                        // '<a href="javascript:void(0)" >隐藏评论</a>' +
                        '<a href="/show_comments?id='+data[i].id+'&gid='+gid+'"  >显示评论</a>' +
                        '<a href="/delete_comments?id='+data[i].id+'&gid='+gid+'"  >删除</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="text-box" >'+data[i].text+'</div>' +
                        '<div class="time-box" >发表时间: '+new Date(data[i].create_time).toLocaleDateString()+'</div>' +
                        '</div>' +
                        '</div>'
                } else {
                    html += '<div class="comments-item" >' +
                        '<div class="user-info-box" >' +
                        '<div>' +
                        '<img width="80" height="80" src="'+data[i].img+'" alt="用户头像">' +
                        '</div>' +
                        '<div style="margin-top: 10px" ><p>'+data[i].name+'</p></div>'+
                        '</div>' +
                        '<div class="content-box" >' +
                        '<div style="overflow: hidden" >' +
                        '<div class="type-box" >' +
                        '<p>评论是否显示: <span style="color: green" >已显示</span></p>' +
                        '</div>' +
                        '<div class="btn-box" >' +
                        '<a href="/hide_comments?id='+data[i].id+'&gid='+gid+'" >隐藏评论</a>' +
                        // '<a href="javascript:void(0)"  >显示评论</a>' +
                        '<a href="/delete_comments?id='+data[i].id+'&gid='+gid+'"  >删除</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="text-box" >'+data[i].text+'</div>' +
                        '<div class="time-box" >发表时间: '+new Date(data[i].create_time).toLocaleDateString()+'</div>' +
                        '</div>' +
                        '</div>'
                }
            }
        }
        wrapDom.html(html)
    }


} )

