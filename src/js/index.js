//import x from './models/Search';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader,clearLoader, elementStrings} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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
//-------------------------------------------------------------------------------------------------------------
//Handling recipe button increase and decrease  clicks

elements.recipe.addEventListener('click',e =>{
//Here in the matches side what we are going to look for is to know whether the clicks done under the recipe object previously defined, match one of the classes and minor classes, so we are not going to use closest because we are not searching for the union of decrease and increase and the parent object, but we will see those objects separately
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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to teh shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
    //console.log(state.recipe);

})
//-------------------------------------------------------------------------------------------------------------
//window.l = new List();

/*
LIST CONTROLLER 
*/

const controlList = () => {
    //Create a new list
    if(!state.list) state.list = new List();

    //add each ingredient to the list and add it to the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    })
}

//Handle delete and update event list 

elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(id);
    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){

        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
        //Handle the count update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        console.log(id + ' ' +val);
        state.list.updateCount(id,val);
    }

})

//-------------------------------------------------------------------------------------------------------------

/*LIKE CONTROLLER */
//TESTING
state.likes = new Likes();
//likesView.toggleLikeMenu(state.likes.getNumLikes());
//end of testing


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    //User has not yet liked the current recipe
    if (!state.likes.isLiked(currentId)){
        //Add like to the state
        
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img,
            );
            //Toggle the like button
        likesView.toggleLikesBtn(true);

        console.log(state.likes)
        //console.log(newLike.author);
        //Add to the UI list
        likesView.renderLike(newLike);
    
    //User has not yet liked the current recipe
    }else{

        //Remove like to the state
        state.likes.deleteLike();
        //Toggle the like button
        likesView.toggleLikesBtn(false);
        console.log(state.likes);
        //Remove to the UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore liked recipes when the page loads

window.addEventListener('load', () => {
    state.likes = new Likes();

    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.forEach(like => likesView.renderLike(like));
})