define([
    "underscore",
    "backbone",
    "collections/calendars",
    "models/event"
], function(
    _,
    Backbone,
    Calendars,
    EventModel
) {
    return Backbone.Collection.extend({

        model: EventModel,

        // order the collection always by timestamp
        comparator: function(model) {
            return model.get("timestamp");
        },

        initialize: function(models, opts) {
            if (!_.result(opts, "calendars")) {
                throw new Error("calendar collection missing");
            }
            this.calendars = opts.calendars;
        },

        fetch: function() {
            var fetchDef = $.Deferred(),
                // counter to resolve the promise after fetching all calenders
                // also if individual error occured
                calendarsDone = 0;

            // just to trigger fetch events
            fetchDef.done(_.bind(function() {
                    this.trigger("fetch:success");
                }, this))
                .fail(_.bind(function() {
                    this.trigger("fetch:error");
                }, this));

            // fetch events for every calendar
            _.reduce(this.calendars.models, function(sequence, calendar, index) {
                return sequence.then(_.bind(function() {
                    return $.ajax({
                        url: "/events/" + calendar.id
                    })
                    .done(_.bind(function(events) {
                        this.add(events.items, {parse: true});
                    }, this))
                    .always(_.bind(function() {
                        calendarsDone++;
                        if (calendarsDone === this.calendars.length) {
                            fetchDef.resolve();
                        }
                    }, this));
                }, this), _.bind(function() {
                    // initialValue is resolved, errors could be retrieved by
                    // fetching events from server
                    console.log("error fetching events for " + calendar.id);
                    this.trigger("fetch:error", calendar.id);
                }));
            }, Promise.resolve(), this);

            return fetchDef.promise();
        }
    });
});
