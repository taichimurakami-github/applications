const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'attendance-management-electron',
        'win':{
            'target': {
                'target': 'nsis',
                'arch': [
                    'x64',
                    'ia32',
                ]
            }
        }
    }
});