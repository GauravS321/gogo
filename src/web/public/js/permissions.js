function grant(element) {
    var id = $(element).attr('id');
    var primechain_address = $('#primechain_address').val();

    $.ajax({
        type: 'POST',
        url: '/components/permissions/manage',
        success: function (res) {
            if (res['success']) {
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}&success_msg=Permissin granted. Transaction ID: ${res['transaction_id']}`
            }
            else {
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}&error_msg="Unable to grant permission, please try again"`
            }
        },
        data: {
            action: "grant",
            permission: id,
            primechain_address: primechain_address
        }
    });
}

function revoke(element) {
    var id = $(element).attr('id');
    var primechain_address = $('#primechain_address').val();

    $.ajax({
        type: 'POST',
        url: '/components/permissions/manage',
        success: function (res) {
            if (res['success']) {
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}&success_msg=Permissin changed. Transaction ID: ${res['transaction_id']}`
            }
            else {
                alert(res['message']);
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}&error_msg="Unable to grant permission, please try again`
            }
        },
        data: {
            action: "revoke",
            permission: id,
            primechain_address: primechain_address
        }
    });
}

function changeUserRole(role, address) {
    var primechain_address = address;
    var role = role;

    if (role == "") {
        alert('Please select role');
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/account/change-user-role',
            success: function (res) {
                if (res['success']) {
                    document.getElementById(`user_role_display#${primechain_address}`).innerText = res['role'];
                    // window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
                }
                else {
                    alert(res['message']);
                    //  window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
                }
            },
            data: {
                role: role,
                primechain_address: primechain_address
            }
        });
    }
}