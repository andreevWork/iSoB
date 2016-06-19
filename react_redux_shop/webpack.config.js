module.exports = {
	entry : ['babel-polyfill', './js/app.js'],
	output : {
		filename : 'main.js',
		path : __dirname + '/public'
	},
	module: {
	  loaders: [
	    {
	      test: /\.jsx?$/,
	      exclude: /(node_modules)/,
	      loader: 'babel',
	      query: {
	        presets: ['es2015', 'react'],
			plugins: ["transform-class-properties"]
	      }
	    }
	  ]
	}
}