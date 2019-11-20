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
            this.isOpen = true;
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
            'click .oe_second_menu_item': "_onMenuClik",
            'click .oe_first_menu_item_toggle': "_onIconClick",
            'click .oe_fourth_menu_item_icon': "_onCollectClick"
        },
        // 二级菜单点击事件
        _onMenuClik: function(ev){
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
        },
        _onIconClick: function(){
            var self = this;
            if(self.isOpen){
                $(".oe_first_menu_item_open").replaceWith('<img src="/odoo_complex_board/static/src/img/jiantou-down.png" alt="箭头" class="oe_first_menu_item_close collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"/>');
            } else {
                $(".oe_first_menu_item_close").replaceWith('<img src="/odoo_complex_board/static/src/img/jiantou.png" alt="箭头" class="oe_first_menu_item_open collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"/>');
            }
            self.isOpen = !self.isOpen;
        },
        _onCollectClick: function(ev){
            const collectStatus = ev.currentTarget.attributes['status'].nodeValue;
            const collectId = ev.currentTarget.attributes['id'].nodeValue;
            if(collectStatus === "true"){
                ev.currentTarget.attributes['status'].nodeValue = "false"
                $("."+ "oe_fourth_menu_item_icon"+collectId).html('<img src="/odoo_complex_board/static/src/img/cancleStar.png"  alt="取消收藏"/>')
            } else {
                ev.currentTarget.attributes['status'].nodeValue = "true"
                $("."+ "oe_fourth_menu_item_icon"+collectId).html(' <img src="/odoo_complex_board/static/src/img/star.png"  alt="收藏" />')
            }
        }
    })
    core.action_registry.add('ComplexMenusPage', ComplexMenusPage);
    return ComplexMenusPage
})