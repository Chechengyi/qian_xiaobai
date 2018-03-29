$(document).ready( function () {
    var is_write = false
    var show_dom = $('#no-write')
    var write_dom = $('#write')

    var change_write = write()

    $('#change').click( function (e) {
        is_write = !is_write
        change_write(is_write)
        if (is_write) {
            e.target.innerHTML = '返回'
        } else {
            e.target.innerHTML = '修改文章'
        }
    } )

    function write () {
        show_dom.css('display', 'block')
        write_dom.css('display', 'none')
        return function (is_write) {
            if (is_write) {
                show_dom.css('display', 'none')
                write_dom.css('display', 'block')
            } else {
                show_dom.css('display', 'block')
                write_dom.css('display', 'none')
            }
        }
    }

    $('#update-img-btn').click( function () {
        if (document.getElementById('update-img').files.length == 0) {
            swal("请选择图片")
        } else {
            var fm = new FormData()
            fm.append('id', $('#id').html())
            fm.append('img',document.getElementById('update-img').files[0])
            $.ajax( {
                url: '/update_doc_img',
                type: 'post',
                data: fm,
                contentType: false, //禁止设置请求类型
                processData: false, //禁止jquery对DAta数据的处理,默认会处理
                success: function (res) {
                    console.log(res)
                    $('#write-img').attr('src', res)
                }
            } )
        }
    } )

} )