//实现添加用户功能
//当表单发生提交行为时
$("#userForm").on('submit', function() {
    //获取到用户在表单中输入的内容并格式化成参数字符串
    var Formdata = $(this).serialize();
    //调用添加用户接口，将获取到的内容通过接口发送给服务器端，，
    $.ajax({
        type: 'post',
        url: '/users',
        data: Formdata,
        //操作成功刷新页面
        success: function() {
            location.reload()
        },
        //操作失败给出用户提示
        error: function() {
            alert('用户添加失败')
        }
    })
    console.log(Formdata);
    //阻止表单的默认提交行为
    return false;
});

//实现头像上传功能
$('#modifyBox').on('change', '#avatar', function() {
    //用户选择到的文件
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax方法不要解析请求参数
        processData: false,
        //告诉$.ajax方法不要设置请求参数的类型
        contentType: false,
        success: function(response) {
            //将图片的路径添加到图片标签的src属性中
            $('#preview').attr('src', response[0].avatar);
            //将图片的路径添加到隐藏域中
            $('#hiddenAvatar').val(response[0].avatar)
        }
    })
})

//实现用户列表展示功能
$.ajax({
    type: 'get',
    url: '/users',
    success: function(response) {
        var html = template('userTpl', { data: response });
        $('#userBox').html(html)
    }
})

//实现用户信息修改功能
//根据用户id查询修改用户信息
$('#userBox').on('click', '.edit', function() {
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function(response) {
            console.log(response);
            var html = template('modifyTpl', response);
            $('#modifyBox').html(html)
        }
    })
});
//为修改表单添加提交事件
$('#modifyBox').on('submit', '#modifyForm', function() {
    //获取到用户在表单中的内容并格式化成参数字符串
    var formdata = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formdata,
        //操作成功刷新页面
        success: function(response) {
            location.reload()
        }
    });
    //阻止表单的默认提交行为
    return false;
});

//实现用户信息删除功能
$('#userBox').on('click', '.delet', function() {
    if (confirm('您真的确定要删除用户吗')) {
        //获取要删除的用户id
        var id = $(this).attr('data-id');
        //向服务器端发送请求
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function() {
                location.reload()
            }
        })
    }
})

//实现批量删除用户功能
var selectAll = $('#selectAll');
//获取到批量删除按钮
var deleteMany = $('#deletMany');
//当全选按钮状态发生改变时
selectAll.on('change', function() {
    //获取到全选按钮的状态
    var status = $(this).prop('checked');

    if (status) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }
    //获取到所有的用户并将用户的状态和全选按钮保持一致
    $('#userBox').find('input').prop('checked', status)
});
//当用户前面的复选框按钮发生改变时
$('#userBox').on('change', '.userstatus', function() {
    //获取到所有用户，在所有用户中过滤出选中用户

    //判断选中用户的数量和所有用户的数量是否一致
    //如果一致，就是所有用户都选中了
    //否则就是有用户未选中
    var inputs = $('#userBox').find('input')
    if (inputs.length == inputs.filter(':checked').length) {
        selectAll.prop('checked', true)
    } else {
        selectAll.prop('checked', false)
    }
    if (inputs.filter(':checked').length > 0) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }
})
deleteMany.on('click', function() {
    var ids = [];
    //获取选中的用户
    var checkedUser = $('#userBox').find('input').filter(':checked');
    //循环复选框 从复选框元素的身上获取data-id属性的值
    checkedUser.each(function(index, element) {
        ids.push($(element).attr('data-id'))
    })
    console.log(ids);
    if (confirm('您真的确定要删除用户吗')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function() {
                location.reload();
            }
        })
    }
})