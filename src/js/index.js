//import x from './models/Search';
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';

// //import { add as a,mult as mi,ID } from './views/searchView';

// import * as searchView from './views/searchView';

// console.log(`Using imported functions ${searchView.add(searchView.ID, 2)} and ${searchView.mult(4,2)}. ${x}`);
// //https://forkify-api.herokuapp.com/api/search


/* 
This is the global state of the app in terms of
-search object
-current recipe object
-shopping list object
-liked recipes
*/

const state = {};

//This is an async function because in the model of search it is an async function
const controlSearch = async () =>{
    //1. Get the query from the view
    const query = searchView.getInput();//TO DO

    if(query){
        //2. We create a new serach object and we add this to the state
        state.search = new Search(query);
        //3.Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            //Here we use await to pertorm the waiting time for the result of the promise in the async function
            await state.search.getResults();
            //4.search for recipes
            clearLoader();
            console.log(state.search.result);
            searchView.renderResults(state.search.result);           
        }catch(error){

            console.log(error);
            alert('Something went wrong with the search');
            clearLoader();
        };
        
    }

}

elements.searchForm.addEventListener('submit', e => {
    //Whenever we make the search button we have the e.preventDefault funtcion applied to avoid the page to be reaload in every search, then we call the separate function controlSearch that searches for the query thrown by the UI
    e.preventDefault();
    controlSearch();
})

// const search = new Search('pizza');
// console.log(search);
// search.getResults();

//In the controller we should have all our event listeners and we can control what should happen from there

elements.searchResPages.addEventListener('click', e=> {
    //With this function, we make something of event delegation, in order to know where the click happened, based on that what we want to achieve is to get the data property of the .btn-inline object, but we are receiving clicks from objects inside that one, hence, with the closest method what we want to achieve is to get the closest parent ancestor, no matter when we make the click in the UI
    const btn = e.target.closest('.btn-inline')
    if(btn){
        //Through the html defined, we can set a property data-goto, and manupulate it depending on our needs
        const goToPage = parseInt(btn.dataset.goto, 10);
        //We clear the results in order to avoid some conflict
        searchView.clearResults();
        //Here we call the function defined in the view, where we can send the array of results and the page we want it to go
        searchView.renderResults(state.search.result,goToPage);
        console.log(goToPage);
    }   
});

//RECIPE CONTROLLER

//Testing the model of recipe
// const r = new Recipe(35477);
// r.getRecipe();
// console.log(r);


const controlRecipe = async() => {
    //Get the id from the url
    const id = window.location.hash.replace('#','');
    console.log(id);

    if(id) {
        //Prepare the UI for changes

        //Create new Recipe Object
        state.recipe = new Recipe(id);
        //Get the recipe Data
        try{
            await state.recipe.getRecipe();
            //Calculate servings time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render Recipe
            console.log(state.recipe);
        }catch(err){
            console.log(err);
            alert('The request could not be processed');
        }


    }else{

    }
};
// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));