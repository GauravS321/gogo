function grant(element) {
    var id = $(element).attr('id');

    $.ajax({
        type: 'POST',
        url: '/components/permissions/manage',
        success: function (res) {
            if (res['success']) {
                window.location.href = '/components/permissions/list'
            }
            else {
                alert(res['message']);
                window.location.href = '/components/permissions/list'
            }
        },
        data: {
            action: "grant",
            permission: id
        }
    });
}

function revoke(element) {
    var id = $(element).attr('id');

    $.ajax({
        type: 'POST',
        url: '/components/permissions/manage',
        success: function (res) {
            if (res['success']) {
                window.location.href = '/components/permissions/list'
            }
            else {
                alert(res['message']);
                window.location.href = '/components/permissions/list'
            }
        },
        data: {
            action: "revoke",
            permission: id
        }
    });
}