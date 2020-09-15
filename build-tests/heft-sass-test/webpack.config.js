'use strict';

const path = require('path');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('node-sass');

/**
 * If the "--production" command-line parameter is specified when invoking Heft, then the
 * "production" function parameter will be true.  You can use this to enable bundling optimizations.
 */
function createWebpackConfig({ production }) {
  const webpackConfig = {
    // Documentation: https://webpack.js.org/configuration/mode/
    mode: production ? 'production' : 'development',
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(scss|sass|css)$/,
          exclude: /node_modules/,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true
              }
            },
            // Autoprefix CSS
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [new Autoprefixer()]
                }
              }
            },
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'node_modules')]
                }
              }
            }
          ]
        }
      ]
    },
    entry: {
      app: path.join(__dirname, 'lib', 'index.js'),

      // Put these libraries in a separate vendor bundle
      vendor: ['react', 'react-dom']
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name]_[contenthash].js',
      devtoolModuleFilenameTemplate: 'webpack:///../[resource-path]',
      devtoolFallbackModuleFilenameTemplate: 'webpack:///../[resource-path]?[hash]'
    },
    performance: {
      // This specifies the bundle size limit that will trigger Webpack's warning saying:
      // "The following entrypoint(s) combined asset size exceeds the recommended limit."
      maxEntrypointSize: 250000,
      maxAssetSize: 250000
    },
    devtool: production ? undefined : 'source-map',
    plugins: [
      // See here for documentation: https://github.com/jantimon/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: 'assets/index.html'
      })
    ]
  };

  return webpackConfig;
}

module.exports = createWebpackConfig;
