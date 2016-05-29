import ko from 'knockout';

var Task = function({ title = '', is_completed = ko.observable(false), edit = ko.observable(false)} = {}){
	return {
		title,
		is_completed,
		edit,
		id : Task.counter++
	}
}

Task.counter = 0;

class Tasks {
	constructor(){
		this.prior_array = [{ title: 'Срочная', code: '1'}, {title: 'Важная', code: '2'}, {title: 'Второстепенная', code: '3'}];

		ko.extenders.isValidTitle = this.isValidTitle.bind(this);
		this.task = ko.observable().extend({isValidTitle : true});
	    this.prior = ko.observable(this.prior_array[1].code);

		this.list = ko.observableArray(this.prior_array.map(prior => ({tasks : ko.observableArray([new Task()]), prior : prior.code }) ));

		this.hint_input = ko.computed(() => {
			var length = (this.task() && this.task().trim().length) || 0;
			return length > this.max_length ? `Вы превысили лимит длины названия задачи на ${length - this.max_length}.` : `У вас осталось ${this.max_length - length} символов.`;
		});

		this.toggleComplete = this.toggleComplete.bind(this);
	}

	isValidTitle(title) {
		var max = this.max_length;
	   	title.isValid = ko.observable(this.error_messages.empty);
		title.subscribe((newValue) => {
	   		title.isValid = ko.observable(false);
			if (!newValue.trim()) {
				title.isValid(this.error_messages.empty);
			}

			if(newValue.trim().length > max) {
				title.isValid(this.error_messages.long);
			}
	    });
		return title;
	}

	addTask() {
		if(!!this.task.isValid()) return alert(this.task.isValid());

		var task = this.task().trim(),
			list = this.getTasksByPrior(this.prior());

		//Если это первая задача, необходимо удалить моковую задачу c пустым заголовком
		if(this.isEmptyListByPrior(this.prior())){
			list.tasks.pop();
		}

		list.tasks.push( new Task({ title : task}) );
		this.task('');
	}

	getTitleButton(task){
		return !task.is_completed() ? ' Завершить' : 'Возобновить';
	}

	getTitleEdit(task) {
		return !task.edit() ? ' Изменить' : 'Сохранить';
	}

	toggleComplete(task) {
		task.is_completed(!task.is_completed())
		this.sortLists();
	}

	sortLists() {
		ko.utils.arrayForEach(this.list(), (list) => {
			var tasks = list.tasks();
			//Сортировка по айдишникам
			tasks
			.sort(function(t1, t2){
				if(t1.id > t2.id){
					return 1;
				}

				if(t1.id && t2.id){
					return -1;
				}
			})
			//Сортировка чтобы выполненные задачи были внизу списка
			.sort(function(t1, t2){
				if(t1.is_completed() && !t2.is_completed()){
					return 1;
				}

				if(!t1.is_completed() && t2.is_completed()){
					return -1;
				}
			});
			list.tasks(tasks);
		});
	}

	toggleEdit(task) {
		task.edit(!task.edit());
	}

	getTasksByPrior(prior) {
		return ko.utils.arrayFirst(this.list(), (tasks) => {
			return tasks.prior == prior;
		});
	}

	isEmptyListByPrior(prior) {
		var list =  this.getTasksByPrior(prior);
		return list.tasks().length === 1 && !list.tasks()[0].title;
	}

	getClass(prior, is_completed) {
		var map = {
			1 : 'list-group-item-danger',
			2 : 'list-group-item-info',
			3 : 'list-group-item-success'
		}
		return map[prior] + (this.isEmptyListByPrior(prior) ? ' empty-task' : '') + (is_completed() ? ' disabled' : '');
	}

	error_messages = {
		'empty' : 'Ну напиши хоть что-нибудь!',
		'long' : 'Превышен лимит символов!',
	};

	max_length = 25;
}

window.onload = () => {
	ko.applyBindings(new Tasks());
}