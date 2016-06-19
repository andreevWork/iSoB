module.exports = {
	entry : './js/app.js',
	output : {
		filename : 'main.js',
		path : __dirname + '/public'
	},
	module: {
	  loaders: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel',
	      query: {
	        presets: ['es2015'], 
			plugins: ["transform-class-properties"]
	      }
	    }
	  ]
	}
}