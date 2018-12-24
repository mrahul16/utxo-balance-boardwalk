
module.exports = {
    activeUsers: function (group) {
        return `https://cors-anywhere.herokuapp.com/http://pa.boardwalktech.com/${group}/rest/v1/user`;
    },
    grid: function (group) {
        return `https://cors-anywhere.herokuapp.com/http://pa.boardwalktech.com/${group}/` +
            `rest/v1/grid/2000001?importTid=-1&mode=1&baselineId=-1&view=LATEST`;
    }
};