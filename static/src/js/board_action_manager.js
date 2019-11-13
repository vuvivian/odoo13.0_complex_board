 /**
     * Description：fullscreen
     * information.
     * Date: 2019.11.12
     * Updater: wangjuan04@inspur.com
 */

odoo.define('complex.ActionManager', function (require) {
"use strict";

var ActionManager = require('web.ActionManager');

ActionManager.include({
    _executeWindowAction: function (action) {
        if (action.res_model === 'complex.view' && action.view_mode === 'form') {
            action.target = 'inline';
            _.extend(action.flags, {
                hasSearchView: false,
                hasSidebar: false,
                headless: true,
            });
        }
        return this._super.apply(this, arguments);
    },
});
});