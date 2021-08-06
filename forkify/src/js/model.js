import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
    results: [],
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(book => book.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (erro) {
    throw erro;
  }
};

export const loadSearchRecipes = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (erro) {
    throw erro;
  }
};

// se não for passado nenhuma pagina ele pegará o valor que está setado on state
export const getSearchPage = function (page = state.search.page) {
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  state.search.page = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  recipe.bookmarked = true;
  setBookmarksToLocalStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(b => (b.id = id));
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  setBookmarksToLocalStorage();
};

const setBookmarksToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const getBookmarksFromLocalStorage = function () {
  const books = JSON.parse(localStorage.getItem('bookmarks'));
  if (!books) return;
  state.bookmarks = books;
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(prop => {
        return (
          prop[0]
            .toLocaleUpperCase()
            .includes('ingredient'.toLocaleUpperCase()) && prop[1]
        );
      })
      .map(ing => {
        const ingArr = ing[1].split(',');
        if (ingArr.length !== 3)
          throw new Error('Inválid format of Ingridient!');
        const [quantity, unit, description] = ingArr;
        return { quantity: +quantity, unit, description };
      });
    const uploadData = {
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      title: newRecipe.title,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, uploadData);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (erro) {
    throw erro;
  }
};
