odoo.define('complex.WebClient', function (require) {
    "use strict";

    var WebClient = require('web.WebClient');
    var Footer = require('web.Footer_01');
    WebClient.include({
        /**
        * Overrides instanciate_menu_widgets
        *
        * @override
        */
        instanciate_menu_widgets: function () {
            var self = this;
            self.footer = new Footer(self);
            self.footer.appendTo(self.$el)
            return this._super.apply(this, arguments);
        },
    });
})