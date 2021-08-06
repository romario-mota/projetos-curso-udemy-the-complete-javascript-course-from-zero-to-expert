import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // evento adicionado aos btns de paginação
  // chama a função do controller para executr a paginação
  addPaginationHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicado = e.target.closest('.btn--inline');
      if (!clicado) return;
      const goToPage = +clicado.dataset.goto;
      handler(goToPage);
    });
  }

  _getMarkup() {
    const currentPage = this._data.page;
    const prev = `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>`;

    const next = `
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    const totalResults = this._data.results.length;
    const totalPage = Math.ceil(totalResults / this._data.resultsPerPage);

    // o total de resultados for zer ou se total de página for 1
    // não vai renderizar os botões
    if (totalResults === 0 || totalPage === 1) return '';

    // se a página for 1 e total de páginas for maior que a página atual
    // renderiza a pagina atual e o botão para a proxima página
    if (currentPage === 1 && totalPage > currentPage) return next;

    // Se a página atual for a ultimas (= totalPage)
    // rederiza a página atual e o botão de voltar para a página anterior
    if (currentPage === totalPage && totalPage > 1) return prev;

    // Se a página atual não for a primeira nem a ultima
    // então rederiza os dois botões
    return `${prev}${next}`;
  }
}

export default new PaginationView();
