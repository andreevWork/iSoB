var express = require('express'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	path = require('path'),
	jade = require('jade'),
	server = express(),

	projects_json = JSON.parse(fs.readFileSync('projects/projects.json', 'utf8')),
	projects = Object.keys(projects_json);

server.set('view engine', 'jade');
server.set('views', './views');

server.use('/public', express.static(__dirname + '/public'));
server.use(favicon(__dirname + '/public/favicon.png'));

projects.forEach(function(path){
    projects_json[path].tools = projects_json[path].tools.join(', ');
	server.use('/' + path + '/public', express.static(__dirname + '/' + path + '/public'));
});


server.get('/', function(req, res){
	res.render('index', {
        projects: projects_json,
        path_to_style: 'public/css/main.css'
    });
});

server.get('/:project', function(req, res){
	let {project} = req.params;
    
    res.render(project, {
        title: projects_json[project].title,
        path_to_style: project + '/public/main.css',
        path_to_script: project + '/public/main.js'
    });
});

server.listen(3001, function(){
	console.log('Сервер запущен...');
});