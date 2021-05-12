application.register('burnerlist', class extends Stimulus.Controller {
	static get targets() {
    return ['focus', 'focusText']
	}

	connect() {
    this.load();
    this.loadFocus();
	}

	load() {

    var listItems = this.loadFromLocalStorage();

    if(listItems === null) {
      $('#firstTimeVisitModal').modal('show');

      listItems = {important: [], urgent: [], other: [{dishName: 'Kitchen Sink', ingredients: []}]};
      this.saveToLocalStorage(listItems);
    } else {
      var _this = this;

      listItems.important.forEach(function(dish){
        _this.appendDishToDocument('Important Back Burner', dish);
      });

      listItems.urgent.forEach(function(dish){
        _this.appendDishToDocument('Urgent Front Burner', dish);
      });

      listItems.other.forEach(function(dish){
        _this.appendDishToDocument('Other Burner', dish);
      })
    }
  }

  saveFocusState(focusState) {
    localStorage.setItem('focusState', focusState);
  }

  loadFocus() {
    if(localStorage.getItem('focusState')) {
      var focusState = localStorage.getItem('focusState');

      if (focusState == 'true') {
        this.focusTarget.classList.add('focusing');
        this.focusTextTarget.textContent = 'Turn off Focus Mode';
      } else if (focusState == 'false') {
        this.focusTarget.classList.remove('focusing');
        this.focusTextTarget.textContent = 'Turn on Focus Mode';
      }
    } else {
      this.focusTextTarget.textContent = 'Turn on Focus Mode';
    }
  }

  toggleFocus() {
    if (this.focusTextTarget.textContent == 'Turn on Focus Mode') {
      this.focusTarget.classList.add('focusing');
      this.saveFocusState(true);
      this.focusTextTarget.textContent = 'Turn off Focus Mode';
    } else {
      this.focusTarget.classList.remove('focusing');
      this.saveFocusState(false);
      this.focusTextTarget.textContent = 'Turn on Focus Mode';
    }

  }

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('list-items'));
  }

  saveToLocalStorage(listItems) {
    localStorage.setItem('list-items', JSON.stringify(listItems));
  }

  appendDishToDocument(section, dishData) {
    var dishTemplate = document.querySelector('[data-target="dishes.dishTemplate"]')

    if(section === 'Important Back Burner') {
      var dish = document.importNode(dishTemplate.content, true);
      dish.querySelector('li').dataset.value = dishData.dishName;

      var importantDishList = document.querySelector('.important-dish-list');
      importantDishList.appendChild(dish);

      var appendedDish = importantDishList.querySelector('.dish:last-child');
      this.appendIngredientsToBody(appendedDish, dishData.ingredients);

    } else if (section === 'Urgent Front Burner') {
      var dish = document.importNode(dishTemplate.content, true);
      dish.querySelector('li').dataset.value = dishData.dishName;

      var urgentDishList = document.querySelector('.urgent-dish-list');
      urgentDishList.appendChild(dish);

      var appendedDish = urgentDishList.querySelector('.dish:last-child');
      this.appendIngredientsToBody(appendedDish, dishData.ingredients);

    } else if (section === 'Other Burner') {
      var otherDishList = document.querySelector('.other-dish-list');

      var appendedDish = otherDishList.querySelector('.dish:last-child');
      this.appendIngredientsToBody(appendedDish, dishData.ingredients);
    }
  }

  appendIngredientsToBody(dish, ingredients) {
    var appendedDishIngredientBody = dish.querySelector('.dish--ingredient-list');

    var ingredientTemplate = document.querySelector('[data-target="dish.ingredientTemplate"]');
    if (ingredients.length > 0) {
      ingredients.forEach(function(ingredientData){
        var ingredient = document.importNode(ingredientTemplate.content, true);
        ingredient.querySelector('li').dataset.value = ingredientData.ingredientName;

        if (ingredientData.status) {
          ingredient.querySelector('li').setAttribute('data-completed', '')
        }

        appendedDishIngredientBody.appendChild(ingredient);
      })
    }
  }
})
