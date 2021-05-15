application.register('ingredient', class extends Stimulus.Controller {
	static get targets() {
		return ['toggle', 'label', 'ingredientEditInput' ]
	}

	connect() {
		this.labelTarget.textContent = this.element.dataset.value;

		if (this.element.hasAttribute('data-completed')) {
			this.element.classList.add('completed');
			this.toggleTarget.checked = true;
		}
	}

	toggle(event) {
		if (event.target.checked) {
			this.element.setAttribute('data-completed', '');
			this.element.classList.add('completed');
		} else {
			this.element.removeAttribute('data-completed');
			this.element.classList.remove('completed');
		}
		this.change();
	}

	edit() {
		this.ingredientEditInputTarget.value = this.element.dataset.value;
		this.element.classList.add('editing');
		this.ingredientEditInputTarget.select();
	}

	update(event) {
		event.preventDefault();
		if (this.ingredientEditInputTarget.value != '') {
			this.element.dataset.value = this.ingredientEditInputTarget.value;
			this.labelTarget.textContent = this.ingredientEditInputTarget.value;
			this.element.classList.remove('editing');
			this.change();
		};
	}

	keyup(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			this.ingredientEditInputTarget.value = this.element.dataset.value;
			this.element.classList.remove('editing');
		}
	}

	destroy() {
		// Thhere is the margin bottom because offsetHeight doesn't capture it
		this.element.style.height = this.element.offsetHeight + 8 + "px";

		this.element.classList.remove('new-item');
		this.element.classList.add('remove-item');

		setTimeout(() => {
			this.element.parentNode.removeChild(this.element);
			this.change();
		}, 400);

	}

	change() {
		var event = new Event('ingredient.change');
		this.element.dispatchEvent(event);
	}

	cancelIngredientUpdate() {
		this.element.classList.remove('editing');
	}
})
