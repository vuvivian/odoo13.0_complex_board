 /**
     * Description：complexController
     * Date: 2019.11.22
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex.ComplexController', function (require) {
    "use strict";

    var core = require('web.core');
    var FormController = require('web.FormController');
    var dataManager = require('web.data_manager');
    var QWeb = core.qweb;
    var viewStore = {
        stay_view: []
    };
       
    var ComplexController = FormController.extend({

        custom_events: _.extend({}, FormController.prototype.custom_events, {
            save_dashboard: '_saveDashboard',
            switch_view: '_onSwitchView',
            enable_cmplexboard: '_onEnableComplexboard',
            add_complex_view: '_onAddComplexView',
            remove_complex_view: '_onRemoveComplexView'
        }),

        init: function (parent, model, renderer,params) {
            this._super.apply(this, arguments);
            this.customViewID = params.customViewID;
        },
        
        start: function () {
            return this._super.apply(this, arguments);
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
            }).then(
                dataManager.invalidate.bind(dataManager),
            );
        },

        // info： add view into bottom bar  auth: wangjuan  date:2019/11/23
        _onAddComplexView: function (event) {
            const obj = {} ;
            viewStore.stay_view.push(event.data.viewInfo);
            viewStore.stay_view = viewStore.stay_view.reduce(function(item, next) {
                obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                return item;
            }, []);
            var $el = QWeb.render('ComplexBoard.BottomBar', {
                    allView: viewStore
                });
            $(".o_complex_bar").replaceWith($el);
        },

        // info： remove view into bottom bar  auth: wangjuan  date:2019/11/23
        _onRemoveComplexView: function (event) {
            viewStore.stay_view = viewStore.stay_view.filter((obj)=>{
                return obj.id !== event.data.viewInfo.id
            })
            var $el = QWeb.render('ComplexBoard.BottomBar', {
                allView: viewStore
            });
            $(".o_complex_bar").replaceWith($el);
        }
    })

    return ComplexController;
})
