$('#issue_dave').off('click').on('click', function (e) {
    e.preventDefault();

    var formBody = {};
    var elem = document.getElementsByClassName('plugins_dave_form')[0].elements;

    for (var i = 0; i < elem.length; i++) {
        if (elem[i].name !== "") {
            if (elem[i].type === "textarea") {
                formBody[elem[i].name] = CKEDITOR.instances.ckeditor1.getData();
            }
            else {
                formBody[elem[i].name] = elem[i].value;
            }
        }
    }

    $.ajax({
        type: "POST",
        url: `${window.location.pathname}`,

        success: function (res) {
            if (res && res["success"]) {
                var bar = $(".progress-bar");

                $('#form_uploaded_id').hide();

                var percentVal = '0%';

                bar.removeClass('bar-danger');
                bar.removeClass('bar-warning');
                bar.removeClass('bar-success');
                bar.addClass('bar-info');

                $('.progress').show();
                $('#progressDaveResult').show();
                $('#uploadDaveStatus').show();

                bar.width(percentVal);
                setTimeout(() => {
                    bar.width(20 + "%");
                    $('#doc_hash').css("color", "green").removeClass("fa-question").addClass("fa-check");

                    setTimeout(() => {
                        bar.width(40 + "%");
                        $('#doc_enc').css("color", "green").removeClass("fa-question").addClass("fa-check");

                        setTimeout(() => {
                            bar.width(60 + "%");
                            $('#doc_txid').css("color", "green").removeClass("fa-question").addClass("fa-check");

                            setTimeout(() => {
                                bar.width(80 + "%");
                                $('#d_sign').css("color", "green").removeClass("fa-question").addClass("fa-check");

                                setTimeout(() => {
                                    bar.width(100 + "%");
                                    $('#sign_txid').css("color", "green").removeClass("fa-question").addClass("fa-check");

                                    $('#progressDaveResult').hide();
                                    $('#uploadingDaveHeader').html("This is what has happened");
                                    $('#DaveIssueStatus').show();

                                    let path_url = window.location.pathname;
                                    let path_url_str = path_url.substr(path_url.lastIndexOf('/') + 1);
                                    let new_url_path = path_url.replace(new RegExp(path_url_str), '');

                                    if (res["tx_id_enc_data"]) {
                                        $('#td1').html(res["tx_id_enc_data"]);

                                        if (res["tx_id_signature"]) {
                                            $('#td2').html(res["tx_id_signature"]);

                                            if (res["signature"]) {
                                                $('#td3').html(res["signature"]);

                                                if (res["aes_password"]) {
                                                    $('#td4').html(res["aes_password"]);

                                                    if (res["aes_iv"]) {
                                                        $('#td5').html(res["aes_iv"]);

                                                        if (res["trade_channel_name"]) {
                                                            $('#td6').html(res["trade_channel_name"]);

                                                            $('#td7').html(`<button class="btn btn-success m-2"
                                                                type="button"
                                                                data-placement="top"
                                                                data-toggle="tooltip" title
                                                                data-original-title="Tooltip on top" 
                                                                aria-describedby="tooltip90544"
                                                                data-clipboard-text="${window.location.origin}${new_url_path}verification?txid_data=${res['tx_id_enc_data']}&txid_signature=${res['tx_id_signature']}&password=${res['aes_password']}&iv=${res['aes_iv']}&trade_channel_name=${res['trade_channel_name']}">
                                                                Copy to clipboard
                                                            </button>`);

                                                            $('#DaveIssueDesc').show();

                                                        }
                                                        else {
                                                            $('#td6').html("failed");
                                                        }
                                                    }
                                                    else {
                                                        $('#td5').html("failed");
                                                    }
                                                }
                                                else {
                                                    $('#td4').html("failed");
                                                }
                                            }
                                            else {
                                                $('#td3').html("failed");
                                            }
                                        }
                                        else {
                                            $('#td2').html("failed");
                                        }
                                    }
                                    else {
                                        $('#td1').html("failed");
                                    }
                                }, 1000);

                            }, 1000);

                        }, 1000);

                    }, 1000);

                }, 1000);
            }
            else {
                alert(res['message']);
                window.location.href = `${window.location.pathname}`;
            }
        },
        data: formBody,
    });
});

var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function (e) {
    alert('Link copied!!!')
    e.clearSelection();
});

clipboard.on('error', function (e) {
});


$('#retrieveDaveClick').off('click').on('click', function (e) {
    e.preventDefault();

    var txid_data = $.trim($('#txid_data').val());
    var txid_signature = $.trim($('#txid_signature').val());
    var password = $.trim($('#password').val());
    var iv = $.trim($('#iv').val());
    var trade_channel_name = $.trim($('#trade_channel_name').val());

    if (txid_data && txid_signature && password && iv && trade_channel_name) {

        var formData = {
            txid_data: txid_data,
            txid_signature: txid_signature,
            password: password,
            iv: iv,
            trade_channel_name: trade_channel_name
        };

        $.ajax({
            type: "POST",
            url: '/plugins/dave/bank-guarantee/retrieve',

            success: function (res) {
                if (res && res["success"]) {
                    var bar = $(".progress-bar");

                    $('#retrieveBG').hide();

                    var percentVal = '0%';

                    bar.removeClass('bar-danger');
                    bar.removeClass('bar-warning');
                    bar.removeClass('bar-success');
                    bar.addClass('bar-info');

                    $('.progress').show();
                    $('#progressBGResult').show();
                    $('#uploadBGStatus').show();

                    bar.width(percentVal);
                    setTimeout(() => {
                        bar.width(25 + "%");
                        $('#doc_hash').css("color", "green").removeClass("fa-question").addClass("fa-check");

                        setTimeout(() => {
                            bar.width(50 + "%");
                            $('#doc_enc').css("color", "green").removeClass("fa-question").addClass("fa-check");

                            setTimeout(() => {
                                bar.width(75 + "%");
                                $('#doc_txid').css("color", "green").removeClass("fa-question").addClass("fa-check");

                                setTimeout(() => {
                                    bar.width(100 + "%");
                                    $('#d_sign').css("color", "green").removeClass("fa-question").addClass("fa-check");

                                    $('#progressBGResult').hide();
                                    $('#uploadingBGHeader').html("This is what has happened");
                                    $('#BGRetrieveStatus').show();

                                    $('#BGRetrieveStatus').show();
                                    Object.keys(res['data']).map(function (_key) {
                                        $('#BGTable')
                                            .append("<tr>")
                                            .append("<td>" + _key)
                                            .append("<td>" + res['data'][_key])

                                    });

                                }, 1000);

                            }, 1000);

                        }, 1000);

                    }, 1000);
                }
                else {
                    alert(res['message'])
                    window.location.href = '/plugins/dave/bank-guarantee/retrieve';
                }
            },
            data: formData,
        });
    }
    else {
        alert('Missing inputs');
    }
});
