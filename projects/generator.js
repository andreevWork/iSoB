var rl = require('readline').createInterface(process.stdin, process.stdout),
    path = require('path'),
    fs = require('fs'),

    project_name = '',
    projects_json = JSON.parse(fs.readFileSync('projects.json', 'utf8')),

    steps = [
        {
            question: 'Как назовем новый проект? ',
            callback: (answer) => {
                project_name = answer;

                // Создаем папку проекта
                fs.mkdirSync(getPath(project_name));

                // В ней создаем папку для скриптов разработки
                fs.mkdirSync(getPath(`${project_name}/js`));
                // И папку для подключаемых файлов
                fs.mkdirSync(getPath(`${project_name}/public`));

                // Создаем конфиг из шаблонного конфига
                fs.writeFileSync(getPath(`${project_name}/webpack.config.js`), fs.readFileSync('examples/webpack.config.example.js'));
                // Создаем пустой файл стилей, в него добавляются специфичные стили
                fs.writeFileSync(getPath(`${project_name}/public/main.css`), '');
                // Создаем пустой js файл - точка входа в наше приложение
                fs.writeFileSync(getPath(`${project_name}/js/app.js`), '');

                // Создаем jade шаблон для проекта
                fs.writeFileSync(getPath(`views/${project_name}.jade`), fs.readFileSync('examples/example.jade'));

                projects_json[project_name] = {};
            }
        },
        {
            question: 'Что он из себя представляет? ',
            callback: (answer) => {
                projects_json[project_name].title = answer;

            }
        },
        {
            question: 'Что будет использоваться в разработке? ',
            callback: (answer) => {
                projects_json[project_name].tools = answer.split(', ');
            }
        }
    ],
    current_index = 0;

rl
    .on('line', function(answer) {
        steps[current_index].callback(answer);
        current_index++;

        if(current_index < steps.length) {
            askQuestion(steps[current_index].question);
        } else {
            fs.writeFileSync('projects.json', JSON.stringify(projects_json, null, 4));
            rl.close();
        }
    })
    .on('close',function(){
        process.exit(0);
    });

askQuestion(steps[current_index].question);

function askQuestion(question) {
    rl.setPrompt(question);
    rl.prompt();
}

function getPath(p) {
    return path.join(__dirname, '../', p);
}