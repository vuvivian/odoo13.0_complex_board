# -*- coding: utf-8 -*-

from odoo import models, fields, api, tools

class User(models.Model):
    _inherit = 'res.users'

    layout = fields.Selection([('icon','Icon'),('view','View')],string='homepage layout',default='icon')

    @api.model
    def set_layout(self,layout):
        if layout == 'icon':
            self.env.user.layout = 'icon'
        if layout == 'view':
            self.env.user.layout = 'view'

    @api.model
    def get_layout(self):
        return self.env.user.layout