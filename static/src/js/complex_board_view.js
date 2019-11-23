 /**
     * Description：complexView
     * Date: 2019.11.07
     * Updater: wangjuan04@inspur.com
 */

odoo.define('complex.ComplexView', function (require) {
    "use strict";

    var core = require('web.core');
    var FormView = require('web.FormView');
    
    var ComplexController = require('complex.ComplexController');
    var ComplexRenderer = require('complex.ComplexRenderer');
    var _t = core._t;
    var _lt = core._lt;
   
    var ComplexView = FormView.extend({

        config: _.extend({}, FormView.prototype.config, {
            Controller: ComplexController,
            Renderer: ComplexRenderer,
        }),

        display_name: _lt('Complex'),

        init: function (viewInfo) {
            this._super.apply(this, arguments);
            this.controllerParams.customViewID = viewInfo.custom_view_id;
        }
    });

    return ComplexView;
})

odoo.define('complex.viewRegistry', function (require) {
    "use strict";

    var ComplexView = require('complex.ComplexView');
    var viewRegistry = require('web.view_registry');

    viewRegistry.add('complex', ComplexView);
});
