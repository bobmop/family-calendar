define([
    "underscore",
    "backbone",
    "collections/calendars",
    "collections/events",
    "views/overview/today",
    "views/overview/next",
    "views/overview/datetime",
    "text!templates/overview.html"
], function(
    _,
    Backbone,
    Calendars,
    Events,
    TodayView,
    NextView,
    DateTimeView,
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

            this.todayView = new TodayView({
                collection: this.events
            });
            this.nextView = new NextView({
                collection: this.events
            });
            this.dateTimeView = new DateTimeView();
        },

        fetchEvents: function() {
            this.events.fetch()
                .done(_.bind(function() {
                    console.log("events", this.events.models);
                }, this));
        },

        showEvents: function() {
            this.$(".loading").hide();
            this.$("#calendar-today").html(this.todayView.render().$el);
            this.$("#calendar-next").html(this.nextView.render().$el);
        },

        render: function() {
            this.$el.html(this._template());

            this.$("#common-datetime").html(this.dateTimeView.render().$el);

            // get all calendars
            this.calendars.fetch();

            return this;
        }
    });
});
