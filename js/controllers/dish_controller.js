application.register('dish', class extends Stimulus.Controller {
	static get targets() {
		return ['name', 'newIngredient', 'ingredientTemplate', 'ingredientList', 'ingredientForm', 'addIngredient', 'input']
	}

	initialize() {
	}

	connect() {
		if(this.hasNameTarget){
			this.nameTarget.textContent = this.element.dataset.value;
		}
		this.newIngredientTarget.focus();
	}

	save(section, action, data) {

		var listItems = this.loadFromLocalStorage();

		switch (section) {
      case 'Important Front Burner':
        switch (action) {
          case 'Add':
            listItems.important[data.indexOfDish - 1].ingredients.push({ingredientName: data.ingredientName, status: data.status});
						this.saveToLocalStorage(listItems);
						break;
          case 'Edit':
						// to-do
						break;
          case 'Delete':
						// to-do
						break;
				}
				break;
      case 'Urgent Back Burner':
        switch (action) {
          case 'Add':
            listItems.urgent[data.indexOfDish - 1].ingredients.push({ingredientName: data.ingredientName, status: data.status});
						this.saveToLocalStorage(listItems);
						break;
          case 'Edit':
						// to-do
						break;
          case 'Delete':
						// to-do
						break;
				}
				break;
				case 'Other Burner':
					switch (action) {
						case 'Add':
							listItems.other[data.indexOfDish].ingredients.push({ingredientName: data.ingredientName, status: data.status});
							this.saveToLocalStorage(listItems);
							break;
						case 'Edit':
							// to-do
							break;
						case 'Delete':
							// to-do
							break;
					}
					break;
    }
	}

	loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('list-items'));
  }

  saveToLocalStorage(listItems) {
    localStorage.setItem('list-items', JSON.stringify(listItems));
	}

	createIngredient(event) {
		event.preventDefault();

		var sectionOfIngredient = this.element.parentNode.dataset.target;

		var indexOfDish = Array.from(this.element.parentNode.children).indexOf(this.element);
		console.log(indexOfDish);

		switch (sectionOfIngredient) {
			case 'burnerlist.importantDishList dishes.importantDishList':
				sectionOfIngredient = 'Important Front Burner';
				break;
			case 'burnerlist.urgentDishList dishes.urgentDishList':
				sectionOfIngredient = 'Urgent Back Burner';
				break;
			case 'burnerlist.otherDishList dishes.otherDishList':
				sectionOfIngredient = 'Other Burner';
				break;
		}

		if (this.newIngredientTarget.value != '') {
			this.appendIngredient(this.newIngredientTarget.value, false);
			this.save(sectionOfIngredient, 'Add', {indexOfDish: indexOfDish, ingredientName: this.newIngredientTarget.value, status: false});
			this.clearNewIngredient();
		}
  }

  // Appending the todo into the list of todos
	appendIngredient(ingredientName, status) {
		var ingredient = document.importNode(this.ingredientTemplateTarget.content, true);
		ingredient.querySelector('li').dataset.value = ingredientName

    if (status) {
			ingredient.querySelector('li').setAttribute('data-completed', '')
    }

		this.ingredientListTarget.appendChild(ingredient);
	}

	showAddIngredient() {
		this.addIngredientTarget.classList.add('d-none');
		this.ingredientFormTarget.classList.remove('d-none');

		if (this.newIngredientTarget.value != '') {
			this.newIngredientTarget.select();
		} else {
			this.newIngredientTarget.focus();
		}
	}

	clearNewIngredient() {
		this.newIngredientTarget.value = '';
	}

	cancelNewIngredient() {
		this.ingredientFormTarget.classList.add('d-none');
		this.addIngredientTarget.classList.remove('d-none');
	}

	editDish() {
		this.inputTarget.value = this.element.dataset.value;
		this.element.classList.add('dish--editing');
		this.inputTarget.select();
	}

	removeDish() {
		this.element.parentNode.removeChild(this.element);
	}

	// used to trigger an event that's caught in the html and then run in the parent controller
	change() {
		var event = new Event('todo.change');
		this.element.dispatchEvent(event);
	}

	update(event) {
		event.preventDefault();

		if (this.inputTarget.value != '') {
			this.element.dataset.value = this.inputTarget.value;
			this.nameTarget.textContent = this.inputTarget.value;
			this.element.classList.remove('dish--editing');
			this.change();
		} else {
			this.destroy();
		}
	}

	keyup(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			this.inputTarget.value = this.element.dataset.value;
			this.element.classList.remove('dish--editing');
		}
	}

	keyupNewIngredient(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			this.cancelNewIngredient();
		}
	}

})
