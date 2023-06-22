import View from './View.js';
import previewView from './previewView.js';

// Importing icons from dist folder
// import icons from '../img/icons.svg'; // parcel 1
import icons from 'url:../../img/icons.svg'; // parcel 2

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultView();
