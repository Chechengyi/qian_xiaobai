$(document).ready( function () {

    $('#change-btn').click( function (e) {
        if ( document.getElementById('goods_img').files.length === 0 ) {
            e.preventDefault()
            swal('请上传商品图片');
            return false
        } else {
            var fm = new FormData()
            fm.append('goods_img', document.getElementById('goods_img').files[0])
            fm.append('id', document.getElementById('goods_id').innerHTML)
            $.ajax({
                url: '/update_goods_img',
                type: 'POST',
                data: fm,
                contentType: false, //禁止设置请求类型
                processData: false, //禁止jquery对DAta数据的处理,默认会处理
                success: function (res) {
                    $('#img_').attr('src', res)
                }
            })
        }
    } )

} )