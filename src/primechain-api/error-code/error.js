var errorcode = {
    13030: "Provided API key is not valid",
    13031: "Please provide API key",
    13032: "Please provide application/json as a Content-Type",
    13033: "Provided OTP is not valid"
}

var success_code = {
    14040: "A new API key has been successfully generated",
    14050: "The supplied API key has been successfully deleted",
    14060: "New signer has been successfully created",
    14070: "The electronic signature has been successfully generated",
    14080: "The electronic signature has been successfully generated and uploaded to GREAT",
    14090: "The hash has been uploaded to the proof-of-existence repository",
    14100: "The electronic signature is valid",
    14110: "The electronic signature is invalid",
    14120: "Successfully obtained data from GREAT",
    14130: "Successfully obtained data from proof-of-existence repository",
    14140: "OTP has been successfully generated ",
    14150: "A new organization has been registered with ESE and the details have been emailed",
    14160: "Successfully generated hash for given input"
}

module.exports = {
    errorcode: errorcode,
    success_code: success_code
}
