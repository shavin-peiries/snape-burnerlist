application.register('burnerlist', class extends Stimulus.Controller {
	static get targets() {
    return ['importantDishList', 'urgentDishList', 'otherDishList', 'dishTemplate', 'ingredientTemplate', 'ingredientList']
	}

	connect() {
    this.load();
	}

  // When the site is loaded the load function is called to see if any data on localStorage is present
	load() {
    var listItems = this.loadFromLocalStorage();

    if(listItems === null) {
      listItems = {important: [], urgent: [], other: [{dishName: 'Kitchen Sink', ingredients: []}]};
      this.saveToLocalStorage(listItems);

    } else {
      var _this = this;

      listItems.important.forEach(function(dish){
        _this.appendDish('Important Front Burner', dish);
      });

      listItems.urgent.forEach(function(dish){
        _this.appendDish('Urgent Back Burner', dish);
      });

      listItems.other.forEach(function(dish){
        _this.appendDish('Other Burner', dish);
      })
    }
  }

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('list-items'));
  }

  saveToLocalStorage(listItems) {
    localStorage.setItem('list-items', JSON.stringify(listItems));
  }

  appendDish(section, dishData) {
    var _this = this;

    if(section === 'Important Front Burner' && this.hasImportantDishListTarget) {

      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li').dataset.value = dishData.dishName;

      _this.importantDishListTarget.appendChild(dish);

      var appendedDish = _this.importantDishListTarget.querySelector('.dish:last-child');

      this.appendIngredient(appendedDish, dishData.ingredients);

    } else if (section === 'Urgent Back Burner' && this.hasUrgentDishListTarget) {
      var dish = document.importNode(this.dishTemplateTarget.content, true);
      dish.querySelector('li').dataset.value = dishData.dishName;
      _this.urgentDishListTarget.appendChild(dish);

      var appendedDish = _this.urgentDishListTarget.querySelector('.dish:last-child');

      this.appendIngredient(appendedDish, dishData.ingredients);
    } else if (section === 'Other Burner' && this.hasOtherDishListTarget) {

      var appendedDish = _this.otherDishListTarget.querySelector('.dish:last-child');
      this.appendIngredient(appendedDish, dishData.ingredients);
    }
  }

  appendIngredient(dish, ingredients) {
    var _this = this;

    var appendedDishIngredientBody = dish.querySelector('.dish--ingredient-list');

    if (ingredients.length > 0) {
      ingredients.forEach(function(ingredientData){
        var ingredient = document.importNode(_this.ingredientTemplateTarget.content, true);
        ingredient.querySelector('li').dataset.value = ingredientData.ingredientName;

        if (ingredientData.status) {
          ingredient.querySelector('li').setAttribute('data-completed', '')
        }

        appendedDishIngredientBody.appendChild(ingredient);
      })
    }
  }


})
