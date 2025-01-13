const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production", // Set to production for final build
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // Clean the dist folder before building
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i, // Handle images and fonts
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]", // Store assets in 'assets' folder
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "asset", to: "asset" }, // Copy assets folder
        { from: "style", to: "style" }, // Copy style folder
        { from: "fonts", to: "fonts" }, // Copy fonts folder
      ],
    }),
  ],
};
