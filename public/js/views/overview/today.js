define([
    "underscore",
    "backbone",
    "text!templates/overview/today.html"
], function(
    _,
    Backbone,
    tpl
) {
    return Backbone.View.extend({
        _template: _.template(tpl),
        initialize: function() {
            this.listenTo(this.collection, "fetch:success", this.render);
        },
        render: function() {
            this.$el.html(this._template({
                events: _.filter(this.collection.models, function(model) {
                    return model.get("today");
                })
            }))
            return this;
        }
    });
});
