//向服务器端发送请求，获取文章分类数据
$.ajax({
    type: 'get',
    url: '/posts',
    success: function(response) {
        console.log(response);
        var html = template('postsTpl', response);
        $("#postsBox").html(html);
    }
})