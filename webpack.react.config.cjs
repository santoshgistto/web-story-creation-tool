/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './packages/electron-story-editor/app.js',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      !isProduction
        ? {
            test: /\.js$/,
            use: ['source-map-loader'],
            enforce: 'pre',
          }
        : {},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              // Babel uses a directory within local node_modules
              // by default. Use the environment variable option
              // to enable more persistent caching.
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
            },
          },
        ],
      },
      // These should be sync'd with the config in `.storybook/main.cjs`.
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      currentColor: /^(?!url|none)/i,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      // See https://github.com/google/web-stories-wp/pull/6361
                      currentColor: false,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './packages/playground-story-editor/public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
    new WebpackBar({
      name: 'electron-renderer',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './packages/playground-story-editor/public/preview.html',
          to: '',
        },
      ],
    }),
  ],
  output: {
    path: path.resolve(__dirname, './build/electron/renderer'),
    filename: 'js/[name].js',
    publicPath: './',
  },
};
