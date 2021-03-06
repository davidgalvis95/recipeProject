import uniqueid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    };

    addItem(count,unit,ingredient){
        const item = {
            id: uniqueid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    };

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        //splice method mutates the original array
        //[2,4,8]  splice(1,2)  -->  returns [4,8], original array is [2]
        //[2,4,8]  slice(1,2)  -->  returns 4, original array is [2,4,8]
        this.items.splice(index, 1)
    };

    updateCount(id2,newCount){
        //Here we are looping over the items array and if it haste the same id than the element that it finds, then it will update the id
        //console.log(this.items);
        //console.log(this.items.find(el => el.id === id2).count);
        this.items.find(el => el.id === id2).count = newCount;
        //console.log('items.el' + this.items.el);

    };
}