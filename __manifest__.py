# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': '驾驶舱首页',
    'category': 'tools',
    'summary': ' 一种支持多视图展示的容器视图组件实现方法',
    'description': """ 一种支持多视图展示的容器视图组件实现方法""",
    'author': "vuvivian",
    'website': "https://github.com/vuvivian?tab=repositories",
    'version': '1.0',
    'depends': ['base','web',],
    'data': [
        'views/complex_menu.xml',
        'views/complex_template.xml',
    ],
    'qweb': ["static/src/xml/*.xml"],
    'installable': True,
    'application': True,
    'auto_install': False,
}
