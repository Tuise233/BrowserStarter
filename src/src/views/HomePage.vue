<template>
  <div>
    <div class="container">
        <div class="navbar">
            <div class="pageTitle" v-on:click="clickDetail">
                <img src="../assets/img/logo.jpg" />
                <a>拉布拉马起始页</a>
            </div>

            <div class="detail">
                <a>起始页介绍</a>
                <a style="margin-top: 10px;">欢迎使用拉布拉马起始页</a>
                <a style="margin-top: 10px;">这是一个 <b>快速、简洁</b> 的浏览器起始页</a>
            </div>

            <div class="dataId">
            您的数据ID: 
            <span class="dataString" v-on:click="onClickData">{{dataid}}</span>
            </div>
        </div>

        <div class="dailySentence">
            <a>{{dailySentence}}</a>
            <a style="font-size: 13px;">{{dailySentenceEng}}</a>
        </div>

        <div class="searchBox" @mouseenter="onSearchEnter" @mouseleave="onSearchOut">
            <div class="searchSelect">
                <div class="searchItem" v-on:click="clickSearchEngine(0)">
                    <img src="../assets/img/baidu.png" />
                </div>
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(1)">
                    <img src="../assets/img/google.png" />
                </div>
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(2)">
                    <img src="../assets/img/github.png" />
                </div>  
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(3)">
                    <img src="../assets/img/bilibili.png" />
                </div>
            </div>
            
            <input class="searchInput" type="text" v-model="searchText" @focus="onSearchFocus" @blur="onSearchUnfocus" v-on:keyup.enter="engineSearch">
        </div>

        <div class="favContainer">
            <div v-if="favList[0].length != 0" class="favRow">
                <div class="favItem favItem1" v-for="(item,index) in favList[0]" :key="index" v-on:click="onClickFav(item.url)" :id="index">
                    <img v-if="item.pic != ''" :src="item.pic">
                    <div v-if="item.pic == ''" class="prevText">{{item.name[0]}}</div>
                    <span style="white-space: nowrap;">{{item.name}}</span>
                </div>
            </div>

            <div v-if="favList[1].length != 0" class="favRow">
                <div class="favItem favItem2" v-for="(item,index) in favList[1]" :key="index" v-on:click="onClickFav(item.url)">
                    <img v-if="item.pic != ''" :src="item.pic">
                    <div v-if="item.pic == ''" class="prevText">{{item.name[0]}}</div>
                    <span style="white-space: nowrap;">{{item.name}}</span>
                </div>
            </div>
            <!-- <div class="favRow">
                <div class="favItem">
                    <img src="../assets/img/bilibili.png">
                    <span>Bilibili</span>
                </div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
            </div>

            <div class="favRow">
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem"></div>
                <div class="favItem">
                    <img src="../assets/img/addon.png">
                    <span>新增</span>
                </div>
            </div> -->
        </div>

        <div class="searchMaskTop"></div>
        <div class="searchMaskBottom"></div>

        <div class="bottomInfo">
            <a>By: 拉布拉马</a>
        </div>
    </div>
    <div class="addFavContainer">
        <span style="font-size: 18px; margin-left: -240px;">添加链接</span>
        
        <img src="../assets/img/close.png" class="closeBtn" v-on:click="onClickAddClose">

        <span>链接名称</span>
        <input type="text" placeholder="请输入链接名称" v-model="prevName">

        <span>链接地址</span>
        <input type="text" placeholder="请输入链接地址" v-model="prevUrl">

        <span>链接颜色</span>
        <div style="width: 350px; height: 35px; display: flex; flex-direction: row; justify-content: center;">
            <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="R值" v-model="prevColorR" @change="onColorChange">
            <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="G值" v-model="prevColorG" @change="onColorChange">
            <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="B值" v-model="prevColorB" @change="onColorChange">
        </div>

        <span>链接图标</span>
        <button class="addIconBtn" v-on:click="onClickUploadIcon">上传</button>

        <div class="addPreview">
            <div class="previewItem">
                <img class="prevImage" v-if="prevIconUrl != ''" :src="prevIconUrl" />
                <div v-if="prevIconUrl == ''" class="prevText">{{prevName[0]}}</div>
                <div v-if="prevName != null">{{prevName}}</div>
            </div>
        </div>

        <button class="applyAddBtn" v-on:click="onClickApplyAdd">确定</button>
    </div>
    <input v-show="false" ref="fileRef" type="file" @change="onFileChange" />
    <div class="searchGlass" v-on:click="unfocusSearchEngine"></div>
    <div class="loadPage"></div>
  </div>
</template>

<script>
import axios from 'axios';

let apiUrl = "https://web.tuise233.cn:8081";
export default {
    data() {
        return {
            detailShow: false,
            searchFocus: false,
            searchEngineFocus: false,
            searchText: "",
            engineIndex: 0,
            enginePosition: ["180px", "60px", "-60px", "-180px"],
            engineUrl: [
                "https://www.baidu.com/s?ie=UTF-8&wd={textvalue}",
                "https://www.google.com/search?q={textvalue}",
                "https://github.com/search?q={textvalue}",
                "https://search.bilibili.com/all?keyword={textvalue}&from_source=webtop_search&spm_id_from=333.1007"
            ],

            dailySentence: "",
            dailySentenceEng: "",
            
            dataid: "",
            favList: [
                [],
                []
            ],

            prevIconUrl: "",
            prevIconFile: null,
            prevName: "",
            prevUrl: null,
            prevColorR: null,
            prevColorG: null,
            prevColorB: null
        }
    },

    created() {
        document.title = "拉布拉马起始页";

        axios.get(apiUrl + "/api/getSentence", {

        }).then((res) => {
            this.dailySentence = res.data.text;
            this.dailySentenceEng = res.data.translate;
            
            var dailySentence = this.getClass("dailySentence", 0);
            dailySentence.style.opacity = "1";
        });

        //判断是否拥有数据ID
        if(localStorage.getItem("dataid") == null){
            let dataid = Math.random().toString(36).substr(2);
            localStorage.setItem("dataid", dataid);
            this.dataid = dataid;
            axios.get(apiUrl + "/api/createDataId", {
                params: {
                    dataid: dataid
                }
            });
        } else {
            this.dataid = localStorage.getItem("dataid");
            //判断是否在数据库中
            axios.get(apiUrl + "/api/isExistDataId", {
                params: {
                    dataid: this.dataid
                }
            }).then((res) => {
                let type = res.data.type;
                switch(type){
                    case "unexist":{
                        //创建数据
                        axios.get(apiUrl + "/api/createDataId", {
                            params: {
                                dataid: this.dataid
                            }
                        });
                        break;
                    }
                }
            });
        }

        //获取列表 
        axios.get(apiUrl + "/api/getFav", {
            params: {
                dataid: this.dataid
            }
        }).then((res) => {
            let array = JSON.parse(res.data.result);
            console.log(array);
            if(array.length <= 6){
                if(array.length > 0){
                    for(let i = 0; i < array.length; i++){
                        this.favList[0].push({
                            name: array[i].name,
                            pic: array[i].pic,
                            url: array[i].url,
                            color: array[i].color
                        });
                    }
                }
            } else {
                for(let i = 0; i < 6; i++){
                    this.favList[0].push({
                        name: array[i].name,
                        pic: array[i].pic,
                        url: array[i].url,
                        color: array[i].color
                    });
                }

                for(let i = 6; i < array.length; i++){
                    this.favList[1].push({
                        name: array[i].name,
                        pic: array[i].pic,
                        url: array[i].url,
                        color: array[i].color
                    });
                }
            }

            //填充新增
            var favCount = this.favList[0].length + this.favList[1].length;
            if(favCount <= 6){
                if(favCount < 6){
                    this.favList[0].push({
                        name: "添加",
                        pic: require("../assets/img/addon.png"),
                        url: "",
                        color: "rgb(51, 51, 68)"
                    });
                } else {
                    this.favList[1].push({
                        name: "添加",
                        pic: require("../assets/img/addon.png"),
                        url: "",
                        color: "rgb(51, 51, 68)"
                    });
                }
            } else {
                if(favCount != 12){
                    this.favList[1].push({
                        name: "添加",
                        pic: require("../assets/img/addon.png"),
                        url: "",
                        color: "rgb(51, 51, 68)"
                    })
                }
            }

            setTimeout(() => {
                this.setFavData();
                setTimeout(() => {
                    var fav = this.getClass("favContainer", 0);
                    fav.style.opacity = "1";
                }, 500);
            }, 500);
        })
    },

    mounted() {
        let randomBack = [
            "https://images.pexels.com/photos/9921401/pexels-photo-9921401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://images.pexels.com/photos/9941707/pexels-photo-9941707.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
            "https://images.pexels.com/photos/9921341/pexels-photo-9921341.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://images.pexels.com/photos/11739438/pexels-photo-11739438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://images.pexels.com/photos/9921356/pexels-photo-9921356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"            
        ]

        var container = this.getClass("container", 0);
        var loadPage = this.getClass("loadPage", 0);
        container.style.backgroundImage = `url('${randomBack[Math.floor(Math.random() * randomBack.length)]}')`;
        setTimeout(() => {
            loadPage.style.opacity = "0";
            loadPage.style.zIndex = "-1";
        }, 500);
    },

    methods: {
        setFavData: function(){
            //设置颜色
            var fav1 = document.getElementsByClassName("favItem1");
            for(let i = 0; i < fav1.length; i++){
                fav1[i].children[0].style.backgroundColor = this.favList[0][i].color;
            }

            var fav2 = document.getElementsByClassName("favItem2");
            for(let i = 0; i < fav2.length; i++){
                fav2[i].children[1].style.backgroundColor = this.favList[1][i].color;
            }
        },

        isMobile: function(){
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            return flag;
        },

        getClass: function(name, count){
            return document.getElementsByClassName(name)[count];
        },
        
        clickDetail: function(){
            var title = this.getClass("pageTitle", 0);
            var detail = this.getClass("detail", 0);
            if(this.detailShow == false){
                title.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                detail.style.transition = "1s all";
                detail.style.opacity = "1";
                
            } else {
                title.style.backgroundColor = "";
                detail.style.transition = "0.5s all";
                detail.style.opacity = "0";
            }
            this.detailShow = !this.detailShow;
        },

        onSearchEnter: function(){
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            if(this.searchFocus == false){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                searchSelect.style.opacity = "0.5";
                searchInput.style.opacity = "0.5";
            }
        },

        onSearchOut: function(){
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            if(this.searchFocus == false){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                searchSelect.style.opacity = "0";
                searchInput.style.opacity = "0";
            }
        },

        onSearchFocus: function(){
            this.searchFocus = true;
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            var searchGlass = this.getClass("searchGlass", 0);
            searchBox.style.backgroundColor = "rgba(255, 255, 255)";
            searchSelect.style.opacity = "1";
            searchInput.style.opacity = "1";
            searchGlass.style.zIndex = "1";
            searchGlass.style.opacity = "1";
        },

        onSearchUnfocus: function(){
            this.searchFocus = false;
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            var searchGlass = this.getClass("searchGlass", 0);
            searchSelect.style.opacity = "0";
            searchInput.style.opacity = "0";
            searchGlass.style.zIndex = "-1";
            searchGlass.style.opacity = "0";
            if(searchBox.style.backgroundColor != "rgba(255, 255, 255)"){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            }
        },

        clickSearchEngine: function(index){
            if(this.searchEngineFocus == false){
                this.searchEngineFocus = true;
                this.onSearchFocus();
                this.onSearchEngineFocus();

                var fav = this.getClass("favContainer", 0);
                fav.style.opacity = "0";
                fav.style.zIndex = "0";
            }

            //切换元素
            if(this.engineIndex != index){
                var engines = document.getElementsByClassName("searchItem");
                var searchSelect = this.getClass("searchSelect", 0);
                for(let i = 0; i < engines.length; i++){
                    engines[i].setAttribute("class", engines[i].getAttribute("class").replace(" engineHide", ""));
                }
                for(let i = 0; i < engines.length; i++){
                    if(i == index){
                        this.engineIndex = index;
                        searchSelect.style.marginTop = this.enginePosition[index];
                    } else {
                        engines[i].setAttribute("class", engines[i].getAttribute("class").concat(" engineHide"));
                    }
                }
            }
        },

        unfocusSearchEngine: function(){
            if(this.searchEngineFocus == true){
                this.searchEngineFocus = false;
                this.onSearchUnfocus();
                this.onSearchEngineUnfocus();

                var fav = this.getClass("favContainer", 0);
                fav.style.opacity = "1";
                fav.style.zIndex = "11";
            }
        },

        onSearchEngineFocus: function(){
            var engines = document.getElementsByClassName("searchItem");
            var searchBox = this.getClass("searchBox", 0);
            searchBox.style.zIndex = 11;
            //显示全部搜索引擎
            for(let i = 0; i < engines.length; i++){
                engines[i].style.opacity = "1";
            }
        },

        onSearchEngineUnfocus: function(){
            var engines = document.getElementsByClassName("searchItem");
             var searchBox = this.getClass("searchBox", 0);
            searchBox.style.zIndex = 8;
            //隐藏未被选中的搜索引擎
            for(let i = 0; i < engines.length; i++){
                if(i != this.engineIndex){
                    engines[i].style.opacity = "0";
                }
            }
        },

        engineSearch: function(){
            let url = String(this.engineUrl[this.engineIndex]).replace("{textvalue}", this.searchText);
            axios.get(apiUrl + '/api/search', {
                params: {
                    keyword: this.searchText
                }
            });
            window.open(url, "_self");
        },

        onClickData: function(){
            var input = document.createElement("input");
            input.value = this.dataid;
            document.body.appendChild(input);
            input.select();
            document.execCommand("Copy");
            document.body.removeChild(input);
            alert("成功复制数据ID，请及时保存");
        },

        onClickFav: function(url){
            if(url == ""){
                //打开新增数据表
                var addPanel = this.getClass("addFavContainer", 0);
                var glass = this.getClass("searchGlass", 0);
                glass.style.zIndex = "98";
                glass.style.opacity = "1";
                addPanel.style.zIndex = "99";
                addPanel.style.opacity = "1";
            } else {
                window.open(url, "_self");
            }
        },

        onClickAddClose: function(){
            var addPanel = this.getClass("addFavContainer", 0);
            var glass = this.getClass("searchGlass", 0);
            glass.style.zIndex = "-1";
            glass.style.opacity = "0";
            addPanel.style.zIndex = "-1";
            addPanel.style.opacity = "0";
        },

        onClickUploadIcon: function(){
            this.$refs.fileRef.dispatchEvent(new MouseEvent('click'));
        },

        onClickApplyAdd: function(){
            /*
            prevIconUrl: null,
            prevIconFile: null,
            prevName: null,
            prevUrl: null,
            prevColorR: null,
            prevColorG: null,
            prevColorB: null
            */
            //rgb(51, 51, 68)
            let colorR = null;
            let colorG = null;
            let colorB = null;
            if(this.prevColorR == null && this.colorG == null && this.colorB == null){
                colorR = 51;
                colorG = 51;
                colorB = 68;
            } else {
                colorR = this.prevColorR == null ? 0 : this.prevColorR;
                colorG = this.prevColorG == null ? 0 : this.prevColorG;
                colorB = this.prevColorB == null ? 0 : this.prevColorB;
            }
            let iconUrl = this.prevIconUrl;
            let name = this.prevName;
            let url = this.prevUrl;
            let color = `rgb(${colorR},${colorG},${colorB})`;
            let dataid = localStorage.getItem("dataid");
            
            if(name == ""){
                alert("请填写链接名称");
            } else if(url == null){
                alert("请填写链接地址");
            } else {
                //保存链接
                //console.log(`${iconUrl} ${name} ${url} ${color} ${dataid}`);
                const datas = new URLSearchParams();
                datas.append("dataid", dataid);
                datas.append("color", color);
                datas.append("name", name);
                datas.append("url", url);
                datas.append("pic", iconUrl);
                axios.post(apiUrl + "/api/createFav", datas).then((res) => {
                    var addPanel = this.getClass("addFavContainer", 0);
                    var glass = this.getClass("searchGlass", 0);
                    glass.style.zIndex = "-1";
                    glass.style.opacity = "0";
                    addPanel.style.zIndex = "-1";
                    addPanel.style.opacity = "0";
                });
                //添加到列表中
                if(this.favList[0].length <= 6){
                    if(this.favList[0].length <= 5){
                        this.favList[0].splice(this.favList[0].length - 1, 1);
                        this.favList[0].push({
                            name: name,
                            pic: iconUrl,
                            url: url,
                            color: color
                        });
                        this.favList[0].push({
                            name: "添加",
                            pic: require("../assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        });
                    } else if(this.favList[0].length == 6){
                        this.favList[0].splice(5, 1);
                        this.favList[0].push({
                            name: name,
                            pic: iconUrl,
                            url: url,
                            color: color
                        });
                        this.favList[1].push({
                            name: "添加",
                            pic: require("../assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        });
                    }
                } else {
                    if(this.favList[1].length < 6){
                        if(this.favList[1].length <= 5){
                            this.favList[0].splice(this.favList[1].length - 1, 1);
                            this.favList[1].push({
                                name: name,
                                pic: iconUrl,
                                url: url,
                                color: color
                            });
                            this.favList[1].push({
                                name: "添加",
                                pic: require("../assets/img/addon.png"),
                                url: "",
                                color: "rgb(51, 51, 68)"
                            });
                        } else {
                            this.favList[1].splice(5, 1);
                            this.favList[1].push({
                                name: name,
                                pic: iconUrl,
                                url: url,
                                color: color
                            });
                        }
                    }
                }

                //重新设置颜色
                setTimeout(() => {
                    this.setFavData();
                }, 500);
            }
        },

        onFileChange: function(obj){
            let _this = this;
            var files = obj.target.files[0];
            if(!obj || !window.FileReader) return;
            let reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = () => {
                _this.prevIconUrl = reader.result;
            };
        },

        onColorChange: function(){
            var image = this.getClass("prevImage", 0);
            var text = this.getClass("prevText", 0);
            if(image != null){
                if(this.prevColorR != null && this.prevColorG != null || this.prevColorB != null){
                    image.style.backgroundColor = `rgb(${this.prevColorR},${this.prevColorG},${this.prevColorB})`;
                } else {
                    image.style.backgroundColor = "";
                }
            } else if(text != null){
                if(this.prevColorR != null && this.prevColorG != null || this.prevColorB != null){
                    text.style.backgroundColor = `rgb(${this.prevColorR},${this.prevColorG},${this.prevColorB})`;
                } else {
                    text.style.backgroundColor = "";
                }
            }
        }
    },
}
</script>

<style>
    @import "../assets/css/homepage.css";
    @import "https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css";
</style>