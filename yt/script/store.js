store={
    async init() {
        var db=new DB();
        await db.open_db("store");
        //await db.create_store("store",{key:"name",index:{name:true,val:false}});
        //db.select_store("store");
        if(!db.select_store("store")){
            await db.create_store("store",{key:"name",index:{name:true,val:false}});
        }
       return db;
    },
    async setItem(name,value){
      var db=await this.init();
      var json={"name": name, "val":value };
      var re=await db.put(json);
      await db.close_db();
      return re;
    },
    async getItem(name){
        var db=await this.init();
        var json={"name": name};
        var re=await db.getindex(json);
        try{ 
          re=re&&re[0]&&re[0].val;
        }catch(e){alert(false)} 
        await db.close_db();
        return re;
    },
    async clear(){
        var db=await this.init();
        await db.clear_store()
        await db.close_db();
    }
}