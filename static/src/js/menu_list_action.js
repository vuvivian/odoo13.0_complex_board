 /**
     * Description：功能菜单Action
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
            this.menuList = [];  // 一二级菜单数据
            this.thirdMenu = []; // 三四级菜单数据
        },
        willStart: function(){
            var self = this;
            return this._super.apply(this,arguments).then(function(){
                return self.load();
            })
        },
        // 初始化菜单数据
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
        // 二级菜单点击事件
        _onMenuclik: function(ev){
            const itemId = ev.currentTarget.attributes['itemId'].nodeValue;
            return this._rpc({
                model: 'ir.ui.menu',
                method: 'load_module_menus',
                args: [itemId,config.debug],
                context: session.user_context,
            }).then(function(result) {
                self.menuDetail= result.children;
                var $el = QWeb.render('Complex.menuDetails', {
                    widget: this,
                    thirdMenu: result.children,
                });
                $(".oe_menu_detail_row").replaceWith($el);
            });
        }
    })
    core.action_registry.add('ComplexMenusPage', ComplexMenusPage);
    return ComplexMenusPage
})