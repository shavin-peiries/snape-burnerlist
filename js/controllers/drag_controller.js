application.register('drag', class extends Stimulus.Controller {
	connect() {
    this.sortable = Sortable.create(this.element, {
			handle: '.drag-handle',
			animation: 150,
			ghostClass: 'drag-background-class',
			onEnd: this.end.bind(this)
		});
	}

	end(event) {
		var x = new Event('drag.change');
		console.log(event.item.dispatchEvent(x));
	}

})
