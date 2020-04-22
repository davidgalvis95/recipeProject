//import x from './models/Search';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader,clearLoader, elementStrings} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';

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
//------------------------------------------------------------------------------------------------------------
//This is an async function because in the model of search it is an async function
const controlSearch = async () =>{
    //1. Get the query from the view
    const query = searchView.getInput();//TO DO
    //const query = 'pizza';

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
            //console.log(state.recipe.ingredients);
            
            clearLoader();
            console.log(state.search.result);
            searchView.renderResults(state.search.result);    
            //console.log(state.recipe.ingredients);       
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
});
//-------------------------------------------------------------------------------------------------------------
//This is for testing
/*
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});*/

// const search = new Search('pizza');
// console.log(search);
// search.getResults();
//-------------------------------------------------------------------------------------------------------------
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
//-------------------------------------------------------------------------------------------------------------
//RECIPE CONTROLLER

//Testing the model of recipe
// const r = new Recipe(35477);
// r.getRecipe();
// console.log(r);

//This is the function that takes the id of the hash that is executed every time the page loads or every time the page changes its hash(It means when we select another item from the list of recipes)
const controlRecipe = async() => {
    //Get the id from the url
    const id = window.location.hash.replace('#','');
    console.log(id);

    if(id) {
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Highlight selected search item
        searchView.highlightSelected(id);
        //Create new Recipe Object
        state.recipe = new Recipe(id);
        //Testing
        //window.r = state.recipe;
        //Get the recipe Data
        try{
            await state.recipe.getRecipe();
            //Calculate servings time

            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();

            //Render Recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
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

//Handling recipe button increase and decrease  clicks

elements.recipe.addEventListener('click',e =>{

    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');  
            recipeView.updateServingsIngredients(state.recipe);          
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Decrease button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);

})

window.l = new List();