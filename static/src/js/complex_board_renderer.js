 /**
     * Description：complexRenderer
     * Date: 2019.11.21
     * Updater: wangjuan04@inspur.com
 */
odoo.define('complex.ComplexRenderer', function (require) {
    "use strict";

    var core = require('web.core');
    var Context = require('web.Context');
    var config = require('web.config');
    var Dialog = require('web.Dialog');
    var Domain = require('web.Domain');
    var pyUtils = require('web.py_utils');
    var session = require('web.session');
    var viewRegistry = require('web.view_registry');
    var _t = core._t;
    var QWeb = core.qweb;
    var FormRenderer = require('web.FormRenderer');
    var layout;

    var ComplexRenderer = FormRenderer.extend({
        custom_events: _.extend({}, FormRenderer.prototype.custom_events, {}),
        events: _.extend({}, FormRenderer.prototype.events, {
            'click .oe_complexboard_column .oe_fold': '_onFoldClick',
            'click .oe_complexboard_column .oe_close': '_onCloseClick',
<<<<<<< HEAD
            'click .oe_complexboard_column .oe_fullScreen': '_onFullScreen',
            'click .oe_complexboard_column .oe_exitFullScreen': '_onExitFullScreen',
            'click .oe_complexboard_column  .oe_fullScreenTest': '_onFullScreenTest',
            // 'click .o_complex_bar_icon.o_complex_bar_setting': '_onBarSettingClick', 
            // 'click .o_complex_bar_icon.o_complex_bar_menu': '_onBarMenuClick',
=======
            'click .oe_complexboard_column .oe_expand': '_onExpandScreen',
            'click .o_complex_bar_setting': '_onBarSettingClick', 
            'click .o_complex_bar_stay_icon': '_onBarIconClick',
            'click .o_complex_bar_btn_container': '_onBarFoldBtnClick',
            'click .o_complex_bar_icon.o_complex_bar_menu': '_onBarMenuClick',
            'click .oe_complex_icon_item':'_onMenuClicked', //首页图标点击
>>>>>>> 3bfec937f74db0045e49acb3abfa35b98c4627f8
        }),

        init: function (parent, state, params) {
            this._super.apply(this, arguments);
            this.noContentHelp = params.noContentHelp;
            this._getLayout();
            this.actionsDescr = {}; 
            this._boardSubcontrollers = []; // for board: controllers of subviews
            this._boardFormViewIDs = {}; // for board: mapping subview controller to form view id
            this.menuData = [];
            this.structedMenu = [];  //结构化图标
        },


        willStart: function() {
            var self = this;
            return this._super.apply(this,arguments).then(function(){
                return self._rpc({
                        model:'ir.ui.menu',
                        method: 'load_favourite_menu',
                        args:[]
                    }).then(function(result){
                        // for(var i=0;i<result.length;i++){
                        //     var menu = result[i];
                        //     if(menu.web_icon){
                        //         menu.web_icon = '/'+ menu.web_icon.replace(',','/');
                        //     }else{
                        //         menu.web_icon = '/odoo_complex_board/static/src/img/defaultview2.png';
                        //     }
                        // }
                        self.menuData= result;                                
                        self.structedMenu = self.structedMenu || [];
                        result.forEach((item, index) => {
                            const col = Math.floor(index / 5);   //每列5个菜单图标
                            if (!self.structedMenu[col]) { 
                                self.structedMenu[col] = [];
                            }
                            self.structedMenu[col].push(item);
                          });
                    })
                }
            )
        },

        

        on_attach_callback: function () {
            var self = this;
            _.each(this._boardSubcontrollers, function (controller) {
                if ('on_attach_callback' in controller) {
                    controller.on_attach_callback();
                };
            });
            //info: init bottom bar view  auth:wangjuan date:2019/11/25
            _.each(this.actionsDescr, function (action) {
                self.trigger_up('add_complex_view', {
                    'viewInfo': {
                        'name':action['string'],
                        'id': action['id'],
                        'actionId':action['name'],
                        'menuId':action['menu_id'], 
                        'icon':action['web_icon'],
                        'stay': false
                    }
                })
            })
        },

        on_detach_callback: function () {
            _.each(this._boardSubcontrollers, function (controller) {
                if ('on_detach_callback' in controller) {
                    controller.on_detach_callback();
                }
            });
        },

         //info: get layout auth:wangjuan update:2019/11/27
        _getLayout: function () {
            this._rpc({
                model: 'res.users',
                method: 'get_layout',
            }).then( function (result) {
                layout = result
            })
        },

        //info: check layout param  auth:wangjuan update:2019/11/27
        _renderTagComplex: function (node) {
            var self = this;
            this.$el.addClass('oe_complexboard_container');
            this.trigger_up('enable_cmplexboard');
           
            var hasAction = _.detect(node.children, function (column) {
                return _.detect(column.children,function (element){
                    return element.tag === "action"? element: false;
                });
            });
            
            // if(self.menuData.length){
            //     return $(QWeb.render('Container.MenuIcon',{menuData: self.structedMenu}));
            // }
            // if (!hasAction) {
            //     return $(QWeb.render('Complex.NoContent'));
            // }
            node = $.extend(true, {}, node);
            node.attrs.layout = layout;
            // if (!('layout' in node.attrs)) {
            //     node.attrs.layout = layout;
            // }

            for (var i = node.children.length; i < 3; i++) {
                node.children.push({
                    tag: 'column',
                    attrs: {},
                    children: []
                });
            }
            _.each(node.children, function (column, column_index) {
                _.each(column.children, function (action, action_index) {
                    action.attrs.id = 'action_' + column_index + '_' + action_index;
                    self.actionsDescr[action.attrs.id] = action.attrs;
                });
            });

            var $html = $('<div class="row">').append($(QWeb.render('Complex', {node: node, menuData:self.menuData, isMobile: config.device.isMobile})));
          
            // var $html = $('<div>').append($(QWeb.render('HomePage')));
            
            // if(self.menuData.length){
            //     let self = this;
            //     self._rpc({
            //         model:'res.users',
            //         method:'get_layout',
            //         args:[]
            //     }).then(function(result){
            //         if(result === 'icon'){
            //             $html.find('.o_left_container').append($(QWeb.render('Container.MenuIcon',{menuData: self.structedMenu})));
            //         }
            //     })
            // }

            // console.log('node', node);
            // $html.find('.o_right_container').append($(QWeb.render('Complex',{node:node,isMobile: config.device.isMobile})))
            _.each(this.actionsDescr, function (action) {
               
                self.defs.push(self._createController({
                    $node: $html.find('.oe_action[data-id=' + action.id + '] .oe_complex_content'),
                    actionID: _.str.toNumber(action.name),
                    context: action.context,
                    domain: Domain.prototype.stringToArray(action.domain, {}),
                    viewType: action.view_mode,
                }));
                
            });
            $html.find('.oe_complexboard_column').sortable({
                connectWith: '.oe_complexboard_column',
                handle: '.oe_header',
                scroll: false
            }).bind('sortstop', function () {
                self.trigger_up('save_dashboard');
            });
            return $html;
        },

        _createController: function (params) {
            var self = this;
            return this._rpc({
                    route: '/web/action/load',
                    params: {action_id: params.actionID}
                })
                .then(function (action) {
                    if (!action) {
                        // the action does not exist anymore
                        return Promise.resolve();
                    }
                    var evalContext = new Context(params.context).eval();
                    if (evalContext.group_by && evalContext.group_by.length === 0) {
                        delete evalContext.group_by;
                    }
                    // tz and lang are saved in the custom view
                    // override the language to take the current one
                    var rawContext = new Context(action.context, evalContext, {lang: session.user_context.lang});
                    var context = pyUtils.eval('context', rawContext, evalContext);
                    var domain = params.domain || pyUtils.eval('domain', action.domain || '[]', action.context);
                    action.context = context;
                    action.domain = domain;
                    var viewType = params.viewType || action.views[0][1];
                    var view = _.find(action.views, function (descr) {
                        return descr[1] === viewType;
                    }) || [false, viewType];
                    return self.loadViews(action.res_model, context, [view])
                               .then(function (viewsInfo) {
                        var viewInfo = viewsInfo[viewType];
                        var View = viewRegistry.get(viewType);
                        var view = new View(viewInfo, {
                            action: action,
                            hasSelectors: false,
                            modelName: action.res_model,
                            searchQuery: {
                                context: context,
                                domain: domain,
                                groupBy: typeof context.group_by === 'string' && context.group_by ? [context.group_by] : context.group_by || [],
                                orderedBy: context.orderedBy || [],
                            },
                            withControlPanel: false,
                        });
                        return view.getController(self).then(function (controller) {
                            self._boardFormViewIDs[controller.handle] = _.first(
                                _.find(action.views, function (descr) {
                                    return descr[1] === 'form';
                                })
                            );
                            self._boardSubcontrollers.push(controller);
                            return controller.appendTo(params.$node);
                        });
                    });
                });
        },

        getBoard: function () {
            var self = this;
            var board = {
                form_title : this.arch.attrs.string,
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

        //info: click minimize button  auth:wangjuan update:2019/11/26
        _onFoldClick: function (event) {
            var self = this;
            var $e = $(event.currentTarget);
            console.log('$e', $e)
            var $action = $e.closest('.oe_action');
            var id = $action.data('id');
            var actionAttrs = this.actionsDescr[id];
            console.log('event.currentTarget.attributes',event.currentTarget.attributes)
            this.trigger_up('add_complex_view', {
                'viewInfo': {
                    'name':event.currentTarget.attributes['viewname'].nodeValue,
                    'id': event.currentTarget.attributes['viewid'].nodeValue,
                    'actionId':event.currentTarget.attributes['viewaction'].nodeValue,
                    'menuId':event.currentTarget.attributes['viewmenu'].nodeValue,
                    'icon':event.currentTarget.attributes['viewicon'].nodeValue,
                    'stay': true
                }
            })
            $action.toggle(false);
            this.trigger_up('save_dashboard');
        },

        //info: click expand button  auth:wangjuan date:2019/11/25
        _onExpandScreen: function (event) {
            const actionId = event.currentTarget.attributes['viewaction'].nodeValue;
            var self = this;    
            var $container = $(event.currentTarget).parents('.oe_action:first');
            $container.remove();
            
            self.trigger_up('remove_complex_view', {
                'viewInfo': {
                    'name':event.currentTarget.attributes['viewname'].nodeValue,
                    'id': event.currentTarget.attributes['viewid'].nodeValue,
                    'actionId':event.currentTarget.attributes['viewaction'].nodeValue,
                    'menuId':event.currentTarget.attributes['viewmenu'].nodeValue,
                    'icon':event.currentTarget.attributes['viewicon'].nodeValue,
                }
            })
            self.trigger_up('save_dashboard');
            self.trigger_up('menu_clicked', {
                // id: 227,  // todo get menuid
                action_id: actionId,
            });
        },
        
        //info: click close button  auth:wangjuan update:2019/11/26
        _onCloseClick: function (event) {
            var self = this;
            var $container = $(event.currentTarget).parents('.oe_action:first');
            Dialog.confirm(this, (_t("确定要删除吗？")), {
                confirm_callback: function () {
                    $container.remove();
                    self.trigger_up('remove_complex_view', {
                        'viewInfo': {
                            'name':event.currentTarget.attributes['viewname'].nodeValue,
                            'id': event.currentTarget.attributes['viewid'].nodeValue,
                            'actionId':event.currentTarget.attributes['viewaction'].nodeValue,
                            'menuId':event.currentTarget.attributes['viewmenu'].nodeValue,
                            'icon':event.currentTarget.attributes['viewicon'].nodeValue,
                        }
                    }),
                    self.trigger_up('save_dashboard');
                },
            });
        },


        //info: click maximize button  auth:wangjuan update:2019/11/26
        _onFullScreenTest: function (event) {
            var self = this;    
            var $container = $(event.currentTarget).parents('.oe_action:first');
            $container.remove();
            self.trigger_up('save_dashboard');
            
            this.trigger_up('remove_complex_view', {
                'viewInfo': {
                    'name':event.currentTarget.attributes['viewname'].nodeValue,
                    'id': event.currentTarget.attributes['viewid'].nodeValue,
                    'actionId':event.currentTarget.attributes['viewaction'].nodeValue,
                    'menuId':event.currentTarget.attributes['viewmenu'].nodeValue,
                    'icon':event.currentTarget.attributes['viewicon'].nodeValue,
                }
            })

            const actionId = event.currentTarget.attributes['viewaction'].nodeValue;
            console.log(actionId);
            this.trigger_up('menu_clicked', {
                // id: 227,  // todo get menuid
                action_id: actionId,
            });
        },

<<<<<<< HEAD
        // //设置
        //  _onBarSettingClick: function () {
        //     this.trigger_up('change_layout');
        // },
        // //菜单
        // _onBarMenuClick: function (event) {
        //     // this.trigger_up('choose_menu');
        //     this.do_action({
        //         type: 'ir.actions.client',
        //         tag: 'ComplexMenusPage',
        //         target: 'current'
        //     })
        // },
=======
        //info: click bottom bar setting  auth:wangjuan date:2019/11/18
         _onBarSettingClick: function () {
            this.trigger_up('change_layout');
        },

        //info: click bottom bar menu  auth:wangjuan date:2019/11/18
        _onBarMenuClick: function (event) {
            // this.trigger_up('choose_menu');
            this.do_action({
                type: 'ir.actions.client',
                tag: 'ComplexMenusPage',
                target: 'current'
            })
        },
>>>>>>> 3bfec937f74db0045e49acb3abfa35b98c4627f8

        //info: click bottom bar view  auth:wangjuan date:2019/11/25
        _onBarIconClick: function(event){
            const viewId = event.currentTarget.attributes['viewId'].nodeValue;
            $('#'+viewId).toggle();
            // $('#'+viewId).children(".oe_complex_content").toggle();
            // $('#'+viewId).children('.oe_header').toggle();
            $(event.currentTarget).toggleClass('o_complex_bar_stay_icon_on');
            this.trigger_up('save_dashboard');
        },

         //info: click bottom bar fold button  auth:wangjuan date:2019/11/26
        _onBarFoldBtnClick: function(event) {
            $('.o_complex_bar_icon_container').toggleClass('o_complex_bar_hidden');
            $('.o_complex_bar_btn_container').toggleClass('o_complex_bar_unfold_btn');
        },

        
        //点击图标跳转视图，changych 2019-11-25
        _onMenuClicked: function(event){
            const menu_id = event.currentTarget.attributes['menuid'].nodeValue;
            const action_id = event.currentTarget.attributes['actionid'].nodeValue.split(',')[1];
            if (action_id) {
                this.trigger_up('menu_clicked',{
                    id: menu_id,
                    action_id: action_id,
                });
            }
        },

    })

    return ComplexRenderer
})
    
