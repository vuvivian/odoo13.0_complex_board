odoo.define('complex.ComplexControlPanelRenderer', function (require) {
    "use strict";

    var ControlPanelRenderer = require('web.ControlPanelRenderer');
    var ActionManager = require('web.ActionManager');
    var Context = require('web.Context');
    var Domain = require('web.Domain');
    var pyUtils = require('web.py_utils');
    var core = require('web.core');

    var _t = core._t;

    var ComplexControlPanelRenderer = ControlPanelRenderer.include({
        template: 'ControlPanel',
        events: {
            'click .oe_complex_minimize': '_onComplexMinmize',
            'click .oe_complex_maximize': '_onComplexMaxmize',
            'click .oe_complex_close': '_onComplexClose',
        },

        getBoard: function () {
            var self = this;
            console.log(self);
            var board = {
                form_title : self._title,
                style : this.$('.oe_complexboard').attr('data-layout'),
                columns : [],
            };
            this.$('.oe_complexboard_column').each(function () {
                var actions = [];
                $(this).find('.oe_action').each(function () {
                    var actionID = $(this).attr('data-id');
                    var newAttrs = _.clone(self.actionsDescr[actionID]);

                    /* prepare attributes as they should be saved */
                    if (newAttrs.modifiers) {
                        newAttrs.modifiers = JSON.stringify(newAttrs.modifiers);
                    }
                    actions.push(newAttrs);
                });
                board.columns.push(actions);
            });
            return board;
        },

        _addToBoard: function () {
            var self = this;
            var searchQuery;

            this.trigger_up('get_search_query', {
                callback: function (query) {
                    console.log('query', query);
                    searchQuery = query;
                }
            });

            // 查找最近的祖先匹配谓词
            var actionManager = this.findAncestor(function (ancestor) {
                return ancestor instanceof ActionManager;
            });

            var controller = actionManager.getCurrentController();

            var context = new Context(this.action.context);
            context.add(searchQuery.context);
            context.add({
                group_by: searchQuery.groupBy,
                orderedBy: searchQuery.orderedBy,
            });

            this.trigger_up('get_controller_query_params', {
                callback: function (controllerQueryParams) {
                    var queryContext = controllerQueryParams.context;
                    var allContext = _.extend(
                        _.omit(controllerQueryParams, ['context']),
                        queryContext
                    );
                    context.add(allContext);
                }
            });

            var domain = new Domain(this.action.domain || []);
            domain = Domain.prototype.normalizeArray(domain.toArray().concat(searchQuery.domain));

            var evalutatedContext = pyUtils.eval('context', context);
            for (var key in evalutatedContext) {
                if (evalutatedContext.hasOwnProperty(key) && /^search_default_/.test(key)) {
                    delete evalutatedContext[key];
                }
            }
            evalutatedContext.dashboard_merge_domains_contexts = false;

            return self._rpc({
                route: '/complex/add_to_complexboard',
                params: {
                    action_id: self.action.id || false,
                    context_to_save: evalutatedContext,
                    domain: domain,
                    view_mode: controller.viewType,
                    name: self._title,
                    code: 0,
                },
            });
            
        },

        // 缩放视图
        _onComplexMaxmize: function(){
            var self = this;
            this._addToBoard();
            this.trigger_up('save_dashboard');
            // 跳转到首页
            self._rpc({
                model: 'ir.ui.menu',
                method: 'load_homepage',
                args: [self.action.id],
            }).then(function (result) {
                if (result) {
                    self.trigger_up('menu_clicked', {
                        id: result[0],
                        action_id: result[1],
                    });   
                }
            });
            this.trigger_up('reload');
        },

        // 最小化视图
        _onComplexMinmize: function (event) {
            var self = this;
            this._addToBoard();
            this.trigger_up('save_dashboard');
            self._rpc({
                model: 'ir.ui.menu',
                method: 'load_homepage',
                args: [self.action.id],
            }).then(function (result) {
                if (result) {
                    self.trigger_up('menu_clicked', {
                        id: result[0],
                        action_id: result[1],
                    });   
                }
            });
        },

        // 关闭视图
        _onComplexClose: function(){
            var self = this;
            return self._rpc({
                model: 'ir.ui.menu',
                method: 'load_homepage',
                args: [self.action.id],
            }).then(function (result) {
                if (result) {
                    self.trigger_up('menu_clicked', {
                        id: result[0],
                        action_id: result[1],
                    });   
                }
            });
        },

    });

    return ComplexControlPanelRenderer;
});
