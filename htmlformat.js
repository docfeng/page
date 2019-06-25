function CLASS_FORMAT(code){
    //哈希表类
    function Hashtable(){
        this._hash        = new Object();
        this.add        = function(key,value){
                            if(typeof(key)!="undefined"){
                                if(this.contains(key)==false){
                                    this._hash[key]=typeof(value)=="undefined"?null:value;
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        }
        this.remove        = function(key){delete this._hash[key];}
        this.count        = function(){var i=0;for(var k in this._hash){i++;} return i;}
        this.items        = function(key){return this._hash[key];}
        this.contains    = function(key){return typeof(this._hash[key])!="undefined";}
        this.clear        = function(){for(var k in this._hash){delete this._hash[k];}}
    }
    this._caseSensitive = true;
    //字符串转换为哈希表
    this.str2hashtable = function(key,cs){
        
        var _key    = key.split(/,/g);
        var _hash    = new Hashtable(); 
        var _cs        = true;
    
        if(typeof(cs)=="undefined"||cs==null){
            _cs = this._caseSensitive;
        } else {
            _cs = cs;
        }
        for(var i in _key){
            if(_cs){
                _hash.add(_key[i]);
            } else {
                _hash.add((_key[i]+"").toLowerCase());
            }
        }
        return _hash;
    }
    //获得需要转换的代码
    this._codetxt        = code;
    if(typeof(syntax)=="undefined"){
        syntax = "";
    }
    this._deleteComment = false;
    //是否大小写敏感
    this._caseSensitive = true;
    //可以后面加块语句的关键字
    this._blockElement  = this.str2hashtable("switch,if,while,try,finally");
    //是函数申明
    this._function      = this.str2hashtable("function");
    //本行括号内分号不做换行
    this._isFor            = "for";
    this._choiceElement = this.str2hashtable("else,catch");
    this._beginBlock    = "{";
    this._endBlock      = "}";
    
    this._singleEyeElement = this.str2hashtable("var,new,return,else,delete,in,case");
    //得到分割字符
    this._wordDelimiters= "　 ,.?!;:\\/<>(){}[]\"‘\r\n\t=+-|*%@#$^&";
    //引用字符
    this._quotation     = this.str2hashtable("\",‘");
    //行注释字符
    this._lineComment   = "//";
    //转义字符
    this._escape        = "\\";
    //多行引用开始
    this._commentOn        = "/*";
    //多行引用结束
    this._commentOff    = "*/";
    //行结束词
    this._rowEnd        = ";";
    this._in            = "in";

    this.isCompress        = false;
    this.style            = 0;
    this._tabNum        = 0;

    this.format = function() {
        var codeArr        = new Array();
        var word_index    = 0;
        var htmlTxt        = new Array();
        if(this.isCompress){
            this._deleteComment = true;
        }

        //得到分割字符数组(分词)
        for (var i = 0; i < this._codetxt.length; i++) {       
            if  (this._wordDelimiters.indexOf(this._codetxt.charAt(i)) == -1) {        //找不到关键字
                if (codeArr[word_index] == null || typeof(codeArr[word_index]) == 'undefined') {
                    codeArr[word_index] = "";
                }
                codeArr[word_index] += this._codetxt.charAt(i);
            } else {
                if (typeof(codeArr[word_index]) != 'undefined' && codeArr[word_index].length > 0)
                    word_index++;
                codeArr[word_index++] = this._codetxt.charAt(i);
            } 
        }

        var quote_opened                = false;    //引用标记
        var slash_star_comment_opened   = false;    //多行注释标记
        var slash_slash_comment_opened  = false;    //单行注释标记
        var line_num                    = 1;        //行号
        var quote_char                  = "";       //引用标记类型
        var function_opened             = false;
        var bracket_open                = false;
        var for_open                    = false;
        //按分割字，分块显示
        for (var i=0; i <=word_index; i++){            
            //处理空行（由于转义带来）
            if(typeof(codeArr[i])=="undefined"||codeArr[i].length==0){
                continue;
            } else if(codeArr[i]==" "||codeArr[i]=="\t"){
                if(slash_slash_comment_opened||slash_star_comment_opened){
                    if(!this._deleteComment){
                        htmlTxt[htmlTxt.length] = codeArr[i];
                    }
                }
                if(quote_opened){
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                }
            } else if(codeArr[i]=="\n"){
            //处理换行
            } else if (codeArr[i] == "\r"){                                                                    
                slash_slash_comment_opened = false;    
                quote_opened    = false;
                line_num++;
                if(!this.isCompress){
                    htmlTxt[htmlTxt.length] = "\r\n"+ this.getIdent();    
                }
            //处理function里的参数标记
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&this.isFunction(codeArr[i])){
                htmlTxt[htmlTxt.length] = codeArr[i]  + " ";
                function_opened = true;
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._isFor){
                htmlTxt[htmlTxt.length] = codeArr[i];
                for_open = true;
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]=="("){
                bracket_open    = true;
                htmlTxt[htmlTxt.length] = codeArr[i];
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==")"){
                bracket_open    = false;
                htmlTxt[htmlTxt.length] = codeArr[i];
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._rowEnd){
                if(!this.isCompress){
                    if(!for_open){
                        if(i<word_index&&(codeArr[i+1]!="\r"&&codeArr[i+1]!="\n")){                            
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n" + this.getIdent();
                        }else{
                            htmlTxt[htmlTxt.length] = codeArr[i] + this.getIdent();
                        }
                    }else{
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                    }
                }else{
                    htmlTxt[htmlTxt.length] = codeArr[i];
                }
            } else if(!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._beginBlock){
                for_open    = false;
                if(!this.isCompress){
                    switch(this.style){
                        case 0:
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n" + this.getIdent();
                            break;
                        case 1:
                            htmlTxt[htmlTxt.length] = "\n" + this.getIdent();
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n"+ this.getIdent();
                            break;
                        default:
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i];
                            break;
                            
                    }
                }else{
                    htmlTxt[htmlTxt.length] = codeArr[i];
                }
            } else if(!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._endBlock){
                if(!this.isCompress){
                    this._tabNum--;
                    if(i<word_index&&codeArr[i+1]!=this._rowEnd){
                        htmlTxt[htmlTxt.length] = "\n" + this.getIdent() + codeArr[i];
                    }else{
                        htmlTxt[htmlTxt.length] = "\n" + this.getIdent() + codeArr[i];
                    }
                }else{
                    if(i<word_index&&codeArr[i+1]!=this._rowEnd){
                        htmlTxt[htmlTxt.length] = codeArr[i] + this._rowEnd;
                    }else{
                        htmlTxt[htmlTxt.length] = codeArr[i];
                    }
                }
            //处理关键字
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened && this.isBlockElement(codeArr[i])){     
                htmlTxt[htmlTxt.length] = codeArr[i];
            //处理内置对象(后面加一个空格)
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened && this.isSingleEyeElement(codeArr[i])){    
                if(codeArr[i]==this._in){
                    htmlTxt[htmlTxt.length] = " ";
                }
                htmlTxt[htmlTxt.length] = codeArr[i] + " ";
            //处理双引号（引号前不能为转义字符）    
            } else if (!slash_star_comment_opened&&!slash_slash_comment_opened&&this._quotation.contains(codeArr[i])){                                                    
                if (quote_opened){
                    //是相应的引号
                    if(quote_char==codeArr[i]){
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                        quote_opened    = false;
                        quote_char      = "";
                    } else {
                        htmlTxt[htmlTxt.length] = codeArr[i];            
                    }
                } else {
                    htmlTxt[htmlTxt.length] =  codeArr[i];
                    quote_opened    = true;
                    quote_char        = codeArr[i];
                }                    
            //处理转义字符
            } else if(codeArr[i] == this._escape){    
                htmlTxt[htmlTxt.length] = codeArr[i]; 
                if(i<word_index-1){
                    if(codeArr[i+1].charCodeAt(0)>=32&&codeArr[i+1].charCodeAt(0)<=127){
                        htmlTxt[htmlTxt.length] = codeArr[i+1].substr(0,1);
                        htmlTxt[htmlTxt.length] = codeArr[i+1].substr(1);
                        i=i+1;
                    }
                }            
            //处理多行注释的开始
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._commentOn,codeArr,i)){                                             
                slash_star_comment_opened = true;
                if(!this._deleteComment){
                    htmlTxt[htmlTxt.length] = this._commentOn;
                }
                i = i + this.getSkipLength(this._commentOn);    
            //处理单行注释
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._lineComment,codeArr,i)){                                                
                slash_slash_comment_opened = true;
                if(!this._deleteComment){
                    htmlTxt[htmlTxt.length] =  this._lineComment;
                }
                i = i + this.getSkipLength(this._lineComment);    
            //处理忽略词
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._ignore,codeArr,i)){                                                
                slash_slash_comment_opened = true;
                htmlTxt[htmlTxt.length] = this._ignore;
                i = i + this.getSkipLength(this._ignore);                    
            //处理多行注释结束    
            } else if (!quote_opened&&!slash_slash_comment_opened&&this.isStartWith(this._commentOff,codeArr,i)){                                
                if (slash_star_comment_opened) {
                    slash_star_comment_opened = false;
                    if(!this._deleteComment){
                        htmlTxt[htmlTxt.length] =  this._commentOff;
                    }
                    i = i + this.getSkipLength(this._commentOff);        
                }
            } else {
                //不是在字符串中
                if(!quote_opened){
                    //如果不是在注释重
                    if(!slash_slash_comment_opened && !slash_star_comment_opened){    
                            htmlTxt[htmlTxt.length] = codeArr[i];                        
                    //注释中                            
                    }else{
                        if(!this._deleteComment){
                            htmlTxt[htmlTxt.length] = codeArr[i];
                        }
                    }
                }else{
                            htmlTxt[htmlTxt.length] = codeArr[i];
                }
            }
            
        }
        return htmlTxt.join("");
    }
    this.isStartWith = function(str,code,index){
        if(typeof(str)!="undefined"&&str.length>0){        
            var cc = new Array();            
            for(var i=index;i<index+str.length;i++){
                cc[cc.length] = code[i];
            }
            var c = cc.join("");
            if(this._caseSensitive){
                if(str.length>=code[index].length&&c.indexOf(str)==0){
                    return true;
                }
            }else{
                if(str.length>=code[index].length&&c.toLowerCase().indexOf(str.toLowerCase())==0){
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
    this.isFunction = function(val){
        return this._function.contains(this._caseSensitive?val:val.toLowerCase());
    }
    
    this.isBlockElement = function(val) {        
        return this._blockElement.contains(this._caseSensitive?val:val.toLowerCase());
    }
    this.isChoiceElement = function(val) {        
        return this._choiceElement.contains(this._caseSensitive?val:val.toLowerCase());
    }
    this.isSingleEyeElement = function(val) {
        return this._singleEyeElement.contains(this._caseSensitive?val:val.toLowerCase());
    }
    this.isNextElement = function(from,word){
        for(var i=from;i<word.length;i++){
            if(word[i]!=" "&&word[i]!="\t"&&word[i]!="\r"&&word[i]!="\n"){                
                return this.isChoiceElement(word[i]);
            }
        }
        return false;
    }
    this.getSkipLength = function(val){    
        var count = 0;
        for(var i=0;i<val.length;i++){
            if(this._wordDelimiters.indexOf(val.charAt(i))>=0){
                count++;
            }
        }
        if(count>0){
            count=count-1;
        }
        return count;
    }
    this.getIdent=function(){
        var n = [];
        for(var i=0;i<this._tabNum;i++){
            n[n.length] = "\t";
        }
        return n.join("");
    }
}
//var code=`function(a){alert(a)}`;
//var x=new CLASS_FORMAT(code)
//alert(x.format())
function CSSdecode(code) 
{ 
code = code.replace(/(\s){2,}/ig,'$1'); 
code = code.replace(/(\S)\s*\{/ig,'$1\n{'); 
code = code.replace(/\*\/(.[^\}\{]*)}/ig,'\*\/\n$1}'); 
code = code.replace(/\/\*/ig,'\n\/\*'); 
code = code.replace(/;\s*(\S)/ig,';\n\t$1'); 
code = code.replace(/\}\s*(\S)/ig,'\}\n$1'); 
code = code.replace(/\n\s*\}/ig,'\n\}'); 
code = code.replace(/\{\s*(\S)/ig,'\{\n\t$1'); 
code = code.replace(/(\S)\s*\*\//ig,'$1\*\/'); 
code = code.replace(/\*\/\s*([^\}\{]\S)/ig,'\*\/\n\t$1'); 
code = code.replace(/(\S)\}/ig,'$1\n\}'); 
code = code.replace(/(\n){2,}/ig,'\n'); 
return code; 
}
HTMLFormat = (function() {
	function style_html(html_source, indent_size, indent_character, max_char) {
		var Parser, multi_parser;
		function Parser() {
			this.pos = 0;
			this.token = '';
			this.current_mode = 'CONTENT';
			this.tags = {
				parent: 'parent1',
				parentcount: 1,
				parent1: ''
			};
			this.tag_type = '';
			this.token_text = this.last_token = this.last_text = this.token_type = '';
			this.Utils = {
				whitespace: "\n\r\t ".split(''),
				single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed'.split(','),
				extra_liners: 'head,body,/html'.split(','),
				in_array: function(what, arr) {
					for (var i = 0; i < arr.length; i++) {
						if (what === arr[i]) {
							return true;
						}
					}
					return false;
				}
			}
			this.get_content = function() {
				var char = '';
				var content = [];
				var space = false;
				while (this.input.charAt(this.pos) !== '<') {
					if (this.pos >= this.input.length) {
						return content.length ? content.join('') : ['', 'TK_EOF'];
					}
					char = this.input.charAt(this.pos);
					this.pos++;
					this.line_char_count++;
					if (this.Utils.in_array(char, this.Utils.whitespace)) {
						if (content.length) {
							space = true;
						}
						this.line_char_count--;
						continue;
					} else if (space) {
						if (this.line_char_count >= this.max_char) {
							content.push('\n');
							for (var i = 0; i < this.indent_level; i++) {
								content.push(this.indent_string);
							}
							this.line_char_count = 0;
						} else {
							content.push(' ');
							this.line_char_count++;
						}
						space = false;
					}
					content.push(char);
				}
				return content.length ? content.join('') : '';
			}
			this.get_script = function() {
				var char = '';
				var content = [];
				var reg_match = new RegExp('\<\/script' + '\>', 'igm');
				reg_match.lastIndex = this.pos;
				var reg_array = reg_match.exec(this.input);
				var end_script = reg_array ? reg_array.index : this.input.length;
				while (this.pos < end_script) {
					if (this.pos >= this.input.length) {
						return content.length ? content.join('') : ['', 'TK_EOF'];
					}
					char = this.input.charAt(this.pos);
					this.pos++;
					content.push(char);
				}
				return content.length ? content.join('') : '';
			}
			this.record_tag = function(tag) {
				if (this.tags[tag + 'count']) {
					this.tags[tag + 'count']++;
					this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
				} else {
					this.tags[tag + 'count'] = 1;
					this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
				}
				this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent;
				this.tags.parent = tag + this.tags[tag + 'count'];
			}
			this.retrieve_tag = function(tag) {
				if (this.tags[tag + 'count']) {
					var temp_parent = this.tags.parent;
					while (temp_parent) {
						if (tag + this.tags[tag + 'count'] === temp_parent) {
							break;
						}
						temp_parent = this.tags[temp_parent + 'parent'];
					}
					if (temp_parent) {
						this.indent_level = this.tags[tag + this.tags[tag + 'count']];
						this.tags.parent = this.tags[temp_parent + 'parent'];
					}
					delete this.tags[tag + this.tags[tag + 'count'] + 'parent'];
					delete this.tags[tag + this.tags[tag + 'count']];
					if (this.tags[tag + 'count'] == 1) {
						delete this.tags[tag + 'count'];
					} else {
						this.tags[tag + 'count']--;
					}
				}
			}
			this.get_tag = function() {
				var char = '';
				var content = [];
				var space = false;
				do {
					if (this.pos >= this.input.length) {
						return content.length ? content.join('') : ['', 'TK_EOF'];
					}
					char = this.input.charAt(this.pos);
					this.pos++;
					this.line_char_count++;
					if (this.Utils.in_array(char, this.Utils.whitespace)) {
						space = true;
						this.line_char_count--;
						continue;
					}
					if (char === "'" || char === '"') {
						if (!content[1] || content[1] !== '!') {
							char += this.get_unformatted(char);
							space = true;
						}
					}
					if (char === '=') {
						space = false;
					}
					if (content.length && content[content.length - 1] !== '=' && char !== '>' && space) {
						if (this.line_char_count >= this.max_char) {
							this.print_newline(false, content);
							this.line_char_count = 0;
						} else {
							content.push(' ');
							this.line_char_count++;
						}
						space = false;
					}
					content.push(char);
				} while (char !== '>');
				var tag_complete = content.join('');
				var tag_index;
				if (tag_complete.indexOf(' ') != -1) {
					tag_index = tag_complete.indexOf(' ');
				} else {
					tag_index = tag_complete.indexOf('>');
				}
				var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
				if (tag_complete.charAt(tag_complete.length - 2) === '/' || this.Utils.in_array(tag_check, this.Utils.single_token)) {
					this.tag_type = 'SINGLE';
				} else if (tag_check === 'script') {
					this.record_tag(tag_check);
					this.tag_type = 'SCRIPT';
				} else if (tag_check === 'style') {
					this.record_tag(tag_check);
					this.tag_type = 'STYLE';
				} else if (tag_check.charAt(0) === '!') {
					if (tag_check.indexOf('[if') != -1) {
						if (tag_complete.indexOf('!IE') != -1) {
							var comment = this.get_unformatted('-->', tag_complete);
							content.push(comment);
						}
						this.tag_type = 'START';
					} else if (tag_check.indexOf('[endif') != -1) {
						this.tag_type = 'END';
						this.unindent();
					} else if (tag_check.indexOf('[cdata[') != -1) {
						var comment = this.get_unformatted(']]>', tag_complete);
						content.push(comment);
						this.tag_type = 'SINGLE';
					} else {
						var comment = this.get_unformatted('-->', tag_complete);
						content.push(comment);
						this.tag_type = 'SINGLE';
					}
				} else {
					if (tag_check.charAt(0) === '/') {
						this.retrieve_tag(tag_check.substring(1));
						this.tag_type = 'END';
					} else {
						this.record_tag(tag_check);
						this.tag_type = 'START';
					}
					if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
						this.print_newline(true, this.output);
					}
				}
				return content.join('');
			}
			this.get_unformatted = function(delimiter, orig_tag) {
				if (orig_tag && orig_tag.indexOf(delimiter) != -1) {
					return '';
				}
				var char = '';
				var content = '';
				var space = true;
				do {
					char = this.input.charAt(this.pos);
					this.pos++
					if (this.Utils.in_array(char, this.Utils.whitespace)) {
						if (!space) {
							this.line_char_count--;
							continue;
						}
						if (char === '\n' || char === '\r') {
							content += '\n';
							for (var i = 0; i < this.indent_level; i++) {
								content += this.indent_string;
							}
							space = false;
							this.line_char_count = 0;
							continue;
						}
					}
					content += char;
					this.line_char_count++;
					space = true;
				} while (content.indexOf(delimiter) == -1);
				return content;
			}
			this.get_token = function() {
				var token;
				if (this.last_token === 'TK_TAG_SCRIPT') {
					var temp_token = this.get_script();
					if (typeof temp_token !== 'string') {
						return temp_token;
					}
					//token = js_beautify(temp_token, this.indent_size, this.indent_character, this.indent_level);
					//return [token, 'TK_CONTENT'];
					return [temp_token, 'TK_CONTENT'];
				}
				if (this.current_mode === 'CONTENT') {
					token = this.get_content();
					if (typeof token !== 'string') {
						return token;
					} else {
						return [token, 'TK_CONTENT'];
					}
				}
				if (this.current_mode === 'TAG') {
					token = this.get_tag();
					if (typeof token !== 'string') {
						return token;
					} else {
						var tag_name_type = 'TK_TAG_' + this.tag_type;
						return [token, tag_name_type];
					}
				}
			}
			this.printer = function(js_source, indent_character, indent_size, max_char) {
				this.input = js_source || '';
				this.output = [];
				this.indent_character = indent_character || ' ';
				this.indent_string = '';
				this.indent_size = indent_size || 2;
				this.indent_level = 0;
				this.max_char = max_char || 70;
				this.line_char_count = 0;
				for (var i = 0; i < this.indent_size; i++) {
					this.indent_string += this.indent_character;
				}
				this.print_newline = function(ignore, arr) {
					this.line_char_count = 0;
					if (!arr || !arr.length) {
						return;
					}
					if (!ignore) {
						while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
							arr.pop();
						}
					}
					arr.push('\n');
					for (var i = 0; i < this.indent_level; i++) {
						arr.push(this.indent_string);
					}
				}
				this.print_token = function(text) {
					this.output.push(text);
				}
				this.indent = function() {
					this.indent_level++;
				}
				this.unindent = function() {
					if (this.indent_level > 0) {
						this.indent_level--;
					}
				}
			}
			return this;
		}
		multi_parser = new Parser();
		multi_parser.printer(html_source, indent_character, indent_size);
		while (true) {
			var t = multi_parser.get_token();
			multi_parser.token_text = t[0];
			multi_parser.token_type = t[1];
			if (multi_parser.token_type === 'TK_EOF') {
				break;
			}
			switch (multi_parser.token_type) {
			case 'TK_TAG_START':
			case 'TK_TAG_SCRIPT':
			case 'TK_TAG_STYLE':
				multi_parser.print_newline(false, multi_parser.output);
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.indent();
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_TAG_END':
				multi_parser.print_newline(true, multi_parser.output);
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_TAG_SINGLE':
				multi_parser.print_newline(false, multi_parser.output);
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_CONTENT':
				if (multi_parser.token_text !== '') {
					multi_parser.print_newline(false, multi_parser.output);
					multi_parser.print_token(multi_parser.token_text);
				}
				multi_parser.current_mode = 'TAG';
				break;
			}
			multi_parser.last_token = multi_parser.token_type;
			multi_parser.last_text = multi_parser.token_text;
		}
		return multi_parser.output.join('');
	}
	return function(data) {
		var dataHolder = ['__dataHolder_', [Math.random(), Math.random(), Math.random(), Math.random()].join('_').replace(/[^0-9]/g, '_'), '_'].join('_');
		var dataHolders = {};
		var index = 0;
		data = data.replace(/(\")(data:[^\"]*)(\")/g, function($0, $1, $2, $3) {
			var name = dataHolder + index++;
			dataHolders[name] = $2;
			return $1 + name + $3;
		})
		data = style_html(data, 1, '\t', 0x10000000);
		data = data.replace(new RegExp(dataHolder + '[0-9]+', 'g'), function($0) {
			return dataHolders[$0];
		});
		return data;
	}
})();

htmlformat=function(){
  var value=page2.txt.value;
  var html=document.createElement("html");
  html.innerHTML=value;
  var script=html.querySelectorAll("script");
  //var script=html.getElementsByTagName("script");
  for(var i=0;i<script.length;i++){
      var code=script[i].innerHTML;
      var x=new CLASS_FORMAT(code)
      script[i].innerHTML=x.format();
  }
  var css=html.querySelectorAll("style");
  //var script=html.getElementsByTagName("script");
  for(var i=0;i<css.length;i++){
      var code=css[i].innerHTML;
      css[i].innerHTML=CSSdecode(code);
  }
  html=html.outerHTML;
  alert(html)
  html=HTMLFormat(html)
  alert(html)
}
htmlformat()