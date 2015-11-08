(function() {

    var calendars = {};


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

    fetchCalendars().then(
        function(result) {
            result.items.forEach(function(item) {
                calendars[item.id] = item;
            })
        },
        function() {
            console.log("error while fetching calendars");
        }).then(function() {
            console.log("calendars fetched");
        });

})();
