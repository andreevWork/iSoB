import ko from 'knockout';

var ViewModel = function() {
    this.task = ko.observable();
    this.prior = ko.observable();
	this.tasks = ko.observableArray([]);

	this.click = function(data,event){
		if (!this.task()) return;
		this.tasks.push({ title : this.task(), prior : ko.observable(this.prior()), is_completed : ko.observable(false), edit : ko.observable(false)});
		this.task('');
		this.tasks.sort(function(t1, t2){
			if(t1.prior() == 'red' && t2.prior() !== 'red'){
				return -1;
			}
			if(t2.prior() == 'red' && t1.prior() !== 'red'){
				return 1;
			}
			if(t1.prior() == 'blue' && t2.prior() !== 'blue'){
				return -1;
			}
			if(t2.prior() == 'blue' && t1.prior() !== 'blue'){
				return 1;
			}
			return 0
		})
		console.log(this.tasks());
	}

	this.getTitleButton = (task) => !task.is_completed() ? ' Завершить' : 'Возобновить';

	this.getTitleEdit = (task) => !task.edit() ? ' Изменить' : 'Сохранить';

	this.toggleComplete = (task) => task.is_completed(!task.is_completed());

	this.toggleEdit = (task) => task.edit(!task.edit());

	this.getClass = (task) => {
		var map = {
			red : 'list-group-item-danger',
			blue : 'list-group-item-info',
			green : 'list-group-item-success'
		}
		return task.is_completed() ? 'disabled' : map[task.prior()];
	};
};
 
window.onload = () => ko.applyBindings(new ViewModel());