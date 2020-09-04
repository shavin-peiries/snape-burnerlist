application.register('dish', class extends Stimulus.Controller {

	static get targets() {
		return ['dishName', 'newIngredient', 'ingredientTemplate', 'ingredientList', 'ingredientForm', 'addIngredient', 'dishEditInput']
	}

	connect() {
		if(this.hasDishNameTarget){
			this.dishNameTarget.textContent = this.element.dataset.value;
		}

		if(this.element.hasAttribute('data-new')){
			this.showAddIngredient();
		}
	}

	modify(section, data) {
		var listItems = this.loadFromLocalStorage();

		switch (section) {
      case 'Important Front Burner':
				listItems.important[data.indexOfDish - 1].ingredients.push({ingredientName: data.ingredientName, status: data.status});
				this.saveToLocalStorage(listItems);
				break;
      case 'Urgent Back Burner':
				listItems.urgent[data.indexOfDish - 1].ingredients.push({ingredientName: data.ingredientName, status: data.status});
				this.saveToLocalStorage(listItems);
				break;
			case 'Other Burner':
				listItems.other[data.indexOfDish].ingredients.push({ingredientName: data.ingredientName, status: data.status});
				this.saveToLocalStorage(listItems);
				break;
    }
	}

	updateLocalStorage() {
		var listItems = {important: [], urgent: [], other: []};

		const importantList = document.querySelector('[data-target="dishes.importantDishList"]').querySelectorAll('li.dish');
		const urgentList = document.querySelector('[data-target="dishes.urgentDishList"]').querySelectorAll('li.dish');
		const otherList = document.querySelector('[data-target="dishes.otherDishList"]').querySelectorAll('li.dish');

		listItems = this.updateListItems(importantList, 'Important Front Burner', listItems);
		listItems = this.updateListItems(urgentList, 'Urgent Back Burner', listItems);
		listItems = this.updateListItems(otherList, 'Other Burner', listItems);

		this.saveToLocalStorage(listItems);
	}

	updateListItems(list, section, listItems) {
		list.forEach((dish)=> {
			var data = {
				dishName: '',
				ingredients: []
			};

			if (section === 'Other Burner') {
				data.dishName = 'Kitchen Sink';
			} else {
				data.dishName = dish.dataset.value;
			}

			const ingredients = dish.querySelectorAll('li.ingredient');

			if(ingredients.length > 0) {
				ingredients.forEach((ingredient) => {
					data.ingredients.push({ingredientName: ingredient.dataset.value, status: ingredient.hasAttribute('data-completed')});
				});
			}

			switch (section) {
				case 'Important Front Burner':
					listItems.important.push(data);
					break;
				case 'Urgent Back Burner':
					listItems.urgent.push(data);
					break;
				case 'Other Burner':
					listItems.other.push(data);
					break;
			}
		});

		return listItems;
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

		switch (sectionOfIngredient) {
			case 'dishes.importantDishList':
				sectionOfIngredient = 'Important Front Burner';
				break;
			case 'dishes.urgentDishList':
				sectionOfIngredient = 'Urgent Back Burner';
				break;
			case 'dishes.otherDishList':
				sectionOfIngredient = 'Other Burner';
				break;
		}

		if (this.newIngredientTarget.value != '') {
			this.appendIngredient(this.newIngredientTarget.value, false);
			this.modify(sectionOfIngredient, {indexOfDish: indexOfDish, ingredientName: this.newIngredientTarget.value, status: false});
			this.clearNewIngredient();
		}
  }

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

		if(this.element.hasAttribute('data-new')){
			this.element.removeAttribute('data-new');
		}
	}

	clearNewIngredient() {
		this.newIngredientTarget.value = '';
	}

	cancelNewIngredient(event) {
		event.preventDefault();

		this.ingredientFormTarget.classList.add('d-none');
		this.addIngredientTarget.classList.remove('d-none');
	}

	cancelEditDish(event) {
		event.preventDefault();

		this.dishEditInputTarget.value = '';
		this.element.classList.remove('dish--editing');
	}

	showDishEditForm() {
		this.dishEditInputTarget.value = this.element.dataset.value;
		this.element.classList.add('dish--editing');
		this.dishEditInputTarget.select();
	}

	removeDish() {
		this.element.parentNode.removeChild(this.element);
		this.updateLocalStorage();
	}

	editDish(event) {
		event.preventDefault();

		if (this.dishEditInputTarget.value != '') {
			this.element.dataset.value = this.dishEditInputTarget.value;
			this.dishNameTarget.textContent = this.dishEditInputTarget.value;
			this.element.classList.remove('dish--editing');
			this.updateLocalStorage();
		}
	}

	keyupOnEscToCancelEditDish(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			this.dishEditInputTarget.value = this.element.dataset.value;
			this.element.classList.remove('dish--editing');
		}
	}

	keyupNewIngredientCancel(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			this.cancelNewIngredient(event);
		}
	}

})
