import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            console.log(res);
        }catch(error){
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        //With the next ... we descructure the array and join it with the other 2 components of units we want to add there
        const units = [...unitsShort,'kg','g'];
        const newIngredients = this.ingredients.map(el => {
            //1 Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitsShort[i]);
            })
            //2 Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //3 parse ingredients into count unit and ingredient
            //This array will split the string into an array by spaces
            const arrIng = ingredient.split(' ');
            //console.log(arrIng);
            //In this arrow function, we loop over the arrIng and look if one of the elements match with the unitsShort one, if so, then we get the index of it
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            //console.log(unitIndex);

            let objIng;
            if(unitIndex >-1){
                //There is a unit
                //Ex. 4 1/2 cups, arrCount = [4, 1/2] ----> arrCount.join('+') --> 4+1/2 -->eval('4+1/2') -->4.5
                //Ex. 4 cups, arrCount = [4]
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(arrIng[0],10)){
                //There is no unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //There's no unit nor 1st element is number
                objIng ={
                    count:1,
                    unit:'',
                    ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }
}