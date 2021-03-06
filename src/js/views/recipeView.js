import {elements} from './base';
import { Fraction } from 'fractional';
//-------------------------------------------------------------------------------------------------------------
export const clearRecipe = () =>{
    elements.recipe.innerHTML = '';
} 
//-------------------------------------------------------------------------------------------------------------

const formatCount = count =>{
    if(count){
        //count = 2.5 ---> 5/2 ---> 2 1/2
        //count = 0.5 ---> 1/2
        //This is done because for some reason the Math.round only returns integers
        const roundCount = Math.round(count * 10000) / 10000;
        const [int, dec] = roundCount.toString().split('.').map(el => parseInt(el,10));
        console.log(roundCount);
        if(!dec) return roundCount;

        if(int === 0) {
            //The convertion to fraction was done by using the Fractional library from npm, however there are other methods to perform the same using raw JS
            const fr = new Fraction(roundCount);
            console.log(fr);
            return `${fr.numerator}/${fr.denominator}`;
        }else{
            const fr = new Fraction(roundCount-int);
            return `${int} ${fr.numerator}/${fr.denominator}`;           
        }

        
    }
    return '?';
};
//-------------------------------------------------------------------------------------------------------------
const createIngredient = (ingredient) => `
                    <li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count">${formatCount(ingredient.count)}</div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit">${ingredient.unit}</span>
                            ${ingredient.ingredient}
                        </div>
                    </li>
`;
//-------------------------------------------------------------------------------------------------------------
export const renderRecipe = (recipe,isLiked) => {
    const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked?'':'outlined'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">

                ${ recipe.ingredients.map(el => createIngredient(el)).join('') }

                </ul>
                <!-- this is the button that adds the ingredients to the shopping list -->

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin',markup)
    //${ recipe.ingredients.map(el => createIngredient(el)).join('') }
};
//-------------------------------------------------------------------------------------------------------------
export const updateServingsIngredients = recipe =>{
    //update the counts of the servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    //update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    //countElements.forEach(el => console.log('text ' + el.textContent));
    //recipe.ingredients.forEach(i => console.log('ing ' + i.count));
    countElements.forEach((el,i) => {
        //console.log(recipe.ingredient[i]);
        el.textContent =formatCount(recipe.ingredients[i].count);
    });
}