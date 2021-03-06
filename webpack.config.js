const webpack = require('webpack');
const path = require('path');
// const is the new syntax for a var that doesn't change
const HtmlWebpackPlugin = require('html-webpack-plugin');
// this plugin refreshes css without refreshing the whole page.
const isProduction = process.env.NODE_ENV === 'production';
const processCss = isProduction ? '?minmize' : '';

module.exports = {

  entry: {
    // the entry are the source files from which the app will compile
    // all files used are defined here or the 'import' section of these files
    app: path.join(__dirname, 'src/js', 'app.js'),
  },

  output: {
    // this is where the compiled files will be exported to
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    // [name] is a handy one to use when there are multiple files
    publicPath: '/dist',
    // this is the public url for the app
    // the dev server will serve the app from this file
  },

  module: {
    rules: [
      // webpack only reads javascript, these loaders help it read other files
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          `css-loader${processCss}`,
          'resolve-url-loader',
          // resolves any url() stuff in the css
          'sass-loader?sourceMap',
          // ?sourceMap is needed because we are useing resolve url before
        ],
      },
      {
        // the babel loader will translate the ES6/ES2015 syntax to a syntax
        // that works in all browsers
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src/js'),
      },
    ],
  },


  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    inline: true,
    hot: true,
    // hot is needed to be able to use the HotModuleReplacementPlugin
    stats: 'errors-only',
    // this will show more readable errors in the browser console
    // it makes sure the line numbers will correspond with the src line numbers
  },


  devtool: 'cheap-module-eval-source-map',
  // this makes js errors a bit more readable in the browser developer tools
  // however there is some speed loss in the building

  plugins: isProduction ?
  [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html', 'index.html'),
      hash: true,
      chunks: ['app'],
    }),
    (new webpack.optimize.UglifyJsPlugin({ minimize: true })),
  ]
  : [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html', 'index.html'),
      // in the template you can see both are based on index.html
      // however the output is very different because of the javascript
      hash: true,
      chunks: ['app'],
      // chunks specifies which javascript files are used
    }),
    // this line activates the HotModuleReplacementPlugin
    new webpack.HotModuleReplacementPlugin(),
  ],

  resolve: {
    extensions: ['.json', '.js', '.scss'],
    // this allows us to do imports without specifying the extensions
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    // this allows us to import without writing out the complete path
  },

};
