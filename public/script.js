(function() {

    var calendars = {},
        events = {};


    function fetchCalendars() {
        return new Promise(function(fulfill, reject) {
            var request = new XMLHttpRequest();
            request.addEventListener("load", function() {
                fulfill(JSON.parse(this.responseText));
            });
            request.addEventListener("error", function() {
                reject();
            });
            request.open("GET", "/calendar");
            request.send();
        });
    }

    function fetchEvents(calendar) {
        return new Promise(function(fulfill, reject) {
            var request = new XMLHttpRequest();
            request.addEventListener("load", function() {
                fulfill(JSON.parse(this.responseText));
            });
            request.addEventListener("error", function() {
                reject();
            });
            request.open("GET", "/events/" + calendar.id);
            request.send();
        });
    }

    function computeEvents(entries) {
        if (entries.length < 1) return;
        // get today's and next events
        entries.forEach(function (entry) {
            var today = new Date(),
                d, hours, minutes, day, month, year;
            entry.parsed = {};

            if (entry.start.dateTime) {
                d = new Date(entry.start.dateTime);
            } else {
                entry.parsed.wholeDay = true;
                d = new Date(entry.start.date);
            }
            if (d.getDate() == today.getDate() &&
                d.getMonth() == today.getMonth() &&
                d.getYear() == today.getYear()) {
                    entry.today = true;
                } else {
                    entry.today = false;
                }

            hours = d.getHours(),
            minutes = d.getMinutes(),
            day = d.getDate(),
            month = d.getMonth() + 1,
            // only the last two chars
            year = ("" + d.getFullYear()).substr(2);

            // 08:05
            entry.parsed.time = entry.parsed.wholeDay ? "" :
                            (hours < 10 ? ("0" + hours) : hours) + ":" +
                            (minutes < 10 ? "0" + minutes : minutes);
            // 31.01.15
            entry.parsed.date = (day < 10 ? ("0" + day) : day) + "." +
                                (month < 10 ? ("0" + month) : month) + "." +
                                year;
            entry.parsed.timestamp = d;
            events[entry.id] = entry;
        });
    }

    function createCalendar() {
        fetchCalendars().then(
            function(result) {
                result.items.forEach(function(item) {
                    calendars[item.id] = item;
                })
                Object.keys(calendars).reduce(function(sequence, calendar_id, index) {
                    return sequence.then(function() {
                        return fetchEvents(calendars[calendar_id]);
                    }, function() {
                        // initialValue is resolved, errors could be retrieved by
                        // fetching events from server
                        console.log("error fetching events for " + calendar_id);
                    }).then(function(eventsObject) {
                        computeEvents(eventsObject.items);
                    });
                }, Promise.resolve());
            },
            function() {
                console.log("error while fetching calendars");
            }).then(function() {
                // recreate every 30 minutes
                setTimeout(createCalendar, 1000 * 60 * 30);
                console.log("calendars fetched");
            });
    }

    createCalendar();

})();
