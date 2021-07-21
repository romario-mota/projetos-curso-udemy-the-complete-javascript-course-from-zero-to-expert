'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

//////////////////////////////////////
// Implements a smooth scroll ////////
//////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', e => {
  // obter as informações do elemento
  // altura, largura, as cordernados do mesmo em relação ao viewport
  const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);

  // tamanho do viewport
  //console.log(document.documentElement.clientWidth,document.documentElement.clientHeight);

  // posicao atual do scroll
  //console.log(window.pageXOffset, window.pageYOffset);

  // executa a scrool
  // s1coords.left - retorna a posição do elemento em relação ao lado esquerdo do viewport
  // s1coords.top - retorna  a posição do elemento em relação ao lado diretiro do viewport
  //window.scrollTo(
  //  s1coords.left + window.pageXOffset,
  //  s1coords.top + window.pageYOffset
  //);

  // scrool com smooth
  //window.scrollTo({
  //  left: s1coords.left + window.pageXOffset,
  //  top: s1coords.top + window.pageYOffset,
  //  behavior: 'smooth',
  //});

  // a modern way of execute scroll
  // só funcniona em nevegadores modernos
  // nao precisa calcular as coordenadas
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////////
// Event Delegation - Implementing Page Navigation //
/////////////////////////////////////////////////////
/*
// Uma maneira não eficiente
// Nessa modalidade se trivermos muitos itens, a performasse estará comprometida
document.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function (ev) {
    ev.preventDefault();
    const id = this.getAttribute('href'); // this.href retornaria a url completa
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// A maneira correção seria utilizar a delegação de evento através do boobling
// Como implementar: 1 - Add evento ao elemto pai comum, 2 - determinar qual elemnto filho foi clicado (event.target)
document.querySelector('.nav__links').addEventListener('click', function (ev) {
  ev.preventDefault();
  if (
    ev.target.classList.contains('nav__link') &&
    !ev.target.classList.contains('nav__link--btn')
  ) {
    const id = ev.target.getAttribute('href'); //ev.target.href retornaria a url completa
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////
//   Implmenting Barra Fixa  (Sticky Navigatio)/
///////////////////////////////////////////////

// Esta forma não é recomendada pq degrada o desempenho

/*window.addEventListener('scroll', function () {
  const section1Coords = section1.getBoundingClientRect();
  if (window.scrollY > section1Coords.top + window.pageYOffset)
    document.querySelector('.nav').classList.add('sticky');
  else document.querySelector('.nav').classList.remove('sticky');
});*/

// Outra Maneira (Intersection Observer API)
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const options = {
  root: null, // object scoll -> null indica que eh o viewport
  threshold: 0, /// porcentagem que o objeto está visivel
  rootMargin: `-${navHeight}px`, // define a margem que será descontado. Como eh negativa é antes do objeto
};

const callbackFunction = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obverser = new IntersectionObserver(callbackFunction, options);
obverser.observe(header);

////////////////////////////////////////////////
//   Revelando elementos durante o Scroll    ///
//   Mas sobre Intersection Observer API     ///
///////////////////////////////////////////////

const sections = document.querySelectorAll('.section');

const fn = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(fn, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionsObserver.observe(section);
  //section.classList.add('section--hidden');
});

////////////////////////////////////////////////
//   lazy loading de imagens                 ///
//   Mas sobre Intersection Observer API     ///
///////////////////////////////////////////////

const imgTarget = document.querySelectorAll('.lazy-img');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  obverser.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////
//   Implmenting Nav Animation hover        ///
///////////////////////////////////////////////

const handleMouseEvent = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const links = e.target
      .closest('.nav__links')
      .querySelectorAll('.nav__link')
      .forEach(l => {
        if (l !== e.target) l.style.opacity = this;
      });
    const logo = nav.querySelector('img');
    logo.style.opacity = this;
  }
};

// mouseneter nao bobulha, por isso nao dá pra usá-lo nesse exemplo
// mouseover borbulha

// insere o envento
nav.addEventListener('mouseover', handleMouseEvent.bind('0.5'));

// voltar ao normal
nav.addEventListener('mouseout', handleMouseEvent.bind('1'));

///////////////////////////////////////////////
//   Implmenting SLIDE components           ///
///////////////////////////////////////////////

// const slider = document.querySelector('.slider');
// slider.style.overflow = 'visible';
// slider.style.transform = 'scale(50%)';

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const maxSlide = slides.length - 1;

const dotContainer = document.querySelector('.dots');

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDots = function (slide) {
  dotContainer.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
    if (Number(dot.dataset.slide) === slide)
      dot.classList.add('dots__dot--active');
  });
};

const goToSlide = slide => {
  slides.forEach((cur, index) => {
    cur.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};

const nextSlide = () => {
  currentSlide === maxSlide ? (currentSlide = 0) : currentSlide++;
  goToSlide(currentSlide);
  activeDots(currentSlide);
};

const privSlide = () => {
  currentSlide === 0 ? (currentSlide = maxSlide) : currentSlide--;
  goToSlide(currentSlide);
  activeDots(currentSlide);
};

const init = () => {
  createDots();
  goToSlide(0);
  activeDots(0);
};

init();

//1º - Primeira coisa a fazer eh colocar um slide do lado do outro
slides.forEach((slide, index) => {
  slide.style.transform = `translateX(${index * 100}%)`;
});

//2º - Botão de proximo slide (LEFT)
const btnRight = document.querySelector('.slider__btn--right');
btnRight.addEventListener('click', nextSlide);

//3º - Botão do slide anterior
const btnLeft = document.querySelector('.slider__btn--left');
btnLeft.addEventListener('click', privSlide);

// 4º - Executar a passagem do slide pelas seta direita e esquerda
// nao funcionou keypress no chrome
document.addEventListener('keydown', function (e) {
  // usando o short circuit para relembrar
  e.key === 'ArrowRight' && nextSlide(); //&& sempre retorna o 1º falso ou o ultimo true / se a seta for a diretira ele retonar o resultado da execução da função que eh undefined
  e.key === 'ArrowLeft' && privSlide();
});

// 5º Mostar os pontos do Slide no radapé
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const id = Number(e.target.dataset.slide);
    currentSlide = id;
    goToSlide(currentSlide);
    activeDots(currentSlide);
  }
});

///////////////////////////////////////////////
//   Implmenting TAB components             ///
///////////////////////////////////////////////

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  // foi usado Event Delegation para a implementar a funcionadidade

  // pegar o elemto pai mais proximo com a class .operations__tab
  // que neste caso é o botão. ISso pq quando se clica dentro do botão o tager é o span ou o text que retonar o botão
  const clicado = e.target.closest('.operations__tab');

  // o container pode ser clicado em uma area que nao sej ao botão e retornar undefined
  // por isso essa condicao
  if (!clicado) return;

  // Remover a active_class de todos os botões
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // adiciona somente no que foi clicado
  clicado.classList.add('operations__tab--active');

  // remover a classe operations__content--active de todas as div de conteudo
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Agora vamos ativar o conteudo da tab clicada
  document
    .querySelector(`.operations__content--${clicado.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////
///// DEMONSTRATION CODE                     ///
////////////////////////////////////////////////

/*
//DOM Traversing

// andar pra baixo -> pegal qualquer elemento filho abaixo
const h1 = document.querySelector('h1');
console.log(h1);
console.log(h1.childNodes); //  obtem todos os filhos -> incluindo texto, comentarios
console.log(h1.children); // retornar somente elementos html filhos

// pegar elemento filho direto
//h1.querySelector('.highlight').style.color = '#fff';
h1.firstElementChild.style.color = '#fff';
h1.lastElementChild.style.color = 'red';

// andar para cima
// pegar elemento pai direto
//h1.parentNode.style.backgroundColor = 'red';
//h1.parentElement.style.backgroundColor = 'blue';
//console.log(h1.parentNode);

// pegar qualquer elemto pai acima
// seemlhante ao querySelector(pegar elemento filho), só que esse pega elemento pais

h1.closest('.header').style.backgroundColor = 'orangered';
*/

/*
//Event propagation -bubbling and capturing
// Por padrão o evento propaga dos elemento destino pra os seus pais(Boobling)
const calcRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const calcRandomColor = () => {
  return `rgba(${calcRandomNumber(0, 255)},${calcRandomNumber(
    0,
    255
  )},${calcRandomNumber(0, 255)})`;
};

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = calcRandomColor();
  console.log('LINK');
  console.log(e.target, e.currentTarget);
  //e.stopPropagation(); // evita que o eventos sejam propagados para os elemtos pais
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = calcRandomColor();
  console.log('UL CONTAINER');
  console.log(e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = calcRandomColor();
    console.log('NAV CONTAINER');
    console.log(e.target, e.currentTarget);
  },
  true
);

*/

// Types of Events
/*
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('Mouse enter');
  // removendo evento
  //h1.removeEventListener('mouseenter', alertH1);
};

// primeira form de adicionar evento ao elemnto
h1.addEventListener('mouseenter', alertH1);

// segunda forma
//h1.onmouseenter = function (e) {
//  alert('Mouse enter 2');
//};

// removendo evento
setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 5000);
*/

/*

//
//
//
// Selecting element
console.log(document.documentElement); // retorna toda a arvore DOM
console.log(document.head); // retona o head
console.log(document.body); // retorna o body
const header = document.querySelector('.header');
console.log(header);
const allButtons = document.querySelectorAll('button');
console.log(allButtons);

console.log(document.getElementById('section--1'));
const allSections = document.getElementsByTagName('section');
console.log(allSections);
console.log(document.getElementsByClassName('btn'));

// Creating and inserting Element
const message = document.createElement('div'); // cria um elemento html
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message); // inseri como ultimo filho do elemento header
//header.prepend(message.cloneNode(true)); // inseri como primeiro filho do elemento header

//header.before(message); // inseri antes do elemento header
//header.after(message); // inseri depois do elemento header
console.log(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  //message.remove();
  message.parentElement.removeChild(message);
});




// Styles, Attributes and Classes
// Styles - #################################
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// javascript só consegue pegar valor de att definidas por ele porgramtivamente
// por isso essa instrução nao retorna dado algum
console.log(message.style.color);
// essa retorna por foi definida acima
console.log(message.style.backgroundColor);

/// mas ainda é possivel obter o valor de estilos nao definidos programaticamente
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// definindo valor de estilo
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// alterando valor de variavel css definidas no arquivo de estilo
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes - #############################
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
// retorna as classes definidas no elemento
console.log(logo.className);

// alterar valor do attr
logo.alt = 'Beautiful minimalist logo';

// Atributos não padrões
// Não eh possivel obter diretamente como os atrr padrões
console.log(logo.designer);
// mas poder ser obtido atraves do getAttribute
console.log(logo.getAttribute('designer'));

// podemos definir attributos personalizado com setAttribute
logo.setAttribute('company', 'Bankist');

// alguns attributos apresentam comportamentos diferente quando
// usado diretamente ao atraves de getAttribute
console.log(logo.src); // retonar a url completa
console.log(logo.getAttribute('src')); // retorna o caminho da img sem url

// links --  os mesmo acontece com os links
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes - Padrões do HTML 5
console.log(logo.dataset.versionNumber);
logo.dataset.versionNumber = '4.0';
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('a', 'b');
logo.classList.remove('a', 'b');
logo.classList.toggle('a'); // alterna a classe se ela exite ou nao
logo.classList.contains('a'); // verifica se a classe existe

// Não usar
// por ela remove todas as classe exitentes e substitui pela que ta sendo setada
logo.className = 'jonas';
*/
