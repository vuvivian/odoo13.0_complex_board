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
<<<<<<< HEAD
    'qweb': [
        'static/src/xml/complex_board.xml',
        'static/src/xml/menu_list.xml',
        'static/src/xml/setting_layout.xml',
        'static/src/xml/view_action.xml',
        'static/src/xml/enlarge_view.xml',
        'static/src/xml/bottom_bar.xml',
        'static/src/xml/complex_footer.xml',
    ],
=======
    'qweb': ["static/src/xml/*.xml"],
>>>>>>> 3bfec937f74db0045e49acb3abfa35b98c4627f8
    'installable': True,
    'application': True,
    'auto_install': False,
}
