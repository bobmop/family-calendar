define([
    "backbone"
], function(
    Backbone
) {
    return Backbone.Model.extend({
        parse: function(data) {
            var today = new Date(),
                d, hours, minutes, day, month, year;

            if (data.start.dateTime) {
                d = new Date(data.start.dateTime);
            } else {
                data.wholeDay = true;
                d = new Date(data.start.date);
            }
            if (d.getDate() == today.getDate() &&
                d.getMonth() == today.getMonth() &&
                d.getYear() == today.getYear()) {
                    data.today = true;
                } else {
                    data.today = false;
                }

            hours = d.getHours(),
            minutes = d.getMinutes(),
            day = d.getDate(),
            month = d.getMonth(),
            // only the last two chars
            year = d.getFullYear();

            // 08:05
            data.time = data.wholeDay ? "" :
                            (hours < 10 ? ("0" + hours) : hours) + ":" +
                            (minutes < 10 ? "0" + minutes : minutes);
            data.day = day < 10 ? ("0" + day) : day;
            data.month = month < 10 ? ("0" + month) : month;
            data.year = year;
            data.timestamp = d.getTime();
            return data;
        }
    });
});
