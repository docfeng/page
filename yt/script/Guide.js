var Guide = {

    show: function() {
        var json = linkDir[linkDir.length - 1];
        guide_dir.innerHTML="";
        guide_link.innerHTML="";
        for (var i = 0; i < json.length; i++) {
            var type = json[i][0];
            var name = json[i][1];
            var data = json[i][2];
            if (type == "dir") {
                var d=document.getElementById("model-dir").cloneNode(true);
                d.children[0].dataset.index=i;
                d.children[1].dataset.index=i;
                d.children[1].innerHTML=name;
                guide_dir.appendChild(d);
            } else if (type == "link") {
                var d=document.getElementById("model-link").cloneNode(true);
                d.children[0].dataset.index=i;
                d.children[1].dataset.index=i;
                d.children[1].dataset.href=data;
                d.children[1].title=name + data;
                d.children[1].innerHTML=name;
                guide_link.appendChild(d);
            }

        }
    },
    get: function() {
        var para = {
            "owner": user,
            "repo": repos,
            "name": path,
            "branch": branch
        };
        git.getFile(para).then(function(json) {
            json = JSON.parse(json);
            linkDir = [];
            linkDir.push(json);
            Guide.show();
        }).catch(function(a) {
            alert(a.message)
        });
    },
    put: function(name, href) {
        var data = ["link", name, href];
        var json = linkDir[linkDir.length - 1];
        json.push(data);
        Guide.addDataToWeb();
    },
    copy: function() {
        var elements = document.querySelectorAll("input[type=checkbox]");
        var json = linkDir[linkDir.length - 1];
        var re = []
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked == true) {
                var index = elements[i].dataset.index;
                re.push(json[index])
            }
        }
        this.control = "copy";
        this.data = re;
    },
    paste: function() {
        switch (this.control) {
            case "copy":
                var json = linkDir[linkDir.length - 1];
                var data = this.data;
                for (var i = 0; i < data.length; i++) {
                    json.push(data[i])
                }
                Guide.show();
                this.control = null;
                this.data = null;
                break;
            case "cut":
                var json = linkDir[linkDir.length - 1];
                var data = this.data;
                for (var i = 0; i < data.length; i++) {
                    json.push(data[i])
                }
                Guide.show();
                this.control = null;
                this.data = null;
                var obj = this.obj;
                var target = this.target;
                for (var i = target.length - 1; i >= 0; i--) {
                    obj.splice(target[i], 1);
                }
                break;
            case "move":

                break;
        }
    },
    move: function() {

    },
    cut: function() {
        var elements = document.querySelectorAll("input[type=checkbox]");
        var json = linkDir[linkDir.length - 1];
        var re = [];
        var target = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked == true) {
                var index = elements[i].dataset.index;
                re.push(json[index]);
                target.push(index);
            }
        }
        this.control = "cut";
        this.data = re;
        this.obj = json;
        this.target = target;
    },
    "delete": function() {
        var elements = document.querySelectorAll("input[type=checkbox]");
        var json = linkDir[linkDir.length - 1];
        var re = []
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked == true) {
                var index = elements[i].dataset.index;
                re.push([index, json[index][1], json[index][2]])
            }
        }
        if (!confirm("确定删除" + JSON.stringify(re, null, 4))) {
            return 0;
        }
        for (var i = re.length - 1; i >= 0; i--) {
            json.splice(re[i][0], 1);
        }
        console.log(json);
        var txt = JSON.stringify(linkDir[0], null, 4);
        console.log(txt)
        Guide.show();
        return git.writeFile({
            "owner": user,
            "repo": repos,
            "name": window.path,
            "branch": branch,
            "txt": txt
        });
    },
    turnToEdit:function(){
        guide.classList.toggle("show");
    },
    toggleStyle: function() {
        var stylesheet = document.getElementById("initStyle").styleSheet || document.getElementById("initStyle").sheet
        //var stylesheet = document.styleSheets[0];
        var rules = stylesheet.cssRules;
        var index = -1;
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].selectorText == ".edit") {
                index = i
            }
            console.log(rules[i].selectorText);
        }
        if (index > -1) {
            var display = rules[index].style.display;
            rules[index].style.display = display == "none" ? "initial" : "none";
        } else {
            //stylesheet.insertRule("."+name+"{"+checked?"display:block":"display:none"+"}")
            stylesheet.insertRule(".edit{display:initial}")
        }
    },

    addToTable: function() {
        var name = link_name.value;
        var href = link_url.value;
        var type = link_type.value;
        if (name && (href || type == "dir")) {
            if (type == "dir") {
                var data = ["dir", name, []];
            } else {
                var data = ["link", name, href];
            }
            var json = linkDir[linkDir.length - 1];
            json.push(data);
            this.show();
            var index = link_table.rows.length;
            var row = link_table.insertRow(index);
            cell1 = row.insertCell(0);
            cell2 = row.insertCell(1);
            cell1.innerHTML = name;
            cell2.innerHTML = href;
        }
    },
    addDataToWeb: function() {
        var json = linkDir[0];
        var txt = JSON.stringify(json, null, 4);
        //Guide.show(json);
        if (!confirm("确实添加+\n" + txt)) {
            return 0;
        }
        return git.writeFile({
            "owner": user,
            "repo": repos,
            "name": window.path,
            "branch": branch,
            "txt": txt
        });

    },
    onclick: function() {
        var obj = event.srcElement;
        if(obj.tagName.toLowerCase()=="span"){
            var ele=obj.parentNode.parentNode;
            var parentNode=obj.parentNode;
            parentNode.checked=true;
            if(ele.parentNode.classList.contains("show")){
                //parentNode
            }else{
                if(ele.id=="guide_dir"){
                    this.selectDir();
                }else if(ele.id=="guide_link"){
                    window.open(obj.dataset.href)
                }
            }						
        }
    },
    selectDir: function() {
        var obj = event.srcElement;
        var index = obj.dataset.index;
        var json = linkDir[linkDir.length - 1];
        var name = json[index][1] + "&gt;";
        json = json[index][2];

        var div = document.createElement("div");
        div.dataset.index = guide_nav.children.length;
        div.innerHTML = name;
        guide_nav.appendChild(div);
        linkDir.push(json);
        Guide.show();
    },
    
    turnDir: function() {
        var obj = event.srcElement;
        var index = obj.dataset.index;
        if (index) {
            linkDir = linkDir.slice(0, parseInt(index) + 1);
            //alert(parseInt(index)+1)
            var json = linkDir[linkDir.length - 1];
            Guide.show();
            for (var i = guide_nav.children.length - 1; i > index; i--) {
                guide_nav.removeChild(guide_nav.children[i]);
            }
            //alert(json[json.length-1])
        }
    },
    upDir: function() {
        if (linkDir.length > 1) {
            linkDir.pop();
            Guide.show();
            var obj = guide_nav.children;
            guide_nav.removeChild(obj[obj.length - 1]);
        }
    },
    selectLink: function() {
        var elements = document.querySelectorAll("input[type=checkbox]");
        var json = linkDir[linkDir.length - 1];
        var re = []
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked == true) {
                var index = elements[i].dataset.index;
                link_name.value = json[index][1];
                link_url.value = json[index][2];
                return 0;
            }
        }
    },
    alterLink: function() {
        var elements = document.querySelectorAll("input[type=checkbox]");
        var json = linkDir[linkDir.length - 1];
        var re = []
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked == true) {
                var index = elements[i].dataset.index;
                var data = ["link", link_name.value, link_url.value];
                json[index] = data;
                this.show();
                return 0;
            }
        }
    }
}

window.onerror = function(sMessage, sUrl, sLine) {
    alert("发生错误！\n" + sMessage + "\nURL:" + sUrl + "\nLine Number:" + sLine);
    return true;
}
document.onclick=function(){
    var obj=event.srcElement;
    if(obj.tagName.toLowerCase()=="span"){
        var ele=obj.parentNode.parentNode;
        var parentNode=obj.parentNode;
        if(parentNode.classList.contains("down-show")){
            var style=ele.children[1].style;
            var index =Array.prototype.indexOf.call(obj.parentNode.children, obj);
            if(index==obj.parentNode.children.length-1){
                if(style.display==""||style.display=="none"){
                    style.display="block";
                }else{
                    style.display="none";
                }
                /*var event1 = document.createEvent('HTMLEvents');
                event1.initEvent("dblclick", true, true);
                event1.eventType = 'message';
                ele.dispatchEvent(event1);
                if(ele.ontap)alert()
                alert(ele.onclick)*/
            }else if(index==1){
                
            }
        }else if(parentNode.classList.contains("down-option")){
            var style=ele.children[1].style;
            ele.children[0].children[0].innerHTML=obj.innerHTML;
            style.display="none";
        }
    }
}
/*
window.addEventListener('load',function(){
    git=new gitapi("docfeng");
}, false);
*/