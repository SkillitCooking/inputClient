'use strict';
import {remote} from 'electron';
const {Menu, MenuItem} = remote;

function createContextMenu() {
    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Copy',
        role: 'copy'
    }));
    menu.append(new MenuItem({
        label: 'Paste',
        role: 'paste'
    }));
    menu.append(new MenuItem({
        label: 'Select All',
        role: 'selectall'
    }));
    menu.append(new MenuItem({
        label: 'Undo',
        role: 'undo'
    }));
    menu.append(new MenuItem({
        label: 'Redo',
        role: 'redo'
    }));
    menu.append(new MenuItem({
        type: 'separator'
    }));
    menu.append(new MenuItem({
        label: 'Reload',
        role: 'reload'
    }));
    menu.append(new MenuItem({
        label: 'Quit',
        role: 'quit'
    }));
    menu.append(new MenuItem({
        type: 'separator'
    }));
    menu.append(new MenuItem({
        label: 'Toggle Dev Menu',
        role: 'toggledevtools'
    }));
    menu.append(new MenuItem({
        label: 'Toggle Full Screen',
        role: 'togglefullscreen'
    }));
    return menu;
}

export default {
    createContextMenu
};