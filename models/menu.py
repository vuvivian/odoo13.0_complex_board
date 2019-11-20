# -*- coding: utf-8 -*-

from odoo import models, fields, api, tools
import operator

class Menu(models.Model):
    _inherit = 'ir.ui.menu'

    #储存用户收藏菜单信息
    collect_user_ids = fields.Many2many('res.users','menu_user_rel','menu_id','user_id',string='collect users')
 
    @api.model
    #@tools.ormcache_context('self._uid', 'debug', keys=('lang',))
    def load_upper_menus(self,debug):
        """ Loads the 1th, 2th order menu.
        :return: the 1th and 2th order menu
        :rtype: dict('children': menu_nodes)
        """
        fields = ["name", "sequence", "parent_id", "action", "web_icon"]
        category_menus = self.env["ir.module.category"].search([])  #Todo,一级菜单获取逻辑待确认
        module_root_menus = self.search([("parent_id", "=", False)]).read(fields)
        
        #Todo，模块根菜单与分类菜单建立关联
        # for root_menu in module_root_menus:
        #     pass 
        
        return {
            'id': False,
            'name': 'root',
            'parent_id': False,
            # 'children': category_menus,
            'children': module_root_menus,
        }

    @api.model
    #@tools.ormcache_context('self._uid', 'debug', keys=('lang',))
    def load_module_menus(self,menu_id,debug):
        """ Loads the 3th, 4th order menu of the given module.
        :return: the submenu of the given module
        :rtype: dict('children': menu_nodes)
        """
        fields = ["name", "sequence", "parent_id", "action", "web_icon","collect_user_ids"]
        root_menu = self.search([('id','=',menu_id)]).read(fields)
        menus = self.search([("id", "child_of", [int(menu_id)])])
        menu_items = menus.read(fields) if menus else []

        menu_items.extend(root_menu)
        
        #build a menu tree according to the field parent_id
        menu_items_map = {menu_item["id"]: menu_item for menu_item in menu_items}
        for menu_item in menu_items:
            parent = menu_item["parent_id"] and menu_item["parent_id"][0]
            if parent in menu_items_map:
                menu_items_map[parent].setdefault("children", []).append(menu_item)
        
        #sort the submenu according to the field sequence
        for menu_item in menu_items:
            menu_item.setdefault("children", []).sort(key=operator.itemgetter("sequence"))
        
        #judge the menus is collected or not
        # for menu_item in menu_items:
        #     if self.env.uid in menu_item["collect_user_ids"].ids:
        #         menu_item.setdefault("is_collected", True)
        #     else:
        #         menu_item.setdefault("is_collected", False) 
        count = 0
        for menu_item in menu_items:
            if count % 2 == 0:
                menu_item.setdefault("is_collected", True)
            else:
                menu_item.setdefault("is_collected", False)
            count += 1

        
        return {
            "id": root_menu[0]["id"],
            "name": root_menu[0]["name"],
            "parent_id": False,
            "children": root_menu[0]["children"]
        }

    @api.model
    #@tools.ormcache_context('self._uid', 'debug', keys=('lang',))
    def load_favourite_menu(self):
        """ Loads the collected menus by the given user.
        :return: menus
        :rtype: list(menu_nodes)
        """
        fields = ["name", "sequence", "parent_id", "action", "web_icon"]
        self.env.cr.execute("select menu_id from menu_user_rel where user_id=%s" %(self.env.uid))
        menu_ids = self.env.cr.fetchall()
        favourite_menus = self.browse(menu_ids).read(fields)
        return favourite_menus
    
    @api.model
    def collect(self,menu_id):
        """ collect the given menu.
        """
        menu = self.browse(menu_id)
        menu.write({'collect_user_ids':(4,self.env.uid)})
    
    @api.model
    def uncollect(self,menu_id):
        """ 
        uncollect the given menu.
        """
        menu = self.browse(menu_id)
        menu.write({'collect_user_ids':(3,self.env.uid)})

