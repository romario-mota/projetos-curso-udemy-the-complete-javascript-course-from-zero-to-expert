'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[new Date().getMonth()]
    }, ${new Date().getDay()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your current position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude: lati, longitude: longi } = position.coords;
    const coords = [lati, longi];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    // render mark
    this.#workouts.forEach(work => {
      this._renderMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const isValidNumbers = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const isAllPositives = (...inputs) => inputs.every(input => input > 0);

    e.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !isValidNumbers(distance, duration, cadence) ||
        !isAllPositives(distance, duration, cadence)
      )
        return alert('All Number can ben positives');

      workout = new Running(distance, duration, [lat, lng], cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !isValidNumbers(distance, duration, elevation) ||
        !isAllPositives(distance, duration)
      )
        return alert('All Number can ben positives');

      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }

    this.#workouts.push(workout);

    this._renderMarker(workout);

    this._showWorkoutInList(workout);

    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    // hidden form;
    form.classList.add('hidden');

    // update a localstorage
    this._setLocalStorege();
  }

  _renderMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 50,
          autoClose: false,
          closeOnEscapeKey: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
  }

  _showWorkoutInList(workout) {
    const html = ` <li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
                      <h2 class="workout__title">${workout.description}</h2>
                      <div class="workout__details">
                        <span class="workout__icon">${
                          workout.type == 'running' ? '🏃‍♂️' : '🚴‍♀️'
                        }</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${
                          workout.type == 'running'
                            ? workout.pace
                            : workout.speed
                        }</span>
                        <span class="workout__unit">${
                          workout.type == 'running' ? 'min/km' : 'km/h'
                        }</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${
                          workout.type == 'running'
                            ? workout.cadence
                            : workout.elevation
                        }</span>
                        <span class="workout__unit">${
                          workout.type == 'running' ? 'spm' : 'm'
                        }</span>
                      </div>
                    </li>  `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);
    // move the map
    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _setLocalStorege() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    this.#workouts = data !== null ? data : [];
    this.#workouts.forEach(work => {
      this._showWorkoutInList(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
