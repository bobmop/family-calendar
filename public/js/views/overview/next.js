define([
    "underscore",
    "backbone",
	"moment",
    "text!templates/overview/next.html"
], function(
    _,
    Backbone,
	moment,
    tpl
) {
    return Backbone.View.extend({
        _template: _.template(tpl),
        initialize: function() {
            this.listenTo(this.collection, "fetch:success", this.render);
        },
        render: function() {
            this.$el.html(this._template({
                _: _,
                events: _.filter(this.collection.models, function(model) {
                    return !model.get("today");
                }).slice(0, 8), // just the first 5 events
				moment: moment
            }))
            return this;
        }
    });
});
