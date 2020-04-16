// export const add = (a,b)=>a+b;
// export const mult = (a,b)=>a*b;
// export const ID = 25;

import { elements } from './base';

//With the use of this arrow function we do not need to state the return, because it automatically returns
export const getInput = () => elements.searchInput.value;

export const clearInput = () =>{
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
};

const renderRecipe = recipe => {
    //This is the separate function that renders the recipe. 
    const markup = `
                    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`
    //Inserting this html element ensures that we can get our recipe html linked with the original UI view, the before end injection is the best in this case
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}

export const renderResults = recipes =>{
    //Here we print the whole array that brings the recipes for some of the queries in the controller, in the UI. To do so, we call another function that renders each of the recipes. We don't nwwd to call a arrow function inside te foreach due that we have already done it in the  
    recipes.forEach(renderRecipe);
}