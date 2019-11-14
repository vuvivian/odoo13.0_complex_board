 /**
     * Description： add view to complexView
     * information.
     * Date: 2019.11.08
     * Updater: wangjuan04@inspur.com
 */

odoo.define('complex.AddToComplexMenu', function(require, factory) {
    'use strict';

    var ActionManager = require('web.ActionManager');
    var favorites_submenus_registry = require('web.favorites_submenus_registry');
    var Widget = require('web.Widget');
    var core = require('web.core');
    var Context = require('web.Context');
    var Domain = require('web.Domain');
    var pyUtils = require('web.py_utils');

    var QWeb = core.qweb;
    var _t = core._t;

    var AddToComplexMenu = Widget.extend({
        events: _.extend({}, Widget.prototype.events,{
            'click .o_add_to_complex.o_menu_header':'_onMenuHeaderClick',
            'click .o_add_to_complex_confirm_button': '_onAddToComplexConfirmButtonClick'
        }),

        init: function(parent, params) {
            this._super(parent);
            this.action = params.action;
            this.isOpen = false; // 填写视图信息widget的状态
        },

        start: function () {
            if (this.action.id && this.action.type === 'ir.actions.act_window') {
                this._render();
            }
            return this._super.apply(this, arguments);
        },

        _toggleMenu: function () {
            this.isOpen = !this.isOpen;
            this. _render();
        },

        _onMenuHeaderClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this._toggleMenu();
        },

        _render: function () {
            var $el = QWeb.render('AddToComplexMenu', {widget: this});
            this._replaceElement($el);
            if (this.isOpen) {
                this.$input = this.$('.o_add_to_complex_input');
                this.$input.val(this.action.name);
                this.$input.focus();
            }
        },

        _onAddToComplexConfirmButtonClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this._addToBoard();
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

            var name = this.$input.val();
            this.closeMenu();

            return self._rpc({
                route: '/complex/add_to_complexboard',
                params: {
                    action_id: self.action.id || false,
                    context_to_save: evalutatedContext,
                    domain: domain,
                    view_mode: controller.viewType,
                    name: name,
                },
            }).then(function (res) {
                if (res) {
                    self.do_notify(
                        _.str.sprintf(_t("'%s' added to complexboard"), name),
                        _t('Please refresh your browser for the changes to take effect.')
                    );
                } else {
                    self.do_warn(_t("Could not add filter to complexboard"));
                }
            });

        },

        closeMenu: function () {
            this.isOpen = false;
            this._render();
        },

    });

favorites_submenus_registry.add('add_to_complex_menu', AddToComplexMenu, 10);

return AddToComplexMenu;

});