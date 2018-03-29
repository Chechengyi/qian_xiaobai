$(document).ready(function () {

    var page = 0
    var num = 9
    var renderDom = $('#doc-list')
    var prevDom = $('#prev')
    var nextDom = $('#next')
    var pageDom = $('#page')

    ajax(page, num) // 进入页面发送请求

    function ajax (page, num) {
        $.ajax({
            url: '/get_doc',
            type: 'GET',
            data: {
                page: page *num ,
                num: num
            },
            success: function (res) {
                console.log(JSON.parse(res))
                render(JSON.parse(res))
            }
        })
    }

    function render (data) {
        var html = ''
        if (data.length === 0) {
            html = '<div style="text-align: center;height: 100px " ><h3>没有内容了</h3></div>'
        } else {
            for ( var i=0; i<data.length; i++ ) {
                html += '<li class="list-group-item" >' +
                            '标题: <a href="/write_doc?id='+data[i].id+'">'+data[i].title+'</a>' +
                            '<div class="btn-box" ><a ref="'+data[i].id+'" href="javascript:void(0)">删除</a></div>' +
                        '</li>'
            }
        }
        renderDom.html(html)
    }

    prevDom.click( function () {
        if (page<=0) {

        } else {
            --page
            ajax(page, num)
            changePage(page)
        }
    } )
    nextDom.click( function () {
        ++page
        console.log(page)
        ajax(page, num)
        changePage(page)
    } )

    function changePage (index) {
        pageDom.html(index+1)
    }

    // 搜索商品
    $('#search').click( function () {
       var keywords = $('#title').val()
       if (keywords.indexOf(' ')===-1 &&keywords.length!==0 ) {
           $.ajax({
               url: 'get_doc_search',
               type: 'GET',
               data: {
                   keywords: keywords
               },
               success: function (res) {
                   $('#page-box').css('display', 'none')
                   render(JSON.parse(res))
               }
           })
       } else {
           swal("搜索名不能为空或含有空格！")
       }
    } )

    renderDom.click( function (e) {
        var id = $(e.target).attr('ref')
        if ( !(id === undefined)) {
            $.ajax({
                url: '/delete_doc',
                type: 'POST',
                data: {
                    id: id
                },
                success: function (res) {
                    if (res === 'ok') {
                        // console.log(e.target.parentNode.parentNode)
                        e.target.parentNode.parentNode.style.display = 'none'
                    }
                }
            })
        } else {

        }

    } )

})