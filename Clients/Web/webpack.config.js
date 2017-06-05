const path = require("path");
const autoprefixer = require("autoprefixer");

const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const LessPluginCleanCSS = require("less-plugin-clean-css");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require('dotenv').config();

const APP_ROOT = path.resolve(__dirname);
const SRC_ROOT = path.resolve(__dirname, "src");

const srcEntry = "./src/index.tsx";

const extractSASS = new ExtractTextPlugin({
    filename: "bundle.css",
    disable: false,
    allChunks: true
});

const vender = {
    vender: [
        "classnames/bind",
        "keycode",
        "react",
        "react-dom",
        "react-addons-update",
        "react-css-modules",
        "react-redux",
        "redux",
        "redux-little-router",
        "axios",
        "material-ui/AppBar",
        "material-ui/FontIcon",
        "material-ui/Paper",
        "material-ui/TextField",
        "material-ui/Dialog",
        "material-ui/RaisedButton",
        "material-ui/FlatButton",
        "material-ui/Tabs",
        "config"
    ]
};

const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: "commons",

    filename: "commons.js",
    // (Give the chunk a different name)

    minChunks: 3,
    // (with more entries, this ensures that no other module
    //  goes into the vender chunk)

    //children: true,

    //async: true,

});

const providePlugin = new webpack.ProvidePlugin({
    keycode: "keycode",
    classNames: "classnames/bind",
    update: "react-addons-update",
    config: "config"
});

const htmlPlugins = [
    new HtmlWebpackPlugin({
        filename: "../index.html",
        template: "../src/assets/index.html"
    }),
    new HtmlWebpackPlugin({ // Also generate a test.html
        filename: "../test.html",
        template: "../src/assets/test.html"
    })
];

module.exports = {
    entry: debug ? {
        app: [
            "babel-polyfill",
            "react-hot-loader/patch",
            // "webpack/hot/only-dev-server",
            path.resolve(SRC_ROOT, "index.dev.tsx")
        ]
    } : merge(vender, {
        app: [
            "babel-polyfill",
            path.resolve(SRC_ROOT, "index.prod.tsx")
        ]
    }),
    output: {
        path: path.resolve(APP_ROOT, "dist"),
        filename: "[name].js",
        publicPath: "/dist/"
    },
    devServer: {
        hot: true,
        publicPath: "/dist/",
        host: "localhost",
        port: 3000,
        historyApiFallback: true
    },
    context: path.resolve(__dirname, "src"),
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".scss", ".sass", ".less", ".woff2", ".ttf", ".eot", ".svg"]
    },
    module: {
        rules: [{
                test: /\.ts(x?)$/,
                use: debug ? [
                    "react-hot-loader/webpack", "ts-loader"
                ] : [
                    "ts-loader"
                ],
                include: [SRC_ROOT],
                exclude: [
                    debug ? (/\.prod\./) : (/\.dev\./),
                    /styles/,
                    /node_modules/
                    //"typings/globals"
                ],
                //exclude: path.resolve(SRC_ROOT, "styles")
            },
            {
                test: /\.js$/,
                use: [
                    "babel-loader?presets[]=es2015&plugins[]=transform-es2015-modules-amd"
                ],
                include: [path.resolve(APP_ROOT, "config")],
                //exclude: path.resolve(SRC_ROOT, "styles")
                exclude: [
                    debug ? (/\.prod\./) : (/\.dev\./),
                    /styles|node_modules/
                    //"typings/globals"
                ],
                //query: {
                //    presets: ["es2015", "react"]
                //}
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.scss$/,
                use: debug ? [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            minimize: false,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]__[local]__[hash:base64:5]",
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            plugins: (loader) => [
                                autoprefixer
                            ]
                        }
                    },
                    "resolve-url-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: [
                                SRC_ROOT
                                //path.resolve(APP_ROOT, "styles/sass-resources.scss")
                            ]
                        }
                    },
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: path.resolve(APP_ROOT, "styles/sass-resources.scss")
                        }
                    }
                ] : ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                plugins: (loader) => [
                                    autoprefixer
                                ]
                            }
                        },
                        "resolve-url-loader",
                        "sass-loader",
                        {
                            loader: "sass-resources-loader",
                            options: {
                                resources: path.resolve(APP_ROOT, "styles/sass-resources.scss")
                            }
                        }
                    ]
                }),
                include: [SRC_ROOT],
                exclude: debug ? (/\.prod\./) : (/\.dev\./)
            }
        ]
    },
    plugins: debug ? [
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.AggressiveMergingPlugin({ moveToParent: true }),
        providePlugin,
        // new webpack.EnvironmentPlugin([
        //     "NODE_ENV"
        // ]),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        htmlPlugins[0],
        htmlPlugins[1]
    ] : [
        //new webpack.optimize.AggressiveMergingPlugin({moveToParent: true}),
        commonsChunkPlugin,
        providePlugin,
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            //'process.env': {
            //    'NODE_ENV': '"production"'
            //}
            //"./store/ConfigureStore.dev": "./store/ConfigureStore.prod"
        }),
        new webpack.EnvironmentPlugin([
            "NODE_ENV"
        ]),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourcemap: false
        }),
        extractSASS,
        htmlPlugins[0],
        htmlPlugins[1]
    ]
};