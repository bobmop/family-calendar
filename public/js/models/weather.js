define([
    "jquery",
    "underscore",
    "backbone",
    "moment"
], function(
    $,
    _,
    Backbone,
    moment
) {
    return Backbone.Model.extend({
        url: "/weather",

        parse: function(data) {

            try {
                data.sys.sunrise = new Date(data.sys.sunrise * 1000);
                data.sys.sunset = new Date(data.sys.sunset * 1000);
                data.dt = new Date(data.dt * 1000);

                data.dayTime = moment(data.dt).isBetween(data.sys.sunrise, data.sys.sunset) ? "day" : "night";

                data.main.temp = Number.parseFloat(data.main.temp).toFixed(1);

                return data;
            } catch (e) {
                return this.attributes;
            }
        },

        fetch: function() {
            $.ajax({
                url: "/weather"
            })
            .done(_.bind(function(result) {
                this.set(this.parse(result));
                this.trigger("fetch:success");
            }, this))
            .fail(_.bind(function() {
                this.trigger("fetch:error");
            }, this))
            .always(_.bind(function() {
                // recreate every minute
                setTimeout(_.bind(function() {
                    this.fetch();
                }, this), 1000 * 60);
            }, this));
        }
    });
});
