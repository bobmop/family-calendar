define([
    "underscore",
    "backbone",
    "moment",
    "text!templates/overview/weather.html",
    "text!templates/common/loading.html"
], function(
    _,
    Backbone,
    moment,
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
                this.$el.html(this._template(_.extend(this.model.toJSON(), {
                    dayTime: moment().isBetween(this.model.get("sunrise"), this.model.get("sunset")) ? "day" : "night",
                    moment: moment
                })));
            } else {
                this.$el.html(_.template(loadingTpl)());
            }
            return this;
        }
    });
});
