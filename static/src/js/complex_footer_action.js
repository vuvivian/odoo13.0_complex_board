odoo.define('web.Footer_01', function (require) {
    "use strict";
    
    var core = require('web.core');
    var Widget = require('web.Widget');
    var QWeb = core.qweb;
    
    var Footer = Widget.extend({
        template: 'ComplexBoard.FooterBar',
        // events: {
        //     'click .o_complex_bar_icon.o_complex_bar_setting': '_onBarSettingClick', 
        //     'click .o_complex_bar_icon.o_complex_bar_menu': '_onBarMenuClick',
        // },

        // //info: click bottom bar setting  auth:wangjuan date:2019/11/18
        // _onBarSettingClick: function () {
        //     this.trigger_up('change_layout');
        // },

        // //info: click bottom bar menu  auth:wangjuan date:2019/11/18
        // _onBarMenuClick: function (event) {
        //     // this.trigger_up('choose_menu');
        //     this.do_action({
        //         type: 'ir.actions.client',
        //         tag: 'ComplexMenusPage',
        //         target: 'current'
        //     })
        // },
    });
    return Footer;
});
    