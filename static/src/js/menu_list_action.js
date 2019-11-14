 /**
     * Description：
     * information.
     * Date: 2019.11.12
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex_board.menuList', function (require) {
    "use strict";

    var core = require('web.core');
    var AbstractAction = require('web.AbstractAction');
    var _t = core._t;

    var ComplexMenusPage = AbstractAction.extend({
        contentTemplate: 'ComplexMenus',
        init: function(parent, action){
            this._super.apply(this, arguments);
            this.name="menutest";
        },
        events: {},
    })
   
    core.action_registry.add('ComplexMenusPage', ComplexMenusPage);
})