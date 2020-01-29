$('#publish_plian_data').off('click').on('click', function (e) {
    e.preventDefault();

    var data = $.trim($('#data').val());
    var key = $.trim($('#key').val());
    var stream_name = $.trim($('#stream_name').val());

    if (data) {
        $.ajax({
            type: "POST",
            url: '/components/data/publish',
            success: function (res) {
                if (res['success']) {
                    $('#publishPlainDataStatus').show();
                    $('html, body').animate({
                        scrollTop: $("#publishPlainDataStatus").offset().top
                    }, 1000);

                    if (res['transaction_id']) {
                        $('#td1').html(res['transaction_id']);

                        if (res['key']) {
                            $('#td2').html(res['key']);

                            if (res['stream_name']) {
                                $('#td3').html(res['stream_name']);
                            }
                            else {
                                $('#td3').html(null);
                            }
                        }
                        else {
                            $('#td2').html(null);
                        }
                    }
                    else {
                        $('#td1').html(null);
                    }
                }
                else {
                    alert(res['message']);
                    window.location.href = '/components/data/publish';
                }
            },
            error: function (err) {
                alert(err);
            },
            data: { key, data, stream_name }
        });
    }
});

// Ajax call for encrypt Sign Store Data
$('#encryptSignStoreData').off('click').on('click', function (e) {
    e.preventDefault();

    var data = $.trim($('#data').val());
    var stream_name = $.trim($('#stream_name').val());

    if (data && stream_name) {
        $.ajax({
            type: "POST",
            url: `/components/data/publish-encrypt`,

            success: function (res) {
                if (res['success']) {
                    $('#encryptSignStoreDataStatus').show();
                    $('html, body').animate({
                        scrollTop: $("#encryptSignStoreDataStatus").offset().top
                    }, 1000);

                    $('#td1').html(res['tx_id_enc_data']);
                    $('#td2').html(res['tx_id_signature']);
                    $('#td3').html(res['signature']);
                    $('#td4').html(res['password']);
                    $('#td5').html(res['iv']);
                }
                else {
                    alert("Unable to encrypt, sign and upload data");
                    window.location.href = '/components/data/publish-encrypted';
                }
            },
            error: function (err) {               
                alert(err);
            },
            data: { data, stream_name }
        });
    }
    else {
        alert("Please fill the form.");
    }
});

// Ajax call for encrypt Sign Store File
$('#encryptSignStoreFile').off('click').on('click', function (e) {
    e.preventDefault();

    var address = $.trim($('#address').val());
    var files = $('#file').get(0).files;

    if (files && files.length) {
        var formData = new FormData();

        formData.append("address", address);
        formData.append("document", files[0], files[0].name);

        if (address && formData) {
            $.ajax({
                type: "POST",
                url: `/user/encrypt_sign_store_file`,

                success: function (res) {
                    if (res['success']) {
                        $('#encryptSignStoreFileStatus').show();

                        $('#td1').html(res['transaction_id']);
                        $('#td2').html(res['signature']);
                        $('#td3').html(res['password']);
                        $('#td4').html(res['iv']);
                    }
                    else {
                        alert("Unable to encrypt, sign and upload data")
                    }
                },
                error: function (err) {
                    alert(err);
                },
                async: true,
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                timeout: 50000
            });
        }
        else {
            alert("Please fill the form.");
        }
    }
    else {
        alert("please upload the file")
    }
});

Dropzone.options.myDropzone = {
    url: '/components/file/publish-encrypt',
    autoProcessQueue: false,
    uploadMultiple: true,
    parallelUploads: 1,
    maxFiles: 1,
    maxFilesize: 5,
    // acceptedFiles: '.pdf',
    addRemoveLinks: true,
    init: function () {
        var wrapperThis = this;

        $('#publish_file').off('click').on('click', function (e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            wrapperThis.processQueue();
        });

        wrapperThis.on("sending", function (file, xhr, formData) {
            formData.append("stream_name", $.trim($('#stream_name').val()));
            // formData.append("file", file);
        });

        this.on("success", function (file, responseText) {
            if (responseText["success"]) {
                $('#publish_file_data').hide();
                $('#publishResult').show();
                $('#td1').html(responseText["tx_id_enc_file"]);
                $('#td2').html(responseText["tx_id_signature"]);
                $('#td3').html(responseText["signature"]);
                $('#td4').html(responseText["aes_password"]);
                $('#td5').html(responseText["aes_iv"]);
                $('#td6').html(responseText["stream_name"]);
            }
            else {
                alert("This file has already been uploaded.")
                window.location.href = "/components/file/publish-encrypt"
            }
        });
    }
}

Dropzone.options.myStatusDropzone = {
    init: function () {
        var content1 = $("#content1");
        var content2 = $("#content2");
        var publishResult = $("#publishResult");
        thisDropzone = this;
        this.on("success", function (file, responseText) {
            if (responseText["success"]) {
                content1.hide();
                spawnRows(responseText["sign_data"]);
            }
            else {
                content1.hide();
                content2.show();
            }
        });
    }
};

function spawnRows(rows) {
    var tableElement = dataTable;
    for (var i = 0; i < rows.length; i++) {
        let row = tableElement.insertRow(-1);
        // row.id = "shadow";
        let tdName = row.insertCell(0);
        let tdTimestamp = row.insertCell(1);
        let tdSignature = row.insertCell(2);
        tdName.style.wordWrap = "break-word";
        tdTimestamp.style.wordWrap = "break-word";
        tdSignature.style.wordWrap = "break-word";
        tdName.innerHTML = rows[i]["signer_name"] + "<br>" + rows[i]["singer_designation"] + "<br>" + rows[i]["singer_organisation"] + "<br>" + rows[i]["singer_address"];
        tdTimestamp.innerHTML = rows[i]["timestamp"];
        tdSignature.innerHTML = rows[i]["signature"];
        $("#content2").show();
    }
}