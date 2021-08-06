import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _erroMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)1';

  addHandlerOnLoadBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _getMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  /*

  // Old implementation
  _getMarkupPreview(recipe) {
    // pega o id selecionado  e compara na hora da renderização
    const id = window.location.hash.slice(1);

    return `<li class="preview">
                <a class="preview__link ${
                  id === recipe.id ? 'preview__link--active' : ''
                }" href="#${recipe.id}">
                <figure class="preview__fig">
                    <img src="${recipe.imageUrl}" alt="${recipe.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${recipe.title}</h4>
                    <p class="preview__publisher">${recipe.publisher}</p>
                    <!--
                      <div class="preview__user-generated">                    
                        <svg>
                            <use href="${icons}#icon-user"></use>
                        </svg>
                      </div>
                    -->
                </div>
                </a>
            </li>`;
  }*/
}

export default new BookmarksView();
