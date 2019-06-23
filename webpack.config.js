const path = require('path')
const nodeExternals = require('webpack-node-externals')


const back={
	target: "node",
	context: __dirname,
  devtool: "source-map",
  entry: "./app.js",
  externals: [nodeExternals()],
  resolve: {
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },

    ]
  },
	output: {
        path: __dirname + "/dist/",
        filename: "build.js"
    },

};

const front = {
  target: 'node',
  mode:"production",
	context: __dirname,
  devtool: "source-map",
  entry: "./src/js/all.js",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        exclude:path.resolve(__dirname, "node_modules"),
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  output: {
		path: path.resolve(__dirname, "build"),
		filename: "bundle-front.js",
  }
}
//module.exports = [front, back ];
module.exports = [front ];

