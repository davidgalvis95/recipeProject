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
    //This is the way we clear out the inner list of the recipes displayed
    elements.searchResList.innerHTML = '';
    //Here we clear out the buttons, so that we can reinsert them from the controller
    elements.searchResPages.innerHTML= '';
};
//-------------------------------------------------------------------------------------------------------------
//'Pasta with tomato and spinach'
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        //The split function splits a string, separating them by a character, while the reduce one acts as an iterator that takes into account the actual length and the last length
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);

        //return the result
        //The join function in an array joins the elements of an array separating them by the specified character
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    //This is the separate function that renders the recipe. 
    const markup = `
                    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
                `;
    //Inserting this html element ensures that we can get our recipe html linked with the original UI view, the before end injection is the best in this case
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};
//-------------------------------------------------------------------------------------------------------------
const createButton = (page,type) =>`
                <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev'?'left':'right'}"></use>
                    </svg>
                    <span>Page ${type === 'prev' ? page-1 : page+1}</span>
                </button>
                `;

const renderButtons = (page, numResults,resPerPage) =>{
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages>1){
        //Only the button to the next page
        button = createButton(page,'next');
    }else if(page>1 && page<pages){
        //Here will be the both buttons
        button = `
                ${createButton(page, 'next')}
                ${createButton(page, 'prev')}
                `;
    }else if(page === pages & pages >1){
        //The previous page button
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};
//-------------------------------------------------------------------------------------------------------------
export const renderResults = (recipes, page=1, resPerPage = 10) =>{
    //Here we print the whole array that brings the recipes for some of the queries in the controller, in the UI. To do so, we call another function that renders each of the recipes. We don't nwwd to call a arrow function inside te foreach due that we have already done it in the

    const start = (page-1)*resPerPage;
    //In the slice function it's not included the end, this is why there's 
    const end = page*resPerPage;
    //With the slice method we take a portion of an array and select that into a variable
    recipes.slice(start,end).forEach(renderRecipe);

    renderButtons(page, recipes.length,resPerPage);
}