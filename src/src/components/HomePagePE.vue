<template>
  <div>
    <div class="pecontainer">
        <div class="penavbar">
            <div class="pepageTitle" v-on:click="clickDetail">
                <img src="../assets/img/logo.jpg" />
                <a>拉布拉马起始页</a>
            </div>

            <div class="pedetail">
                <a>起始页介绍</a>
                <a style="margin-top: 5px;">欢迎使用拉布拉马起始页</a>
                <a style="margin-top: 5px;">这是一个 <b>快速、简洁</b> 的浏览器起始页</a>
            </div>

            <div class="pedailySentence">
                <a>{{dailySentence}}</a>
                <a style="font-size: 9px;">{{dailySentenceEng}}</a>
            </div>
        </div>

        <div class="pesearchBox" @mouseenter="onSearchEnter" @mouseleave="onSearchOut">
            <div class="pesearchSelect">
                <div class="pesearchItem" v-on:click="clickSearchEngine(0)">
                    <img src="../assets/img/baidu.png" />
                </div>
                <div class="pesearchItem engineHide" v-on:click="clickSearchEngine(1)">
                    <img src="../assets/img/google.png" />
                </div>
                <div class="pesearchItem engineHide" v-on:click="clickSearchEngine(2)">
                    <img src="../assets/img/github.png" />
                </div>  
                <div class="pesearchItem engineHide" v-on:click="clickSearchEngine(3)">
                    <img src="../assets/img/bilibili.png" />
                </div>
            </div>
            
            <input class="pesearchInput" type="text" v-model="searchText" @focus="onSearchFocus" @blur="onSearchUnfocus" v-on:keyup.enter="engineSearch">
        </div>

        <div class="pesearchMaskTop"></div>
        <div class="pesearchMaskBottom"></div>

        <div class="pebottomInfo">
            <a>By: 拉布拉马</a>
        </div>
    </div>
    <div class="pesearchGlass" v-on:click="unfocusSearchEngine"></div>
    <div class="peloadPage"></div>
  </div>
</template>

<script>
import axios from 'axios';

let apiUrl = "http://web.tuise233.cn:8081";
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
        }
    },

    created() {
        document.title = "拉布拉马起始页";

        //判断是否是手机端
        if(this.isMobile()){
            console.log("is mobile");
        } else {
            this.$router.push({
                path: '/'
            });
        }

        axios({
            method: "GET",
            url: apiUrl + "/api/getSentence"
        }).then((res) => {
            console.log(res);
            this.dailySentence = res.data.text;
            this.dailySentenceEng = res.data.translate;
            
            var dailySentence = this.getClass("pedailySentence", 0);
            dailySentence.style.opacity = "1";
        });
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
        
        var container = this.getClass("pecontainer", 0);
        var peloadPage = this.getClass("peloadPage", 0);
        container.style.backgroundImage = `url('${randomBack[Math.floor(Math.random() * randomBack.length)]}')`;
        setTimeout(() => {
            peloadPage.style.opacity = "0";
            peloadPage.style.zIndex = "-1";
        }, 500);
    },

    methods: {
        isMobile: function(){
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            return flag;
        },

        getClass: function(name, count){
            return document.getElementsByClassName(name)[count];
        },
        
        clickDetail: function(){
            var title = this.getClass("pepageTitle", 0);
            var detail = this.getClass("pedetail", 0);
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
            var searchBox = this.getClass("pesearchBox", 0);
            var searchSelect = this.getClass("pesearchSelect", 0);
            var searchInput = this.getClass("pesearchInput", 0);
            if(this.searchFocus == false){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                searchSelect.style.opacity = "0.5";
                searchInput.style.opacity = "0.5";
            }
        },

        onSearchOut: function(){
            var searchBox = this.getClass("pesearchBox", 0);
            var searchSelect = this.getClass("pesearchSelect", 0);
            var searchInput = this.getClass("pesearchInput", 0);
            if(this.searchFocus == false){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                searchSelect.style.opacity = "0";
                searchInput.style.opacity = "0";
            }
        },

        onSearchFocus: function(){
            this.searchFocus = true;
            var searchBox = this.getClass("pesearchBox", 0);
            var searchSelect = this.getClass("pesearchSelect", 0);
            var searchInput = this.getClass("pesearchInput", 0);
            var searchGlass = this.getClass("pesearchGlass", 0);
            searchBox.style.backgroundColor = "rgba(255, 255, 255)";
            searchSelect.style.opacity = "1";
            searchInput.style.opacity = "1";
            searchGlass.style.zIndex = "1";
            searchGlass.style.opacity = "1";
        },

        onSearchUnfocus: function(){
            this.searchFocus = false;
            var searchBox = this.getClass("pesearchBox", 0);
            var searchSelect = this.getClass("pesearchSelect", 0);
            var searchInput = this.getClass("pesearchInput", 0);
            var searchGlass = this.getClass("pesearchGlass", 0);
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
            }

            //切换元素
            if(this.engineIndex != index){
                var engines = document.getElementsByClassName("pesearchItem");
                var searchSelect = this.getClass("pesearchSelect", 0);
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
            }
        },

        onSearchEngineFocus: function(){
            var engines = document.getElementsByClassName("pesearchItem");
            var searchBox = this.getClass("pesearchBox", 0);
            searchBox.style.zIndex = 11;
            //显示全部搜索引擎
            for(let i = 0; i < engines.length; i++){
                engines[i].style.opacity = "1";
            }
        },

        onSearchEngineUnfocus: function(){
            var engines = document.getElementsByClassName("pesearchItem");
             var searchBox = this.getClass("pesearchBox", 0);
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
        }
    },
}
</script>

<style>
    @import "../assets/css/homepagepe.css";
    @import "https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css";
</style>