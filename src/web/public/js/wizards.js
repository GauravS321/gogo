// // Ajax call for the create asset
// $('#create_form_wizard').off('click').on('click', function (e) {
//     e.preventDefault();

//     $('#createAsset').val('creating...').attr('disabled', true);

//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
//     var first_name = $.trim($('#first_name').val());
// })

function viewWizard(ele) {
    var url = $(ele).attr('id');
    var id = $.trim($('#objectId').val());

    $.ajax({
        type: 'GET',
        url: `/web/element/form-wizards/${url}/:${id}`,
        success: function (res) {
            if (res['success']) {
                window.location.href = '/web/element/form-wizards/view'
            }
            else {
                window.location.href = '/web/element/form-wizards/view'
            }
        }
    });
}

function deleteWizard(ele) {
    var url = $(ele).attr('id');
    var id = $.trim($('#objectId').val());

    $.ajax({
        type: 'POST',
        url: `/web/element/form-wizards/${url}`,
        success: function (res) {
            if (res['success']) {
                window.location.href = '/web/element/form-wizards/view'
            }
            else {
                window.location.href = '/web/element/form-wizards/view'
            }
        },
        data: {
            id
        }
    });
}