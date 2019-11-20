 /**
     * Description：fullscreen
     * information.
     * Date: 2019.11.12
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex_board.fullScreen', function (require) {
    "use strict";

    var core = require('web.core');
    var AbstractAction = require('web.AbstractAction');
    var _t = core._t;

    var fullScreenPage = AbstractAction.extend({
        contentTemplate: 'FullScreen',
        init: function(parent, action){
            this._super.apply(this, arguments);
            this.name="fulltest";
        },

        events: {},
    })
   
    core.action_registry.add('fullScreenPage', fullScreenPage);
})