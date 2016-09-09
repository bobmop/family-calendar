define([
    "backbone",
    "moment"
], function(
    Backbone,
    moment
) {
    return Backbone.Model.extend({
        parse: function(data) {

            var now = moment();

            if (data.start.dateTime) {
                data.start = data.start.dateTime;
            } else {
                data.start = data.start.date;
                // no start time -> whole day event
                data.wholeDay = true;
            }

            if (data.end.dateTime) {
                data.end = data.end.dateTime;
            } else {
                data.end = data.end.date;
            }

            if (now.isAfter(data.start, "day") && now.isBefore(data.end, "day")) {
                data.wholeDay = true;
            }

            if (now.isSame(data.start, "day") || now.isBetween(data.start, data.end)) {
                data.today = true;
            } else {
                data.today = false;
            }

            data.timestamp = moment(data.start).format("x");

            return data;
        }
    });
});
