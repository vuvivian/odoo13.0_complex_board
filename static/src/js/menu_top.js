odoo.define('complex.menuTop', function (require) {
    "use strict";
    var SwitchCompanyMenu = require('web.SwitchCompanyMenu');
    var SystrayMenu = require('web.SystrayMenu');
    var Menu = require('web.Menu');
    Menu.include({
        init: function () {
            SystrayMenu.Items.forEach(function (item,index) {
                if(item.prototype.template=="SwitchCompanyMenu"){
                    SystrayMenu.Items.splice(index,1);
                }
            });
            this._super.apply(this, arguments);
        },
        start: function () {
            this.SwitchCompanyMenu = new SwitchCompanyMenu(this);
            var companyProm = this.SwitchCompanyMenu.appendTo(this.$('.o_menu_company'))
            return Promise.all([this._super.apply(this, arguments), companyProm]);
        },
    });
});