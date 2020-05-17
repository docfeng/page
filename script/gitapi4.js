gitapi4=class gitapi4{
    constructor(name){
        this.name=name;
    }
    async getUser(name){
        this.name=name||this.name;
        if(this.user){return this.user};
        var users=await store.getItem("users");
        if(users){
            users=JSON.parse(users);
            var name=name||this.name||prompt("用户名","docfeng");
            if(users[name]){
                var author=users[name];
                let user={name,author};
                this.user=user;
                return user;
            }
        }
       return await this.login(name); 
    }
    async login(name,psw){
        var name=name||prompt("用户名","docfeng");
        var psw=psw||prompt("密码:"+name);
        var users=await store.getItem("users");
        alert(users)
        users=users?JSON.parse(users):{};
        //var token=prompt("token");
        var author="Basic "+btoa(name+":"+psw);
        this.user={name,author};
        users[name]=author;
        alert(JSON.stringify(users));
        await store.setItem("users",JSON.stringify(users));
        return this.user;
    }
    async getsha(repos,name){
        if(!this.shas){
            await this.getFiles(repos);
        } 
        var sha=this.shas[name]||null;
        return sha;
   } 
    async query(query){
        var user=await this.getUser();
        if(!user){return false;}
        var json={
            url:`https://api.github.com/graphql`,
            method:"post",
            str:JSON.stringify({"query":query}),
            head:{Authorization:user.author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async mutation(mutation){
        var user=await this.getUser();
        var json={
            url:`https://api.github.com/repos/${user.name}/${repos}/contents/${name}`,
            head:{Authorization:user.author}
        }
        var text=await http.get(json.url); 
        return re;
    }
}
/*
(async function(a){
  var git=new gitapi4("docfeng");
  var query=``; 
  alert(await git.query());
})()

*/
/*

*/

