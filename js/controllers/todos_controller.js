application.register('todos', class extends Stimulus.Controller {
	static get targets() {
		return ['newDish', 'newTodo', 'todoList', 'todoTemplate', 'main']
	}

	connect() {
		this.load();
		this.updateLayout();
	}

	// Saving to the local storage
	save() {
		var data = [];

		this.todoListTarget.querySelectorAll('li').forEach(function(li) {
			data.push({title: li.dataset.value, completed: li.hasAttribute('data-completed')})
		})

		localStorage.setItem('todos-stimulus', JSON.stringify(data));
	}

	// When the site is loaded the load function is called to see if any data on localStorage is present
	load() {
		var data = JSON.parse(localStorage.getItem('todos-stimulus'));
		if (data) {
			var _this = this;
			data.forEach(function(todo) {
				_this.appendTodo(todo.title, todo.completed)
			})
		}
	}

	// Appending the todo into the list of todos
	appendTodo(title, completed) {
		var todo = document.importNode(this.todoTemplateTarget.content, true);
		todo.querySelector('li').dataset.value = title
		if (completed) {
			todo.querySelector('li').setAttribute('data-completed', '')
		}
		this.todoListTarget.appendChild(todo);
	}

	updateLayout() {
		this.updateMain();
	}

	updateMain() {
		if (this.todoListTarget.querySelectorAll('li').length) {
			this.mainTarget.classList.remove('hidden');
		} else {
			this.mainTarget.classList.add('hidden');
		}
	}

	updateClearButton() {
		if (this.todoListTarget.querySelectorAll('li[data-completed]').length) {
			this.clearCompletedButtonTarget.classList.remove('hidden');
		} else {
			this.clearCompletedButtonTarget.classList.add('hidden');
		}
	}

	// Creating a new dish
	createDish(event) {
		event.preventDefault();

		console.log(this.newDishTarget.value);

		this.newDishTarget.value = '';
	}

	// Creating a new todo
	createTodo(event) {
		event.preventDefault();

		if (this.newTodoTarget.value != '') {
			// Sending the to do to appendTodo function with the value and the completed status
			this.appendTodo(this.newTodoTarget.value, false);

			// Resetting the value of the newToDo field
			this.newTodoTarget.value = '';

			// Updating everything when a new to do is added
			this.todoChange();
		}
	}

	// Calling functions when a new to do is added
	todoChange() {
		this.updateLayout();
		this.save();
	}

	toggleAll(event) {
		if (event.target.checked) {
			this.todoListTarget.querySelectorAll('[data-action="todo#toggle"]:not(:checked)').forEach(function(toggle) {
				toggle.checked = true;
				toggle.dispatchEvent(new Event('change'));
			})
		} else {
			this.todoListTarget.querySelectorAll('[data-action="todo#toggle"]').forEach(function(toggle) {
				toggle.checked = false;
				toggle.dispatchEvent(new Event('change'));
			})
		}
	}



})
