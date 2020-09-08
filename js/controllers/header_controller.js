application.register('header', class extends Stimulus.Controller {
	static get targets() {
		return ['date', 'time', 'name', 'editNameInput']
	}

	connect() {
    this.load();
    this.getTime();
    this.getDate();
  }

  save(name) {
    localStorage.setItem('name', name);
  }

  load() {
    if(localStorage.getItem('name')) {
      var name = this.parseName(localStorage.getItem('name'));
      this.nameTarget.value = name;
    }
  }

  getTime() {
    this.timeTarget.textContent = `${this.formatAMPM(this.getCurrentDate())}`;

    setInterval(() => {
      this.timeTarget.textContent = `${this.formatAMPM(this.getCurrentDate())}`;
    }, (60 - this.getCurrentDate()) * 1000);
  }

  getDate() {
    this.dateTarget.textContent = `${this.getDayName()} ${this.getMonth()} ${this.getCurrentDate().getDate()}`;
  }

  getMonth() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthName = months[this.getCurrentDate().getMonth()];

    return monthName;
  }

  getDayName() {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = days[this.getCurrentDate().getDay()];

    return dayName;
  }

  getCurrentDate() {
    var currentDate = new Date();

    return currentDate;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
  }

  editName() {
		this.element.classList.add('editing');
    this.editNameInputTarget.select();
	}

  updateName(event) {
    event.preventDefault();

    if(this.editNameInputTarget.value != ''){
      this.save(this.editNameInputTarget.value);
      this.parseName(this.editNameInputTarget.value);
			this.element.classList.remove('editing');
    }
  }

  cancelNameUpdate() {
    this.element.classList.remove('editing');
    this.editNameInputTarget.value = '';
  }

  parseName(name) {
    var appendedName;

    if(name.endsWith('s')){
      appendedName = name + '\'';
    } else {
      appendedName = name + '\'s';
    }

    this.nameTarget.textContent = appendedName;
    this.changeDocumentTitle(appendedName);
  }

  changeDocumentTitle(name) {
    document.title = `${name} Burner List`;
  }

})
