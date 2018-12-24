const $ = require("jquery");

const utils = require("./utils");
const globals = require("./globals");
const urls = require("./urls");

class UTXO {
    constructor(ownerName, amount, txId, active) {
        this.ownerName = ownerName;
        this.amount = amount;
        this.txId = txId;
        this.active = active;
    }
}

class User {

    constructor(id, name, email, group, neighbourhood) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.group = group;
        this.neighbourhood = neighbourhood;
    }

    retrieveUTXOs() {
        return new Promise(function (resolve, reject) {
            $.when(utils.sendRequest("GET", urls.grid(globals.user.group),
                {}, globals.authToken))
                .done(function (response) {
                    if(!utils.checkErrorResponse(response)) {
                        let columnCellArrays = response["columnCellArrays"];
                        let ownerNameIndex = utils.findColCellArraysIndex(response, "OWNER_NAME"),
                            txIdIndex = utils.findColCellArraysIndex(response, "TX_ID"),
                            amountIndex = utils.findColCellArraysIndex(response, "AMOUNT"),
                            activeIndex = utils.findColCellArraysIndex(response, "ACTIVE");
                        let utxos = [];
                        for(let i = 0; i < columnCellArrays[0]["cellValues"].length; i++) {
                            let ownerName = columnCellArrays[ownerNameIndex]["cellValues"][i];
                            let txId = columnCellArrays[txIdIndex]["cellValues"][i];
                            let amount = Number(columnCellArrays[amountIndex]["cellValues"][i]);
                            let active = columnCellArrays[activeIndex]["cellValues"][i].toUpperCase();
                            if(!isNaN(amount)) {
                                utxos.push(new UTXO(ownerName, amount, txId, active));
                            }
                        }
                        resolve(utxos);
                    }
                    else {
                        reject(new Error(response[0]["error"]));
                    }
                });

        });
    }
}

module.exports = {
    User,
    UTXO
};