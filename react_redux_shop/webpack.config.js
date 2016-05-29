module.exports = {
	entry : './js/app.js',
	output : {
		filename : 'index.js',
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