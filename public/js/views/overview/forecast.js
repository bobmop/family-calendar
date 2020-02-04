define([
    "underscore",
    "backbone",
    "moment",
    "text!templates/overview/forecast.html"
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
                entries: this.collection.models,
                moment: moment
            }));

            return this;
        }
    });
});
