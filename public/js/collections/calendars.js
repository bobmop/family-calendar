define([
    "jquery",
    "backbone",
    "models/calendar"
], function(
    $,
    Backbone,
    CalendarModel
) {
    return Backbone.Collection.extend({

        model: CalendarModel,

        fetch: function() {
            return $.ajax({
                url: "/calendar"
            })
            .done(_.bind(function(result) {
                this.reset(result.items);
                this.trigger("fetch:success");
            }, this))
            .fail(_.bind(function() {
                this.trigger("fetch:error");
            }, this))
            .always(_.bind(function() {
                // recreate every 5 minutes
                setTimeout(_.bind(function() {
                    this.fetch();
                }, this), 1000 * 60 * 5);
            }, this));
        }
    });
});
