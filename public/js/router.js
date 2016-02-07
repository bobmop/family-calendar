define([
    "backbone",
    "controller"
], function(
    Backbone,
    controller
) {
    return Backbone.Router.extend({

        routes: {
            "overview": "overview"
        },

        initialize: function() {
            // reset to trigger execute always a route
            this.navigate();
            this.navigate("#overview", true);
        },

        overview: function() {
            controller.overview();
        }

    });
})
