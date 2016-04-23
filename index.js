var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	server = express();

server.get('/', function(req, res){
	var projects = fs.readdirSync(__dirname).filter(function(file){
		return fs.statSync(path.join(__dirname, file)).isDirectory() && file !== 'node_modules' && file[0] !== '.';
	});
	var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').replace('<--list-->', projects.map(function(project){
		return '<a href="/' + project + '" class="list-group-item">' + getTitle(project) + '</a>';
	}).join(''));
	res.end(html);
});

server.get('/:project', function(req, res){
	var html = fs.readFileSync(path.join(__dirname, req.params.project, 'index.html'), 'utf8');
	res.end(html);
});

function getTitle(project){
	var map = {
		knockout_todo : {
			title : 'Todo приложение с использованием KnockoutJS.'
		}
	}

	return map[project].title;
}

server.listen(3000);