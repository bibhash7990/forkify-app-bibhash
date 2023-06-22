// importing module.js
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// importing core-js for polyfilling
import 'core-js/stable'; // for polyfilling every thing
import 'regenerator-runtime/runtime'; // for polyfilling async and await
import { async } from 'regenerator-runtime';

// It is not real javascript its cominh from parcel. its called hot module reloads
// if (module.hot) {
//   module.hot.accept();
// }

// Show recipe function for fetxh data from api
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner(); // calling renderspping after loading the page.

    // 0. Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());
    // 1. Updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    // 2. loading Recipe
    await model.loadRecipe(id);
    // const {recipe} = model.state; // no need that

    // 3. rendering recipe on user interface
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load Search results
    await model.loadSearchResults(query);

    //3. Render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultPage(1));

    // 4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1. Render NEW results
  resultView.render(model.getSearchResultPage(gotoPage));

  // 2. Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Upadate the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add/remove bookmark
  if (!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe);

  //3. render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔳', err);
    addRecipeView.renderError(err.message);
  }
};

// This below is the PUBLISHER SUBSCRIBER PATTERN
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
