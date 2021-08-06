import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// Polifill
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { RESULTS_PER_PAGE } from './config.js';

//////////////////////////////////////////////
//                                          //
//   https://forkify-api.herokuapp.com/v2   //
//                                          //
//////////////////////////////////////////////

const constrolRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    const { recipe } = model.state;
    recipeView.render(recipe);
    // Old implementation
    //resultsView.activeSearch(id);

    // New Implementation
    // Seleciona o item na barra de resultado
    resultsView.update(model.getSearchPage());

    // Update bookmark
    bookmarksView.update(model.state.bookmarks);
  } catch (erro) {
    recipeView.renderErroMessage();
  }
};

const controlSerachRecipes = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchRecipes(query);
    await controlPagination();
  } catch (erro) {
    resultsView.renderErroMessage();
  }
};

const controlPagination = async function (goToPage) {
  // get a lista of item with base o page
  const results = model.getSearchPage(goToPage);
  // render a list of itens in ResultView
  resultsView.render(results);
  // render a pagination
  paginationView.render(model.state.search);
};

const controlUpdateServings = function (newServing) {
  // Update servings
  model.updateServings(newServing);
  // Update render servings
  recipeView.update(model.state.recipe);
};

// adiciona e remove do favoritos
const controlAddBookmark = function () {
  // add / delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlOnloadBookmarks = function () {
  model.getBookmarksFromLocalStorage();
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const constrolAddRecipe = async function (newRecipe) {
  try {
    // Renderer Spiner
    addRecipeView.renderSpinner();
    // Upload Recipe
    await model.uploadRecipe(newRecipe);
    // Renderer Message
    addRecipeView.renderMessage();
    // Render
    bookmarksView.render(model.state.bookmarks);
    // Render Recipe
    recipeView.render(model.state.recipe);
  } catch (erro) {
    addRecipeView.renderErroMessage(erro.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(constrolRecipe);
  recipeView.addHandlerUpdateServing(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSerachRecipes);
  paginationView.addPaginationHandler(controlPagination);
  bookmarksView.addHandlerOnLoadBookmarks(controlOnloadBookmarks);
  addRecipeView.addHandlerUploadRecipe(constrolAddRecipe);
};

init();
