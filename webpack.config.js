const { watch } = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Import HtmlWebpackPlugin

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Handle image files
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]", // Store images in 'assets' folder
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Specify the HTML template
    }),
  ],
};
