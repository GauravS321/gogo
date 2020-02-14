const APICall = require('../../../../helpers/request');

module.exports = (primechain_address, ask_asset_name, ask_asset_quantity, offer_asset_name, offer_asset_quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('create_public_offer', 
                {
                    "primechain_address": primechain_address,
                    "ask_asset": {
                        [ask_asset_name]: parseInt(ask_asset_quantity)
                    },
                    "offer_asset": {
                        [offer_asset_name]: parseInt(offer_asset_quantity)
                }
            });

            return resolve({
                status: 200,
                msg: response.response
            });

        } catch (error) {
            return reject({
                status: 500,
                message: "Blockchain has reported an error"
            });
        }
    });
}