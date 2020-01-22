// Ajax call for create data stream
$('#create_trade_channel').off('click').on('click', function (e) {
    e.preventDefault();

    var trade_channel_name = $.trim($('#trade_channel_name').val());
    var details = $.trim($('#details').val());
    var open = $.trim($('#open').val());

    if (trade_channel_name && details && open) {
        $.ajax({
            type: 'POST',
            url: '/components/data-channels/create',

            success: function (res) {
                if (res["success"]) {
                    if (res['transaction_id']) {

                        if (open === 'false') {
                            $('#createTradeChannelStatus').show();
                            $('#grantWritePermissions').show();
                            $('#createChannel').hide();

                            $('html, body').animate({
                                scrollTop: $("#createTradeChannelStatus").offset().top
                            }, 1000);

                            $('#td1').html(res['transaction_id']);
                            $('#grant_trade_channel_name').val(res['trade_channel_name']);
                        }
                        else {
                            $('#createChannel').hide();
                            $('#createTradeChannelStatus').show();

                            $('html, body').animate({
                                scrollTop: $("#createTradeChannelStatus").offset().top
                            }, 1000);

                            $('#td1').html(res['transaction_id']);
                            $('#grant_trade_channel_name').val(res['trade_channel_name']);
                        }
                    }
                    else {
                        alert(res['message']);
                        window.location.href = '/components/data-channels/create'
                    }
                }
                else {
                    alert(res['message']);
                    window.location.href = '/components/data-channels/create'
                }
            },
            data: {
                trade_channel_name,
                details,
                open
            }
        });
    }
    else {
        alert("Please fill the form.");
    }
});

// Ajax call for create data stream
$('#grantWritePermission').off('click').on('click', function (e) {
    e.preventDefault();

    var trade_channel_writer = $.trim($('#trade_channel_writer').val());
    var trade_channel_name = $.trim($('#trade_channel_name').val());

    if (trade_channel_writer && trade_channel_name) {
        $.ajax({
            type: 'POST',
            url: '/components/data-channels/grant',

            success: function (res) {
                if (res['success'] && res['transaction_id']) {
                    $('#grantWritePermissionStatus').show();
                    $('#grantWritePermissions').hide();

                    $('#td1').html(res['transaction_id']);
                }
                else {
                    alert("Unable to Grant write permissions for this trade channel");
                    window.location.href = '/components/data-channels/grant';
                }
            },
            data: { trade_channel_writer, trade_channel_name }
        });
    }
    else {
        alert("Please fill the form.");
    }
});

// Ajax call for create data stream
$('#revokeWritePermission').off('click').on('click', function (e) {
    e.preventDefault();

    var trade_channel_writer = $.trim($('#trade_channel_writer').val());
    var trade_channel_name = $.trim($('#trade_channel_name').val());

    if (trade_channel_writer && trade_channel_name) {
        $.ajax({
            type: 'POST',
            url: '/components/data-streams/revoke',

            success: function (res) {
                if (res['success'] && res['transaction_id']) {
                    $('#revokeWritePermissionStatus').show();
                    $('#revokeWritePermissions').hide();

                    $('#td1').html(res['transaction_id']);
                }
                else {
                    alert("Unable to revoke write permissions for this trade channel");
                    window.location.href = '/components/data-channels/revoke'
                }
            },
            data: { trade_channel_writer, trade_channel_name }
        });
    }
    else {
        alert("Please fill the form.");
    }
});

