$(document).ready( function () {

    var page = 0
    var num = 8
    var listBox = $('#box')
    var pageDom = $('#page')
    var seaechDom = $('#goods_name')
    // 进页面请求菜品列表信息
    function ajax ( c_page, c_num ) {
        $.ajax({
            url: '/goods_list',
            type: 'GET',
            data: {
                page: c_page * c_num ,
                num: c_num
            },
            success: function (res) {
                var data = JSON.parse(res)
                render(data)
            }
        })
    }
    ajax(page, num)

    // 分页请求

    ;(function () {
        $('#prev').click(function () {
            if (page<=0) {
                return false
            } else {
                page--
                ajax(page, num)
                changePage(page)
            }
        })
        $('#next').click(function () {
            page ++
            ajax(page, num)
            changePage(page)
        })
    })()

    // 商品搜索函数
    $('#search').click( function () {
        if (!seaechDom.val()) {
            return false
        }
        // alert(seaechDom.val())
        $.ajax({
            url: '/search_goods',
            type: 'GET',
            data: {
                goods_name: seaechDom.val()
            },
            success: function (res) {
                $('#page-box').css('display', 'none')
                render(JSON.parse(res))
            }
        })
    } )

    //改变页面函数
    function changePage (page) {
        pageDom.html(page+1)
    }

    /*
    *   render 渲染函数
    *   data 后台请求到的渲染的数据
    * */

    function render (data) {
        var html = ''
        if (data&&data.length === 0) {
            html = '<h3 style="text-align: center; width: 100%" >没有内容了···</h3>'
        } else {
            for ( var i=0 ;i<data.length; i++ ) {
                html += '<div class="thumbnail" style="width: 240px" >'+
                    '<div style="height: 160px; overflow: hidden" >'+
                    '<img width="240" src="'+data[i].goods_img+'" alt="商品图片">' +
                    '</div>' +
                    '<div class="caption">'+
                    '<h4>'+data[i].goods_name+'</h4>' +
                    '<p style="color: #ff6700" >'+ data[i].goods_price +'元</p>' +
                    '<p class="text-box">描述: '+data[i].goods_text+'</p>' +
                    '<p>'+
                    '<a href="/write_goods?id='+data[i].id+'" class="btn btn-primary" role="button">编辑</a>'+
                    '<a class="btn btn-danger margin-left delete " ref="'+data[i].id+'" role="button">删除</a>' +
                    '<a href="/goods_comments?gid='+data[i].id+'" class="anchor" >查看评论 >></a>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            }
        }
        listBox.html(html)
    }

    /*
    *  事件代理， box节点为 动态加入的 删除节点代理点击事件
    * */
    $('#box').click( function (e) {
        var ref = $(e.target).attr('ref')
        if (!ref) {
        } else {
            $.ajax({
                url: '/delete_goods',
                method: 'POST',
                data: {
                    id: ref
                },
                success: function (res) {
                    window.location.href = res
                }
            })
        }
    } )


} )