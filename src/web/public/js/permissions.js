function grant(element) {
    var id = $(element).attr('id');
    var primechain_address = $('#primechain_address').val();

    $.ajax({
        type: 'POST',
        url: '/components/permissions/manage',
        success: function (res) {
            if (res['success']) {
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
            }
            else {
                alert(res['message']);
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
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
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
            }
            else {
                alert(res['message']);
                window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
            }
        },
        data: {
            action: "revoke",
            permission: id,
            primechain_address: primechain_address
        }
    });
}

$('#changeUserRole').change(function (e) {
    var elem = $('#user_role').val();
    var primechain_address =$('#primechain_address').val();

    if (elem == "") {
        alert('Please select role');
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/account/change-user-role',
            success: function (res) {
                if (res['success']) {
                    document.getElementById('user_role_display').innerText = res['role'];
                    // window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
                }
                else {
                    alert(res['message']);
                  //  window.location.href = `/components/permissions/manage?primechain_address=${primechain_address}`
                }
            },
            data: {
                role: elem,
                primechain_address: primechain_address
            }
        });
    }

})