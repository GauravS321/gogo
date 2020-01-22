$('#create_signature').on('click', function (e) {
    e.preventDefault();
    $('#create_signature').val('Generating signature, please wait...').attr('disabled', true);

    var data = $.trim($('textarea#data').val());

    if (data) {
        var formData = {
            data: data.trim(),
        };

        $.ajax({
            type: "POST",
            url: '/components/esignature/create',

            success: function (res) {
                if (res && res["success"]) {

                    $('#signatureStatus').show();
                    $('html, body').animate({
                        scrollTop: $("#signatureStatus").offset().top
                    }, 1000);

                    if (res["signature"]) {
                        $('#td1').html(res["signature"]);
                        $('#create_signature').val('Generate signature').attr('disabled', false);
                    }
                    else {
                        $('#td1').html("Internal server error");
                        $('#create_signature').val('Generate signature').attr('disabled', false);
                    }
                }
                else {
                    alert(res['message']);
                    window.location.href = "/components/esignature/create";
                }
            },
            error: function (err) {
                alert("Whoops, Unable to process the request");
                window.location.href = "/components/esignature/create";
            },
            data: formData
        });
    }
    else {
        alert('Missing inputs');
    }
});


$('#verify_signature').on('click', function (e) {
    e.preventDefault();

    $('#verify_signature').val('Verifying...').attr('disabled', true);

    var data = $.trim($('textarea#data').val());
    var signature = $.trim($('#signature').val());

    if (data && signature) {

        $.ajax({
            type: "POST",
            url: '/components/esignature/verify',

            success: function (res) {
                if (res && res["success"]) {

                    $('#verifySignatureStatus').show();
                    $('html, body').animate({
                        scrollTop: $("#verifySignatureStatus").offset().top
                    }, 1000);

                    if (res["signature"]) {
                        $('#td1').html(res["signature"]);
                        $('#verify_signature').val('Verify').attr('disabled', false);
                    }
                    else {
                        $('#td1').html("false");
                        $('#verify_signature').val('Verify').attr('disabled', false);
                    }
                }
                else {
                    alert(res['message']);
                    window.location.href = "/components/esignature/verify";
                }
            },
            data: {
                data,
                signature
            }
        });
    }
    else {
        alert('Missing inputs');
    }
});

$('#create_save_signature').on('click', function (e) {
    e.preventDefault();
    $('#create_save_signature').val('Generating...').attr('disabled', true);

    var data = $.trim($('textarea#data').val());

    if (data) {

        $.ajax({
            type: "POST",
            url: '/components/esignature/create-save',

            success: function (res) {
                if (res && res["success"]) {
                    $('#signStoreStatus').show();
                    $('html, body').animate({
                        scrollTop: $("#signStoreStatus").offset().top
                    }, 1000);

                    if (res["signature"]) {
                        $('#td1').html(res["signature"]);

                        if (res["txid"]) {
                            $('#td2').html(res["txid"]);
                            $('#create_save_signature').val('Sign').attr('disabled', false);
                        }
                        else {
                            $('#td2').html("Signature failed");
                            $('#create_save_signature').val('Sign').attr('disabled', false);
                        }
                    }
                    else {
                        $('#td1').html("Failed");
                    }
                }
                else {
                    alert(res['message']);
                    window.location.href = '/components/esignature/create-save';
                }
            },
            data: { data }
        });
    }
    else {
        alert('Missing inputs');
    }
});


Dropzone.options.myAwesomeDropzone = {
    maxFiles: 1,
    addRemoveLinks: true,
    uploadMultiple: false,
    init: function () {
        let esignResult = $("#esignResult");
        let esignOutputResult = $("#esignOutputResult");
        thisDropzone = this;
        this.on("success", function (file, responseText) {
            if (responseText["success"] && responseText["is_signed"] === false) {
                esignOutputResult.show();
                $('#td1').html(responseText["file_hash"]);
                $('#td2').html(responseText["signature"]);
                $('#td3').html(responseText["tx_id"]);
                esignResult.html("");
            } else if (responseText["success"] === false && responseText["is_signed"] === true) {
                esignOutputResult.hide();
                esignResult.html(`<br><p style='color:red; font-size: 32px;'>${responseText["message"]}</p>`);
            } else if (responseText["success"] === false && responseText["message"]) {
                esignOutputResult.show();
                $('#td1').html("Null");
                $('#td2').html("Null");
                $('#td3').html("Null");
                $('#td4').html("Null");
            }
        });
    }
}

Dropzone.options.myStatusDropzone = {
    maxFiles: 1,
    addRemoveLinks: true,
    uploadMultiple: false,
    init: function () {
        var content1 = $("#content1");
        var content2 = $("#content2");
        var esignVerifyResult = $("#esignVerifyResult");
        thisDropzone = this;
        this.on("success", function (file, responseText) {
            if (responseText["success"]) {
                content1.hide();
                spawnRows(responseText["sign_data"]);
            } else {
                console.log(responseText)
                esignVerifyResult.html(`<br><p style='color:red; font-size: 32px;'>${responseText["message"]}</p>`);
                // //content1.hide();
                // //content2.show(); 
                // alert(responseText["message"]);
                // window.location.href = '/ese/verify';
            }
        });
    }
};

function spawnRows(rows) {
    var tableElement = dataTable;
    for (var i = 0; i < rows.length; i++) {
        let row = tableElement.insertRow(-1);
        let tdName = row.insertCell(0);
        let tdSignature = row.insertCell(1);
        tdName.style.wordWrap = "break-word";
        tdSignature.style.wordWrap = "break-word";
        tdName.innerHTML = rows[i]["username"] + "<br>" + rows[i]["designation"] + " (" + rows[i]["organisation_name"] + ") <br><br>" + rows[i]["primechain_address"];
        tdSignature.innerHTML = rows[i]["signature"] + "<br><br>" + rows[i]["timestamp"];;
        $("#content2").show();
    }
}