const $ = require("jquery");

module.exports = {

    sendRequest: function (method, url, data, authToken, contentType = 'application/json', useAuthToken = true) {
        if (useAuthToken) {
            if (!authToken) {
                return null;
            }
        }

        return $.ajax({
            method: method,
            url: url,
            data: method === "POST" ? JSON.stringify(data) : data,
            contentType: contentType,
            headers: useAuthToken ? {'Authorization': authToken} : {},
        });
    },

    b64Encode: function (email, password, neighbourhood) {
        return btoa(`${email}:${password}:${neighbourhood}`);
    },

    checkErrorResponse: function (response) {
        return !!(Array.isArray(response) &&
            response.length > 0 &&
            response[0].hasOwnProperty('error'));

    },

    findColCellArraysIndex: function (response, colName) {
        for (const col of response["columns"]) {
            if (col["name"] === colName) {
                for (let i = 0; i < response["columnCellArrays"].length; i++) {
                    let colCellArray = response["columnCellArrays"][i];
                    if (colCellArray["columnId"] === col["id"]) {
                        return i;
                    }
                }
            }
        }
    }
};