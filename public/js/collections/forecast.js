define([
    "jquery",
    "backbone",
    "models/weather"
], function(
    $,
    Backbone,
    WeatherModel
) {
    return Backbone.Collection.extend({
        model: WeatherModel,

        parse: function(data) {
            var entries = data.list.slice(0,5)

            entries.forEach(function(entry) {
                entry.sys = {};
            })

            return entries;
        },

        fetch: function() {
            $.ajax({
                url: "/forecast"
            })
            .done(_.bind(function(result) {
                this.reset(result, { parse: true });
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