import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _erroMessage =
    'Não foram encontrados registros para o critério de busca informado!';

  _getMarkup() {
    return this._data.map(recipe => previewView.render(recipe, false)).join('');
  }

  /*
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

export default new ResultsView();
