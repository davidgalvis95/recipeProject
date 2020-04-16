import axios from 'axios';
export default class Search{

    constructor(query){
        this.query = query;
    }

    //Here we are handling the promise coming from the api with an async function
    async getResults(query) {
        //const prefix = 'https://cors-anywhere.herokuapp.com/';
        try {

            const res = await axios(
                `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
            );
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }

    }

}