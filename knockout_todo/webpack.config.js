module.exports = {
	entry : './js/app.js',
	output : {
		filename : 'index.js',
		path : __dirname + '/public'
	},
	module: {
	  loaders: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel',
	      query: {
	        presets: ['es2015']
	      }
	    }
	  ]
	}
}