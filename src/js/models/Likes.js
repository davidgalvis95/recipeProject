export default class Likes {
    constructor() {
        this.likes = [];

    }

    addLike(id,title,author,img) {
        const like = {id,title,author,img};
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1)
    }

    isLiked(id2){
        return this.likes.findIndex(el => el.id === id2) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }
}