define([
    "backbone",
    "text!templates/overview/weather.html",
    "text!templates/common/loading.html"
], function(
    Backbone,
    tpl,
    loadingTpl
) {
    return Backbone.View.extend({

        _template: _.template(tpl),

        initialize: function() {
            this.listenTo(this.model, "fetch:success", this.render);
        },

        render: function() {
            if (this.model.get("main")) {
                this.$el.html(this._template(this.model.toJSON()));
            } else {
                this.$el.html(_.template(loadingTpl)());
            }
            return this;
        }
    });
});
