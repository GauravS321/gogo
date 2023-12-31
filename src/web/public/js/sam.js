// Ajax call for the create asset
$('#createAsset').off('click').on('click', function (e) {
    $('#createAsset').val('creating...').attr('disabled', true)

    var name = $.trim($('#asset_name').val());
    var quantity = $.trim($('#asset_quantity').val());
    var open = $.trim($('#asset_open').val());
    var unit = $.trim($('#asset_unit').val());
    var description = $.trim($('#asset_description').val());

    if (name && quantity && open && unit && description) {
        $.ajax({
            type: 'POST',
            url: '/components/sam/create',
            success: function (res) {
                if (res['success']) {
                    $("#asset_form").hide();

                    $('#assetStatus').show();
                    $('#info').html("<h4>Asset has been creating, it takes max of 30 secs...</h4><hr>");

                    if (res["asset_name"]) {
                        $('#name').css("color", "green").removeClass("fa-question").addClass("fa-check");
                        $('#td1').html(res["asset_name"]);

                        if (res["asset_quantity"]) {
                            $('#quantity').css("color", "green").removeClass("fa-question").addClass("fa-check");
                            $('#td2').html(res["asset_quantity"]);

                            if (res["asset_open"]) {
                                $('#open').css("color", "green").removeClass("fa-question").addClass("fa-check");
                                $('#td3').html(res["asset_open"]);

                                if (res["asset_unit"]) {
                                    $('#unit').css("color", "green").removeClass("fa-question").addClass("fa-check");
                                    $('#td4').html(res["asset_unit"]);

                                    if (res["asset_description"]) {
                                        $('#description').css("color", "green").removeClass("fa-question").addClass("fa-check");
                                        $('#td5').html(res["asset_description"]);

                                        if (res["asset_ref"]) {
                                            $('#reference').css("color", "green").removeClass("fa-question").addClass("fa-check");
                                            $('#td6').html(res["asset_ref"]);

                                            if (res["txid"]) {
                                                $('#txid').css("color", "green").removeClass("fa-question").addClass("fa-check");
                                                $('#td7').html(res["txid"]);

                                                $('#info').html("<h4>Asset created succesfully</h4></h4><hr>");
                                            }
                                            else {
                                                $('#td7').html("failed");
                                            }
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
                }
                else {
                    alert(res['message']);
                    window.location.href = "/components/sam/create";
                }
            },
            error: function (error) {
                alert(error);
                window.location.href = "/components/sam/create";
            },
            data: {
                name,
                quantity,
                open,
                unit,
                description,
            }
        });
    }
    else {
        alert("Please fill the form carefully");
        window.location.href = "/components/sam/create";
    }
});

$(document).ready(function () {
    $('#send_asset_name').select2({
        minimumInputLength: 1,
        dataType: 'json',
        ajax: {
            url: '/components/sam/list',
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            minimumResultsForSearch: 10,
            data: function (term) {
                return {
                    term: term
                };
            },
            processResults: function (data) {
                return {
                    results: $.map(data.items, function (val, i) {
                        return {
                            id: val.id,
                            text: val.name
                        };
                    })
                };
            }
        }
    });
});

// Ajax call for send Asset From
$('#sendAssetFrom').off('click').on('click', function (e) {
    $('#sendAssetFrom').val('Please wait...').attr('disabled', true)

    var address = $.trim($('#address').val());
    var name = $.trim($('#asset_name').val());
    var quantity = $.trim($('#asset_quantity').val());
    var description = $.trim($('#asset_description').val());

    if (from_address && to_address && name && quantity && description) {
        $.ajax({
            type: "POST",
            url: `/components/sam/transfer`,

            success: function (res) {
                if (res && res['transaction_id']) {
                    $('#sendAssetFromStatus').show();

                    $('#td1').html(res['transaction_id']);
                }
                else {
                    alert("Unable to transfer asset");
                    window.location.href = 'components/sam/transfer';
                }
            },
            data: {
                address,
                name,
                quantity,
                description
            }
        });
    }
    else {
        alert("Please fill the form.");
    }
});
