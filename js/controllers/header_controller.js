application.register('header', class extends Stimulus.Controller {
	static get targets() {
		return ['date', 'time', 'name', 'nameInput']
	}

	connect() {
    this.getTime();
    this.getDate();
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
		// this.nameInputTarget.value = this.nameTarget.textContent;
		this.element.classList.add('editing');
		this.nameInputTarget.select();
	}

  updateName(event) {
    event.preventDefault();

    if(this.nameInputTarget.value != ''){
      if(this.nameInputTarget.value.endsWith('s')){
        this.nameTarget.textContent = this.nameInputTarget.value + '\'';
      } else {
        this.nameTarget.textContent = this.nameInputTarget.value + '\'s';

      }
			this.element.classList.remove('editing');
    }
  }


})
