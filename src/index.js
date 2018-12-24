const $ = require("jquery");

const utils = require("./utils");
const urls = require("./urls");
const globals = require("./globals");
const { User } = require("./models");

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, { coverTrigger: false });
});

function initIndex() {
    $("#profile-name").text(globals.user.name);
    $("#profile-email").text(globals.user.email);

    globals.user.retrieveUTXOs()
        .then(function (utxos) {
            let activeSum = 0;
            let inactiveSum = 0;
            let numActive = 0;
            let numInactive = 0;

            $("#utxo-table-body").append(utxos.map(function(utxo) {
                if (utxo.active === "YES") {
                    activeSum += utxo.amount;
                    numActive++;
                }
                else {
                    inactiveSum += utxo.amount;
                    numInactive++;
                }
                return $("<tr>").append([
                    $("<td>").text(utxo.txId),
                    $("<td>").text(utxo.amount),
                    $("<td>").text(utxo.active).addClass(utxo.active === "YES" ? "txactive" : "txinactive"),
                ])
            }));

            $("#balance-amt").text(activeSum.toString() + " BTC");
            $("#utxo-description").text(
                `You have ${numActive} active UTXO${numActive === 1 ? '' : 's'} (${activeSum} BTC)` +
                ` and ${numInactive} inactive UTXO${numInactive === 1 ? '' : 's'} (${inactiveSum} BTC).`);
        },
        function (error) {
            console.log(error);
        });
}

function uninitIndex() {
    $("#profile-name").text("");
    $("#profile-email").text("");
    $("#utxo-table-body").html("");
    $("#balance-amt").text("");
    $("#utxo-description").text("");
}

function showIndex() {
    $("#login-container").addClass("hide");
    $(".navbar-fixed").removeClass("hide");
    $("main.card").removeClass("hide");
    initIndex();
}

function hideIndex() {
    $("#login-container").removeClass("hide");
    $(".navbar-fixed").addClass("hide");
    $("main.card").addClass("hide");
    uninitIndex();
}

function getUser(users, email) {
    for(const user of users) {
        if (user.email === email) {
            return user;
        }
    }
}

function attemptLogin(email, password, group, neighbourhood) {
    let authToken = utils.b64Encode(email, password, neighbourhood);
    $.when(utils.sendRequest("GET", urls.activeUsers(group),
        {active: true}, authToken))
        .done(function (response) {
            if(!utils.checkErrorResponse(response)) {
                // Success
                const matchedUser = getUser(response, email);
                // noinspection JSUnresolvedVariable
                globals.user = new User(
                    matchedUser.id,
                    matchedUser.firstName + " " + matchedUser.lastName,
                    email, group, neighbourhood);
                globals.authToken = authToken;
                showIndex();
            }
        });
}

$("#login-submit").click(function () {
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    let group = $("#group").val().trim();
    let neighbourhood = $("#neighbourhood").val().trim();
    if (email === "admin") {
        console.log("admin");
    }
    attemptLogin(email, password, group, neighbourhood);
});

$(".logout").click(function () {
    globals.user = null;
    globals.authToken = null;
    hideIndex();
});
