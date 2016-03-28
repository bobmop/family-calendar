define([
    "jquery",
    "underscore",
    "backbone"
], function(
    $,
    _,
    Backbone
) {
    return Backbone.Model.extend({
        url: "/weather",

        parse: function(data) {

            data.sys.sunrise = new Date(data.sys.sunrise * 1000);
            data.sys.sunset = new Date(data.sys.sunset * 1000);

            return data;
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
                // recreate every 30 minutes
                setTimeout(_.bind(function() {
                    this.fetch();
                }, this), 1000 * 60);
            }, this));
        }
    });
});
