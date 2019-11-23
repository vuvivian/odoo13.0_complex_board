 /**
     * Description：complexController
     * Date: 2019.11.22
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex.ComplexController', function (require) {
    "use strict";
    var FormController = require('web.FormController');
    var dataManager = require('web.data_manager');

    var ComplexController = FormController.extend({

        custom_events: _.extend({}, FormController.prototype.custom_events, {
            save_dashboard: '_saveDashboard',
            switch_view: '_onSwitchView',
            enable_cmplexboard: '_onEnableComplexboard',
        }),

        init: function (parent, model, renderer,params) {
            this._super.apply(this, arguments);
            this.customViewID = params.customViewID;
        },
    
        getTitle: function () {
            if (this.inDashboard) {
                return _t("My Complexboard");
            }
            return this._super.apply(this, arguments);
        },
    
        _onEnableComplexboard: function () {
            this.inComplexboard = true;
        },
    
        _onSwitchView: function (event) {
            event.stopPropagation();
            this.do_action({
                type: 'ir.actions.act_window',
                res_model: event.data.model,
                views: [[event.data.formViewID || false, 'form']],
                res_id: event.data.res_id,
            });
        },
    
        _saveDashboard: function () {
            var board = this.renderer.getBoard();
            var arch = QWeb.render('Complex.xml', _.extend({}, board));
            return this._rpc({
                route: '/web/view/edit_custom',
                params: {
                    custom_id: this.customViewID,
                    arch: arch,
                }
            }).then(dataManager.invalidate.bind(dataManager));
        },
    })

    return ComplexController;
})
