(function() {

    var calendars = {},
        events = {},
        templates = {
            todayEntries: '<label>Heute</label>' +
                            '<table>' +
                            '<% for(var e in this.entries){ %>' +
                                '<tr>' +
                                    '<td class="time"><% this.entries[e].parsed.time %></td>' +
                                    '<td><% this.entries[e].summary %></td>' +
                                '</tr>' +
                            '<% } %>' +
                            '</table>',
            nextEntries: '<label>Demn&auml;chst</label>' +
                            '<table>' +
                            '<% for(var e in this.entries){ %>' +
                                '<tr>' +
                                    '<td class="date"><% this.entries[e].parsed.date %></td>' +
                                    '<td class="time"><% this.entries[e].parsed.time %></td>' +
                                    '<td><% this.entries[e].summary %></td>' +
                                '</tr>' +
                            '<% } %>' +
                            '</table>'
        };

    function template(html, options) {
        var re = /<%([^%>]+)?%>/g,
            reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code = 'var r=[];\n',
            cursor = 0,
            match;
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while(match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }

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

    function showEvents() {
        var $todayEl = document.querySelector("#calendar-today"),
            $nextEl = document.querySelector("#calendar-next"),
            entries = {today: [], next: []};
        // sort entries
        var sorted = Object.keys(events).map(function(key) {
            return events[key];
        }).sort(function(a, b) {
            return a.parsed.timestamp > b.parsed.timestamp ? 1 : -1;
        });
        sorted.forEach(function(entry) {
            if (entry.today) {
                entries.today.push(entry);
            } else {
                entries.next.push(entry);
            }
        });
        $todayEl.innerHTML = template(templates.todayEntries, {
            entries: entries.today
        });
        $nextEl.innerHTML = template(templates.nextEntries, {
            entries: entries.next
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
                        //
                        if (index == result.items.length - 1) {
                            console.log("all events fetched", events);
                            showEvents();
                        }
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
