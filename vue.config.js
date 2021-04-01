const path = require('path')
module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8081,
        public: 'localhost:8081',
    },
    pluginOptions: {
        'style-resources-loader': {
            'preProcessor': 'scss',
            'patterns': [
                path.resolve(__dirname, './src/styles/styles.scss'),
                path.resolve(__dirname, './src/styles/variables.scss'),
            ]
        }
    }
}
