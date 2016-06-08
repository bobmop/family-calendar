define([
    "underscore",
    "backbone",
    "collections/calendars",
    "collections/events",
    "models/weather",
    "views/overview/today",
    "views/overview/next",
    "views/overview/datetime",
    "views/overview/weather",
    "text!templates/overview.html"
], function(
    _,
    Backbone,
    Calendars,
    Events,
    Weather,
    TodayView,
    NextView,
    DateTimeView,
    WeatherView,
    tpl
) {
    return Backbone.View.extend({

        className: "overview",

        _template: _.template(tpl),

        initialize: function(opts) {

            this.calendars = new Calendars();
            this.listenTo(this.calendars, "fetch:success", this.fetchEvents);

            this.events = new Events(null, {
                calendars: this.calendars
            });
            this.listenTo(this.events, "fetch:success", this.showEvents);

            this.weather = new Weather();

            this.todayView = new TodayView({
                collection: this.events
            });
            this.nextView = new NextView({
                collection: this.events
            });
            this.dateTimeView = new DateTimeView();
            this.weatherView = new WeatherView({
                model: this.weather
            });
        },

        fetchEvents: function() {
            this.events.fetch();
        },

        showEvents: function() {
            this.$(".loading").hide();
            this.$("#calendar-today").html(this.todayView.render().$el);
            this.$("#calendar-next").html(this.nextView.render().$el);
        },

        render: function() {
            this.$el.html(this._template());

            this.$("#common-datetime").html(this.dateTimeView.render().$el);
            this.$("#common-weather").html(this.weatherView.render().$el);

            // get all calendars
            this.calendars.fetch();

            // get current weather
            this.weather.fetch();

            return this;
        }
    });
});
