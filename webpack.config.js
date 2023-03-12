const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const isProd = process.env.NODE_ENV === 'production';

const getStylesSettings = (withModules = false) => {
  return [
    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
    withModules
      ? {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: isProd ? '[hash:base64]' : '[path][name]__[local]',
            },
          },
        }
      : 'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['autoprefixer'],
        },
      },
    },
    'sass-loader',
  ];
};

module.exports = {
  entry: path.join(srcPath, 'index.tsx'),
  target: isProd ? 'browserslist' : 'web',
  devtool: isProd ? 'hidden-source-map' : 'eval-source-map',
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
    }),
    !isProd && new ReactRefreshWebpackPlugin(),
    isProd &&
      new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
      }),
    new ForkTsCheckerPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.module\.s?css$/,
        use: getStylesSettings(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: getStylesSettings(),
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.jsx', '.ts'],
    alias: {
      '@components': path.join(srcPath, 'components'),
      '@config': path.join(srcPath, 'config'),
      '@styles': path.join(srcPath, 'styles'),
      '@utils': path.join(srcPath, 'utils'),
      '@App': path.join(srcPath, 'App'),
      '@pages': path.join(srcPath, 'App/pages'),
      '@store': path.join(srcPath, 'store'),
      '@rootStore': path.join(srcPath, 'rootStore'),
      '@models': path.join(srcPath, 'store/models'),
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 3003,
    hot: true,
    historyApiFallback: true,
  },
};
