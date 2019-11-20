 /**
     * Description：menu actions
     * information.
     * Date: 2019.11.12
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex_board.menuList', function (require) {
    "use strict";

    var core = require('web.core');
    var config = require('web.config');
    var session = require('web.session');
    var AbstractAction = require('web.AbstractAction');
    var _t = core._t;
    var QWeb = core.qweb;

    var ComplexMenusPage = AbstractAction.extend({
        contentTemplate: 'ComplexMenus',
        init: function(parent, action){
            this._super.apply(this, arguments);
            this.name = "功能导航";
            this.menuList = [];
            this.thirdMenu = [];
        },
        // start: function () {
        //     this._super.apply(this, arguments);
        //     this._rpc({
        //         model: 'ir.ui.menu',
        //         method: 'load_upper_menus',
        //         args: [config.debug],
        //         context: session.user_context,
        //     }).then(function(result) {
        //         console.log('result', result);
        //         this.menuList = result.children;
        //     });
        // },
        willStart: function(){
            var self = this;
            return this._super.apply(this,arguments).then(function(){
                return self.load();
            })
        },
        load: function () {
            var self = this;
            return this._rpc({
                model: 'ir.ui.menu',
                method: 'load_upper_menus',
                args: [config.debug],
                context: session.user_context,
            }).then(function(result) {
                self.menuList= result.children;
            });
        },
        events: {
            'click .oe_second_menu_item': "_onMenuclik",
        },

        _onMenuclik: function(ev){
            const itemId = ev.currentTarget.attributes['itemId'].nodeValue;
            console.log(this.$el);
            // $(".oe_menu_detail").append($el);
            // this.$el.addClass('active');
            //  this.$buttons = $(QWeb.render("ImportView.buttons", this));
            return this._rpc({
                model: 'ir.ui.menu',
                method: 'load_module_menus',
                args: [itemId,config.debug],
                context: session.user_context,
            }).then(function(result) {
                console.log('result', result);
                self.menuDetail= result.children;
                var $el = QWeb.render('Complex.menuDetails', {
                    widget: this,
                    thirdMenu: result.children,
                });
                $(".oe_menu_detail_row").replaceWith($el);
            });
           
        },
        renderElement: function(ev){
            this._super.apply(this,arguments);
            console.log('renderElement')
        }
    })
   
    core.action_registry.add('ComplexMenusPage', ComplexMenusPage);
    return ComplexMenusPage
})