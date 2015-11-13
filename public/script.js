(function() {

    var calendars = {},
        events = [];


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

    function computeEvents(events) {
        //
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
