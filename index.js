var express = require('express'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	path = require('path'),
	server = express();

var Projects = {
	knockout_todo : {
		title : 'Todo приложение с использованием KnockoutJS.',
		tools : ['KnockoutJS', 'Bootstrap 3', 'ES2015+']
	}
}


server.use('/public', express.static(__dirname + '/public'));
server.use(favicon(__dirname + '/public/favicon.png'));
Object.keys(Projects).forEach(function(path){
	server.use('/public', express.static(__dirname + '/' + path + '/public'));
});

server.get('/', function(req, res){
	var projects = fs.readdirSync(__dirname).filter(function(file){
		return fs.statSync(path.join(__dirname, file)).isDirectory() && !!Projects[file];
	});
	var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').replace('<--list-->', projects.map(function(project){
		return '<a href="/' + project + '" class="list-group-item"><b>' + Projects[project].title + '</b><br /><small>Инструменты: ' + Projects[project].tools.join(', ') + '</a>';
	}).join('')) + '.</small></a>';
	res.end(html);
});

server.get('/:project', function(req, res){
	var html = fs.readFileSync(path.join(__dirname, req.params.project, 'index.html'), 'utf8');
	res.end(html);
});

server.listen(3000, function(){
	console.log('Сервер запущен...');
});