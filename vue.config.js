const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path'); //引入path模块
function resolve(dir) {
    return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}
module.exports = {
    publicPath: './',
    outputDir: process.env.VUE_FOLDER,
    devServer: {
        host: 'localhost',
        // host: '192.168.2.194',
        port: 5633,
        open: false,
        proxy: {
            '/api': {
                target: 'http://api.gongkongbpo.qa',
                changeOrigin: true,
            },
            '/ChuJu': {
                target: 'http://api.gongkongbpo.qa',
                changeOrigin: true,
            },
            '/personApi': {
                target: 'http://sso.api.gongkongbpo.qa',
                changeOrigin: true,
                pathRewrite: {
                    '^/personApi': ''
                }
            },
            '/shareApi': {
                target: 'http://m.gongkongbpo.qa',
                changeOrigin: true,
                pathRewrite: {
                    '^/shareApi': ''
                }
            },
            '/JobWorkflow': {
                target: 'http://api.gongkongbpo.qa',
                changeOrigin: true,
            },
            '.a1.': {
                target: 'http://a1.easemob.com',
                changeOrigin: true,
                ws: true,
            },
            '.im-api-v2': {
                target: 'http://im-api-v2.easemob.com',
                changeOrigin: true,
                ws: true,
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"));
        config.resolve.alias.set("static", resolve("public/static"));
    },
    // productionSourceMap: false,
    configureWebpack: config => {
        return {
            // plugins: [
            //     new BundleAnalyzerPlugin()
            // ],
            externals: {
                'vue': 'Vue',
                'vant-ui': 'Vant',
                'vue-router': 'VueRouter',
                'lodash': '_',
                'easemob-websdk': 'websdk',
                'easemob-emedia': 'emedia',
                'easemob-webrtc': 'webrtc',
            }
        }
    }
}