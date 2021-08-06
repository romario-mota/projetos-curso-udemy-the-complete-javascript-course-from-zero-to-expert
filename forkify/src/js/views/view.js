import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErroMessage();
    this._data = data;
    const html = this._getMarkup();

    if (!render) return html;

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  // A simple VIRTUAL DOM
  update(data) {
    this._data = data;

    // Pega o html que seria rendereizado se usasse o metodo render
    const newMarkup = this._getMarkup();
    //Cria um franquimento de DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Seleciona todos os elemento do DOM criando
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Seleciona todos os elemento do DOM ATUAL do documento HTML
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Faz uma loop no elemento temporario e compara com os ELEMENTOS NA PÁGINA ATUALMENTE;
    // Atualizando os somente os valores que estiverem diferentes
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Update Changed TEXT
      if (
        !newEl.isEqualNode(curEl) && // Verifica se o elemento atual é diferente do novo elemento
        newEl.firstChild?.nodeValue.trim() !== '' /// se o contundo do elemento não for vazio
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Update Changed Attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const html = `<div class="spinner">
                        <svg>
                        <use href="${icons}#icon-loader"></use>
                        </svg>
                    </div> `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderErroMessage(message = this._erroMessage) {
    const html = `<div class="error">
                        <div>
                        <svg>
                            <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                        </div>
                        <p>${message}</p>
                    </div> `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._message) {
    const html = `
            <div class="message">
                <div>
                <svg>
                    <use href="src/img/icons.svg#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
