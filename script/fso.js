fso={
    async read(name){
        return localStorage.getItem(name);
    },
    async write(name,text){
        return localStorage.setItem(name,text);
    }
}