# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from lxml import etree as ElementTree

from odoo.http import Controller, route, request


class Complex(Controller):

    @route('/complex/add_to_complexboard', type='json', auth='user')
    def add_to_complexboard(self, action_id, context_to_save, domain, view_mode='', name='',mode=1):
        # mode 1：缩放（默认），2：收藏，3：最小化
        # Retrieve the 'My Dashboard' action from its xmlid
        action = request.env.ref('odoo_complex_board.open_complex_view_board')

        if action and action['res_model'] == 'complex.view' and action['views'][0][1] == 'form' and action_id:
            # Maybe should check the content instead of model board.board ?
            view_id = action['views'][0][0]
            board = request.env['complex.view'].fields_view_get(view_id, 'form')
            action = "ir.actions.act_window,"+str(action_id)
            menu_id = request.env['ir.ui.menu'].search([('action', '=', action)]).id
            web_icon = request.env['ir.ui.menu'].search([('id', '=', menu_id)]).web_icon
            if board and 'arch' in board:
                xml = ElementTree.fromstring(board['arch'])
                column = xml.find('./complex/column')
                print(column)
                if column is not None:
                    new_action = ElementTree.Element('action', {
                        'name': str(action_id),
                        'string': name,
                        'view_mode': view_mode,
                        'context': str(context_to_save),
                        'domain': str(domain),
                        'menu_id': str(menu_id), #新增参数
                        'web_icon': str(web_icon),#新增参数
                        'mode': str(mode)  #新增参数
                    })
                    column.insert(0, new_action)
                    arch = ElementTree.tostring(xml, encoding='unicode')
                    request.env['ir.ui.view.custom'].create({
                        'user_id': request.session.uid,
                        'ref_id': view_id,
                        'arch': arch
                    })
                    return True

        return False

# ## 删除首页存储视图
    @route('/complex/remove_from_complexboard', type='json', auth='user')
    def remove_from_complexboard(self, action_id):
        action = request.env.ref('odoo_complex_board.open_complex_view_board')
        if action and action['res_model'] == 'complex.view' and action['views'][0][1] == 'form' and action_id:
            view_id = action['views'][0][0]
            res = request.env['ir.ui.view.custom'].search([('user_id','=',request.session.uid),
                                                           ('ref_id','=',view_id)])
            res.unlink()





