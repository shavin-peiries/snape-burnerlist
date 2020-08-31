application.register('dishes', class extends Stimulus.Controller {
	static get targets() {
		return ['newDish', 'importantDishList', 'urgentDishList', 'otherDishList', 'dishTemplate', 'dishForm']
	}

	connect() {
    this.load();
    this.newDishTarget.focus();
  }

  // Saving to the local storage
	save(section, action, data) {
    const listItems = this.loadFromLocalStorage();

    switch (section) {
      case 'Important Front Burner':
        switch (action) {
          case 'Add':
            listItems.important.push({dishName: data, ingredients: []});
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
            listItems.urgent.push({dishName: data, ingredients: []});
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

		// this.importantDishListTarget.querySelectorAll('li').forEach(function(li) {
    //   console.log('li dataset for important dish list', li.dataset);

    //   if (li.dataset.controller == 'dish') {
    //     burnerList.important.push({dishName: li.dataset.value, ingredients: []});
    //   }
    // })

    this.saveToLocalStorage(listItems);
  }

  // deleteImportantFrontBurnerDish(id) {
  //   var importantFrontBurnerData = this.loadImportantFrontBurnerData();
  // }

  // loadImportantFrontBurnerData() {
  //   return JSON.parse(localStorage.getItem('important-dish-list'));
  // }

  // When the site is loaded the load function is called to see if any data on localStorage is present
	load() {
    var listItems = this.loadFromLocalStorage();

    // if(listItems === null) {
    //   listItems = {important: [], urgent: [], other: []};
    //   this.saveToLocalStorage(listItems);

    // } else {
    //   var _this = this;

    //   listItems.important.forEach(function(dish){
    //     _this.appendDish('Important Front Burner', dish.dishName);

    //     console.log(dish.ingredients);

    //     if(dish.ingredients > 0) {
    //       dish.ingredients.forEach(function(ingredient){
    //         _this.appendIngredient('Important Front Burner', dish, ingredient);
    //       })
    //     }
    //   });

    //   listItems.urgent.forEach(function(dish){
    //     _this.appendDish('Urgent Back Burner', dish.dishName);
    //   });
    // }

    // delete if not needed
    // var importantFrontBurnerData = this.loadImportantFrontBurnerData();

		// if (importantFrontBurnerData) {
		// 	var _this = this;
		// 	importantFrontBurnerData.forEach(function(dish) {
		// 		_this.appendDish(dish.dishName, 'Important Front Burner')
		// 	})
		// }
	}

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('list-items'));
  }

  saveToLocalStorage(listItems) {
    localStorage.setItem('list-items', JSON.stringify(listItems));
  }

	// Creating a new dish
	createDish(event) {
    event.preventDefault();

    if(this.newDishTarget.value != '') {
      this.appendDish(event.target.dataset.value, this.newDishTarget.value);
      this.save(event.target.dataset.value, 'Add', this.newDishTarget.value);
      this.resetNewDishTarget();
      this.dishFormTarget.classList.add('d-none');
    }
  }

  appendDish(section, dishName) {
    if(section === 'Important Front Burner' && this.hasImportantDishListTarget) {
      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li').dataset.value = dishName;
      this.importantDishListTarget.appendChild(dish);
    } else if (section === 'Urgent Back Burner' && this.hasUrgentDishListTarget) {
      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li').dataset.value = dishName;
      this.urgentDishListTarget.appendChild(dish);
    }
  }

  showCreateDishForm(event) {
    event.preventDefault();
    this.newDishTarget.value = '';
    this.dishFormTarget.classList.remove('d-none');
    this.newDishTarget.focus();
  }

  cancelNewDish(event) {
    event.preventDefault();
    this.resetNewDishTarget();
    this.dishFormTarget.classList.add('d-none');
  }

  resetNewDishTarget() {
    this.newDishTarget.value = '';
  }

})
