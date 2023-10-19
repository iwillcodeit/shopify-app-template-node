// @ts-check
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ImageConfigWebpackPlugin = require("image-config-webpack-plugin");
const ReactServerWebpackPlugin = require("react-server-dom-webpack/plugin");

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  entry: path.join(__dirname, "./src/app/index.tsx"),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "swc-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              symbolId: "icon-[name]",
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    mainFields: ['browser', 'main', 'module']
  },
  output: {
    path: path.join(__dirname, "dist/client"),
  },
  plugins: [
    new ImageConfigWebpackPlugin(),
    new HtmlWebPackPlugin({
      inject: true,
      template: "./index.html",
    }),
    new ReactServerWebpackPlugin({ isServer: false }),
  ],
};

module.exports = config;
