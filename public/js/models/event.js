define([
    "backbone",
	"moment"
], function(
    Backbone,
	moment
) {
    return Backbone.Model.extend({
        parse: function(data) {

            if (data.start.dateTime) {
                data.start = data.start.dateTime;
            } else {
                data.wholeDay = true;
                data.start = data.start.date;
            }

			if (data.end.dateTime) {
				data.end = data.end.dateTime;
			} else {
				data.end = data.end.date;
			}

			if (moment().isBetween(data.start, data.end)) {
                data.today = true;
            } else {
                data.today = false;
            }

			data.timestamp = moment(data.start).format("x");

            return data;
        }
    });
});
