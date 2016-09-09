require.config({
    paths: {
        "jquery": "../lib/jquery/dist/jquery",
        "underscore": "../lib/underscore/underscore",
        "backbone": "../lib/backbone/backbone",
        "text": "../lib/text/text",
        "moment": "../lib/moment/moment"
    }
});

require([
    "backbone",
    "router"
], function(
    Backbone,
    Router
) {

    $(document).ready(function() {
        Backbone.history.start();
        var router = new Router();
    });
});
