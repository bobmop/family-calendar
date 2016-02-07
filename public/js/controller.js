define([
    "jquery",
    "backbone",
    "views/overview"
], function(
    $,
    Backbone,
    OverView
) {
    var overView = new OverView();
    return {
        overview: function() {
            $("#main").html(overView.render().$el);
        }
    };
});
