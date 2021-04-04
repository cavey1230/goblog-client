const {resolve} = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
// const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
// const tsImportPluginFactory = require('ts-import-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer")

process.env.NODE_ENV = "production"

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "js/[name].[contenthash:10].js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     ident: "postcss",
                        //     plugins: () => [
                        //         //postcss的插件
                        //         require("postcss-preset-env")()
                        //     ]
                        // }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     ident: "postcss",
                        //     plugins: () => [
                        //         //postcss的插件
                        //         require("postcss-preset-env")()
                        //     ]
                        // }
                    },
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
                    }]
            },
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
                                // ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true}, "ant"],
                                // // ["import", { "libraryName": "antd", "style": true}, "ant"],
                                // ["import", {
                                //     "libraryName": "@ant-design/icons",
                                //     "libraryDirectory": "es/icons",
                                //     "camel2DashComponentName": false
                                // }, "ant-design-icons"],
                            ]
                        }
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
                test: /\.(jpg|png|gif|svg)$/,
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
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            },
        }),
        //压缩css插件
        new MiniCssExtractPlugin({
            // 重命名文件 输出到css文件夹
            filename: "css/built.[contenthash:10].css",
        }),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin()
    ],

    /*
    1.可以将node_modules中代码单独打包一个chunk最终输出
    2.自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
    */
    optimization: {
        splitChunks: {
            chunks: 'all',
            /* 以下都是默认值，可以不写 */
            minSize: 30 * 1024, //分割的chunk最小为30kb
            maxSize: 244 * 1024, //最大没有限制
        },
        chunkIds: "named",
        usedExports: true,
        minimize:true,
        minimizer: [
            new CssMinimizerPlugin({}),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false
            }),
        ],
    },
    mode: "production",
    // devtool: "source-map",
    devtool: false,
    externals:{
        //忽略CDN的打包
        "react":"React",
        "react-dom":"ReactDOM",
        // "react-redux":"react-redux",
        "antd":"antd",
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': resolve(__dirname, "./src")
        },
    }
}