define([
    "underscore",
    "backbone",
    "text!templates/overview/datetime.html"
], function(
    _,
    Backbone,
    tpl
) {
    return Backbone.View.extend({

        _template: _.template(tpl),

        _update: function() {
            var now = new Date(),
                hours = now.getHours(),
                minutes = now.getMinutes(),
                day = now.getDate(),
                month = now.getMonth() + 1,
                year = now.getFullYear();

            var formatedTime = (hours < 10 ? ("0" + hours) : hours) + ":" +
                                (minutes < 10 ? "0" + minutes : minutes);
            this.$(".time").text(formatedTime);

            var formatedDate = (day < 10 ? ("0" + day) : day) + "." +
                                (month < 10 ? ("0" + month) : month) + "." +
                                year;
            this.$(".date").text(formatedDate);

            setTimeout(_.bind(function() {
                this._update();
            }, this), 1000);            
        },

        render: function() {
            this.$el.html(this._template());
            this._update();
            return this;
        }
    });
});
