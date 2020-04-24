export default class Likes {
    constructor() {
        this.likes = [];

    };

    addLike(id,title,author,img) {
        const like = {id,title,author,img};
        this.likes.push(like);
        //Whenever we change add, or deletre the array we should save in local storage so that it gets saved even if the page is reloaded
        this.persistData();
        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    };

    isLiked(id2){
        return this.likes.findIndex(el => el.id === id2) !== -1;
    };

    getNumLikes(){
        return this.likes.length;
    };

    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restoring likes from the local storage
        if(storage) this.likes = storage;
    }
}