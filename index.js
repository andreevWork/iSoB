var express = require('express'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	path = require('path'),
	server = express(),

/*
	*	Вместо базы или отдельного файла. Ключи объекта - имена папок с проектом.
	*/
	projects_json = {
		knockout_todo : {
			title : 'Todo приложение с использованием KnockoutJS.',
			tools : ['KnockoutJS', 'Bootstrap 3', 'ES2015+']
		},
		react_redux_shop : {
			title : 'Галлерея магазина с выбором товара, фильтрацией и сортировкой',
			tools : ['React', 'Redux', 'Bootstrap 3', 'ES2015+']
		}
	},

/*
	*	Смотрит в текущую директорию, и забирает все папки с проектами, отсеивая файлы и не нужные папки, возьмет только те проекты, которые описаны в объекте выше.
	*/
	Projects = fs.readdirSync(__dirname).filter(function(file){
		return fs.statSync(path.join(__dirname, file)).isDirectory() && !!projects_json[file];
	}),

	CommonHtml = fs.readFileSync(getPath('common.html'), 'utf8'),

	IndexHtml = fs.readFileSync(getPath('index.html'), 'utf8')
		.replace('<--list-->', getListProjects().join('')),

	html;

server.use('/public', express.static(__dirname + '/public'));
server.use(favicon(__dirname + '/public/favicon.png'));
Projects.forEach(function(path){
	server.use('/' + path + '/public', express.static(__dirname + '/' + path + '/public'));
});

server.get('/', function(req, res){ 
	res.end(IndexHtml);
});

server.get('/:project', function(req, res){
	var {project} = req.params;
	html = changeJsScriptath(getHtml(fs.readFileSync(getPath(project + '/index.html'), 'utf8'), projects_json[project].title), project);
	res.end(html);
});

server.listen(3001, function(){
	console.log('Сервер запущен...');
});

function getHtml(body, breadcrumb) {
	breadcrumb = breadcrumb || '';
	return CommonHtml.replace('<-- body -->', body).replace('<-- breadcrumb -->', breadcrumb);
}

function changeJsScriptath(html, path) {
	return html.replace('<-- path -->', path);
}

function getListProjects() {
	return Projects.map(function(project){
		return '<a href="/' + project + '" class="list-group-item"><b>' + 
			projects_json[project].title + 
			'</b><br /><small>Инструменты: ' + 
			projects_json[project].tools.join(', ') + 
			'.</small></a>';
	});
}

function getPath(file) {
	return path.join(__dirname, file)
}