const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const css = require("css-loader");

module.exports = {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: "raw-loader",
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            // TypeScript
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            // CSS
            {
                test: /src\/.+\.css$/i,
                use: ["css-loader"],
            },
            {
                test: /^((?!src\/).)*.css$/i,
                use: ["style-loader", "css-loader"],
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset/inline",
            },
        ],
    },
    entry: {
        main: path.resolve(__dirname, "./wbcore/start.ts"),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "webpack Boilerplate",
            template: path.resolve(__dirname, "./src/index.html"), // template file
            filename: "index.html", // output file
        }),
        new CleanWebpackPlugin(),
    ],
    devtool: "source-map",
};
