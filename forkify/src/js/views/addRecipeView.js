import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe Succefuly added.';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _btnAddRecipe = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  toggleModal() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenModal() {
    this._btnAddRecipe.addEventListener('click', this.toggleModal.bind(this));
  }

  _addHandlerCloseModal() {
    this._btnCloseModal.addEventListener('click', this.toggleModal.bind(this));
    this._overlay.addEventListener('click', this.toggleModal.bind(this));
  }

  _getMarkup() {
    return '';
  }
}

export default new AddRecipeView();
