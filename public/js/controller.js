define([
    "jquery",
    "backbone",
    "moment",
    "views/overview"
], function(
    $,
    Backbone,
    moment,
    OverView
) {
    var overView = new OverView();

    function isNight() {
        var now = moment().hour();
        $("body").toggleClass("night", now >= 22 || now < 6);
        setTimeout(isNight, 1000 * 60);
    }

    isNight();

    setInterval(function() {
        $.ajax({
            url: '/online',
            dataType: "json"
        }).done(function(data)  {
            $("#wifi").toggleClass("ok", data.online);
        });
    }, 10000);

    return {
        overview: function() {
            $("#main").html(overView.render().$el);
        }
    };
});
