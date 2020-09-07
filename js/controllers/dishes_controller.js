application.register('dishes', class extends Stimulus.Controller {
	static get targets() {
		return ['newDishInput', 'importantDishList', 'urgentDishList', 'otherDishList', 'dishTemplate', 'dishForm']
	}

	connect() {
    this.newDishInputTarget.focus();
  }

	modify(section, data) {
    const listItems = this.loadFromLocalStorage();

    switch (section) {
      case 'Important Back Burner':
        listItems.important.push({dishName: data, ingredients: []});
        this.saveToLocalStorage(listItems);
        break;
      case 'Urgent Front Burner':
        listItems.urgent.push({dishName: data, ingredients: []});
        this.saveToLocalStorage(listItems);
        break;
    }

    this.saveToLocalStorage(listItems);
  }

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('list-items'));
  }

  saveToLocalStorage(listItems) {
    localStorage.setItem('list-items', JSON.stringify(listItems));
  }

	createDish(event) {
    event.preventDefault();

    if(this.newDishInputTarget.value != '') {
      var section = event.target.dataset.value;

      this.appendDishToDocument(section, this.newDishInputTarget.value);
      this.modify(section, this.newDishInputTarget.value);
      this.resetNewDishInputTarget();
      this.dishFormTarget.classList.add('d-none');
    }
  }

  appendDishToDocument(section, dishName) {
    if(section === 'Important Back Burner' && this.hasImportantDishListTarget) {
      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li.dish').dataset.value = dishName;
      dish.querySelector('li.dish').setAttribute('data-new', '');
      this.importantDishListTarget.appendChild(dish);
    } else if (section === 'Urgent Front Burner' && this.hasUrgentDishListTarget) {
      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li.dish').dataset.value = dishName;
      dish.querySelector('li.dish').setAttribute('data-new', '');
      this.urgentDishListTarget.appendChild(dish);
    }
  }

  showCreateDishForm(event) {
    event.preventDefault();

    this.newDishInputTarget.value = '';
    this.dishFormTarget.classList.remove('d-none');
    this.newDishInputTarget.focus();
  }

  cancelNewDishInput(event) {
    event.preventDefault();

    this.resetNewDishInputTarget();
    this.dishFormTarget.classList.add('d-none');
  }

  resetNewDishInputTarget() {
    this.newDishInputTarget.value = '';
  }

})
