define([
    "underscore",
    "backbone",
    "moment",
    "text!templates/overview/datetime.html"
], function(
    _,
    Backbone,
    moment,
    tpl
) {
    return Backbone.View.extend({

        _template: _.template(tpl),

        render: function() {
            this.$el.html(this._template({
                moment: moment
            }));
            setTimeout(_.bind(function() {
                this.render();
            }, this), 1000);
            return this;
        }
    });
});
