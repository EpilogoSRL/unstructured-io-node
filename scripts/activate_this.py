# -*- coding: utf-8 -*-
"""Activate the virtual environment."""
import os
import site
import sys

# Path to the virtual environment
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add the virtual environment's site-packages to sys.path
site_packages = os.path.join(base, 'lib', f'python{sys.version[:3]}', 'site-packages')
prev_sys_path = list(sys.path)
site.addsitedir(site_packages)
sys.real_prefix = sys.prefix
sys.prefix = base

# Reorder sys.path to prioritize the virtual environment
new_sys_path = [p for p in sys.path if p not in prev_sys_path]
sys.path = new_sys_path + prev_sys_path
