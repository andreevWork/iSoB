import ko from 'knockout';

var ViewModel = function() {
    this.task = ko.observable();
	this.tasks = ko.observableArray([]);

	this.click = function(data,event){
		this.tasks.push({ title : this.task(), is_completed : ko.observable(false)});
		this.task('');
	}

	this.getTitleButton = (task) => !task.is_completed() ? ' Завершить' : 'Возобновить';

	this.toggleComplete = (task) => task.is_completed(!task.is_completed());
};
 
window.onload = () => ko.applyBindings(new ViewModel());