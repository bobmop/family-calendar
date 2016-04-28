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

	setInterval(function() {
		$.ajax({
			url: '/online',
			dataType: "json"
		}).done(function(data)  {
			$("#wifi").toggleClass("ok", data.online);
		});
	}, 5000);

    return {
        overview: function() {
            $("#main").html(overView.render().$el);
        }
    };
});
