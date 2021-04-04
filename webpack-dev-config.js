const {resolve} = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
// const tsImportPluginFactory = require('ts-import-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
    entry: ["./src/index.tsx", "./public/index.html"],
    output: {
        //输入
        filename: "js/built.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    /*
                    开启多进程打包,线程有时间600ms,通信也有时间
                    只有工作时间比较长
                    */
                    // "thread-loader",
                    {
                        loader: "babel-loader",
                        options: {
                            //预设 提示babel做怎么样的兼容性处理
                            presets: [
                                ['@babel/preset-env', {
                                    "useBuiltIns": "usage",
                                    "corejs": 3,
                                    "targets": "> 1% in AU and not dead",
                                    "shippedProposals": true
                                }],
                                "@babel/preset-react",
                                "@babel/preset-typescript"
                            ],
                            //开启babel缓存
                            //第二次构建时，会读取之前的缓存
                            cacheDirectory: true,
                            "plugins": [
                                //按需加载antd
                                ["import", {"libraryName": "antd", "libraryDirectory": "es", "style": true}, "ant"],
                                ["import", {
                                    "libraryName": "@ant-design/icons",
                                    "libraryDirectory": "es/icons",
                                    "camel2DashComponentName": false
                                }, "ant-design-icons"],
                            ]
                        },
                    }
                ]
            },
            // {
            //     test: /\.(jsx|tsx|js|ts)$/,
            //     loader: 'ts-loader',
            //     options: {
            //         transpileOnly: true,
            //         getCustomTransformers: () => ({
            //             before: [tsImportPluginFactory(
            //                 {
            //                     libraryName: 'antd',
            //                     libraryDirectory: 'lib',
            //                     style: true,
            //                 }
            //             )]
            //         }),
            //         compilerOptions: {
            //             module: 'es2015'
            //         }
            //     },
            //     exclude: /node_modules/
            // },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }, {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                // modifyVars: {
                                //     'primary-color': '#3fc5f0'
                                // },
                                javascriptEnabled: true,
                            }
                        }
                    }
                ]
            }, {
                test: /\.(jpg|png|gif|svg)$/,
                //依赖两个包 url-loader file-loader
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            }, {
                test: /\.html$/,
                //处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: "html-loader"
            }, {
                //排除这些文件，打包剩下的
                exclude: /\.(css|js|jsx|ts|tsx|html|jpg|png|gif|svg|less)/,
                type: 'asset/resource',
                generator: {
                    filename: 'media/[hash][ext][query]'
                }
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new friendlyErrorsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
    ],
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
        overlay: true
        // proxy: {
        //     "/api": {
        //         target: "http://localhost:5000",
        //         changeOrigin: true,
        //         secure: false
        //     }
        // }
    },
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': resolve(__dirname, "./src")
        },
    }
    // externals:{
    //     //忽略CDN的打包
    //     "react":"React",
    //     "react-dom":"ReactDOM"
    // }
};