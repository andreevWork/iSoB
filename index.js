var express = require('express'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	path = require('path'),
	server = express();


server.use('/public', express.static(__dirname + '/public'));
server.use('/public', express.static(__dirname + '/knockout_todo/public'));
server.use(favicon(__dirname + '/public/favicon.png'));

server.get('/', function(req, res){
	var projects = fs.readdirSync(__dirname).filter(function(file){
		return fs.statSync(path.join(__dirname, file)).isDirectory() && !!Projects[file];
	});
	var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').replace('<--list-->', projects.map(function(project){
		return '<a href="/' + project + '" class="list-group-item">' + Projects[project].title + '</a>';
	}).join(''));
	res.end(html);
});

server.get('/:project', function(req, res){
	var html = fs.readFileSync(path.join(__dirname, req.params.project, 'index.html'), 'utf8');
	res.end(html);
});

var Projects = {
	knockout_todo : {
		title : 'Todo приложение с использованием KnockoutJS.'
	}
}

server.listen(3000, function(){
	console.log('Сервер запущен...');
});