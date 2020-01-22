var currentTab;


$(document).ready(function () {
    currentTab = 0;
    if ($(".individual-form").length > 0 || $(".entity-form").length > 0) {
        showTab(currentTab);

        $(".entity-form,.individual-form,.user-form").off('change', 'input,textarea,select', validateField);
        $(".entity-form,.individual-form,.user-form").on('change', 'input,textarea,select', validateField);
    }
});

function validateField() {
    var ele = this;

    if (ele.required) {
        if (ele.hasAttribute("data-custom-validation")) {
            var cbFunc = ele.getAttribute("data-custom-validation");
            if ($.isFunction(window[cbFunc]))
                window[cbFunc](this);

        } else {
            if (ele.value) {
                removeErrorMessage(ele);
            } else {
                var errMsg = ele.getAttribute("data-error") || "Required";
                showErrorMessage(errMsg, ele);
            }
        }
    }
}

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) {
        return false
    };
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        document.getElementById("formValidation").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].querySelectorAll("input,textarea,select");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].parentElement.className.indexOf('has-error has-danger') > -1) {
            if (valid) {
                $(y[i]).focus();
                valid = false;
            }
        } else if (y[i].value == "" && y[i].required) {
            // add an "invalid" class to the field:
            y[i].parentElement.className += ' has-error has-danger';
            // and set the current valid status to false:
            if (valid) {
                $(y[i]).focus();
                valid = false;
            }
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    // if (valid) {
    //     document.getElementsByClassName("step")[currentTab].className += " finish";
    // }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

function showErrorMessage(txt, id) {
    $(id).closest("div", "form-group").addClass('has-error has-danger');
    $(id).after(`<div class='help-block form-text with-errors form-control-feedback'>
                       <p>${txt}</p>
                    </div>`);
}

function removeErrorMessage(id) {
    $(id).closest("div", "form-group").removeClass('has-error has-danger');
    $(id).next('.with-errors').remove();
}

function validateValue(ele) {
    var formClassName = document.getElementsByTagName('form')[0].getAttribute('class');

    if (formClassName === 'entity-form') {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        var type = ele.name;
        var searchValue = ele.value.trim();
        removeErrorMessage(ele);

        if (type === 'cin_number') {
            if (!validateCIN(searchValue)) {
                showErrorMessage('Please enter valid cin number', ele);
                return;
            }
        } else if (type === 'income_tax_number') {
            if (!validatePAN(searchValue)) {
                showErrorMessage('Please enter valid income tax number', ele);
                return;
            }
        } else if (type === 'gst_number') {
            if (!validateGST(searchValue)) {
                showErrorMessage('Please enter valid gst number', ele);
                return;
            }
        }

        fetch(`/entity/validate-fields?${type}=${searchValue}`, {
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'CSRF-Token': token // <-- is the csrf token as a header
                },
                method: 'GET',
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result['isAvailable']) {
                    showErrorMessage("Already in use", ele);
                }
            })
            .catch(() => {
                showErrorMessage("Validation errors", ele);
            });
    }

    if (formClassName === 'individual-form') {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        var type = ele.name;
        var searchValue = ele.value.trim();
        removeErrorMessage(ele);

        if (type === 'din_number') {
            if (!validateDIN(searchValue)) {
                showErrorMessage("Please enter a valid DIN.", ele);
                return;
            }

        } else if (type === 'income_tax_number') {
            if (!validatePAN(searchValue)) {
                showErrorMessage('Please enter valid income tax number', ele);
                return;
            }
        }

        fetch(`/individual/validate-fields?${type}=${searchValue}`, {
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'CSRF-Token': token // <-- is the csrf token as a header
                },
                method: 'GET',
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result['isAvailable']) {
                    showErrorMessage("Already in use", ele);
                }
            })
            .catch(() => {
                showErrorMessage("Validation errors", ele);
            });
    }
}