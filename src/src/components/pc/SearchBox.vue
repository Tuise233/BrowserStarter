<template>
    <div>
        <div class="dailySentence">
            <a>{{dailySentence}}</a>
            <a style="font-size: 13px;">{{dailySentenceEng}}</a>
        </div>
        <div class="searchBox" @mouseenter="onSearchEnter" @mouseleave="onSearchOut">
            <div class="searchSelect">
                <div class="searchItem" v-on:click="clickSearchEngine(0)">
                    <img src="@/assets/img/baidu.png" />
                </div>
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(1)">
                    <img src="@/assets/img/google.png" />
                </div>
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(2)">
                    <img src="@/assets/img/github.png" />
                </div>  
                <div class="searchItem engineHide" v-on:click="clickSearchEngine(3)">
                    <img src="@/assets/img/bilibili.png" />
                </div>
            </div>

            <input class="searchInput" type="text" v-model="searchText" @focus="onSearchFocus" @blur="onSearchUnfocus" v-on:keyup.enter="engineSearch">
        </div>
        <div class="searchMaskTop"></div>
        <div class="searchMaskBottom"></div>
        <div class="searchGlass" v-on:click="unfocusSearchEngine"></div>
    </div>
</template>

<script>
import axios from 'axios';

const apiUrl = "https://web.tuise233.cn:8081";
export default {
    data() {
        return {
            dailySentence: "",
            dailySentenceEng: "",
            searchText: "",
            engineIndex: 0,
            enginePosition: ["180px", "60px", "-60px", "-180px"],
            engineUrl: [
                "https://www.baidu.com/s?ie=UTF-8&wd={textvalue}",
                "https://www.google.com/search?q={textvalue}",
                "https://github.com/search?q={textvalue}",
                "https://search.bilibili.com/all?keyword={textvalue}&from_source=webtop_search&spm_id_from=333.1007"
            ],

            //UI state
            searchBoxFocus: false,
            searchSelectFocus: false
        }
    },

    created() {
        axios.get(apiUrl + "/api/getSentence",{}).then((res) => {
            this.dailySentence = res.data.text;
            this.dailySentenceEng = res.data.translate;
            var dailySentence = this.getClass("dailySentence", 0);
            dailySentence.style.opacity = "1";
        });
    },

    methods: {
        getClass: function(name, count){
            return document.getElementsByClassName(name)[count];
        },

        onSearchEnter: function(){
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            if(searchSelect.style.opacity == "0" || searchSelect.style.opacity == ""){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                searchSelect.style.opacity = "0.5";
                searchInput.style.opacity = "0.5";
            }
        },

        onSearchOut: function(){
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            if(searchSelect.style.opacity == "0.5"){
                searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                searchSelect.style.opacity = "0";
                searchInput.style.opacity = "0";
            }
        },

        onSearchFocus: function(){
            var searchBox = this.getClass("searchBox", 0);
            var searchSelect = this.getClass("searchSelect", 0);
            var searchInput = this.getClass("searchInput", 0);
            var searchGlass = this.getClass("searchGlass", 0);
            searchBox.style.backgroundColor = "rgba(255, 255, 255)";
            searchSelect.style.opacity = "1";
            searchInput.style.opacity = "1";
            searchGlass.style.zIndex = "2";
            searchGlass.style.opacity = "1";
            this.searchBoxFocus = true;
        },

        onSearchUnfocus: function(){
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
            this.searchBoxFocus = false;
        },

        clickSearchEngine: function(index){
            if(this.searchSelectFocus == false){
                this.$parent.underFavContainer(true);
                this.onSearchFocus();
                this.onSearchEngineFocus();
                this.searchSelectFocus = true;
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
           if(this.searchSelectFocus == true){
               this.onSearchUnfocus();
               this.onSearchEngineUnfocus();
               this.$parent.underFavContainer(false);
               this.searchSelectFocus = false;
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

        //Components Event
        toggleBlur: function(state){
            var blur = this.getClass("searchGlass", 0);
            if(state){
                blur.style.zIndex = "2";
                blur.style.opacity = "1";
            } else {
                blur.style.zIndex = "-1";
                blur.style.opacity = "0";
            }
        }
    },
}
</script>

<style>
.dailySentence{
    z-index: 20;
    width: auto;
    height: 40px;
    font-family: 'PingFang';
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    transition: 1s all;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: calc((30% - 30px));
    opacity: 0;
}

.searchBox{
    z-index: 9;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 30%;
    width: 600px;
    height: 60px;
    border: none;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 17px;
    transition: 0.5s all;
}

.engineHide{
    opacity: 0;
    background-color: rgba(255, 255, 255, 0.1);
}

.engineHide:hover{
    background-color: rgba(255, 255, 255, 0.3);
}

.searchSelect{
    margin-top: 180px;
    width: 60px;
    height: auto;
    background-color: transparent;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    transition: 1s all;
    outline: none;
    opacity: 0;
}

.searchMaskTop{
    z-index: 10;
    position: absolute;
    top: calc(30% - 180px);
    left: calc((100% - 600px) / 2);
    width: 60px;
    height: 180px;
}

.searchMaskBottom{
    z-index: 10;
    position: absolute;
    top: calc(30% + 60px);
    left: calc((100% - 600px) / 2);
    width: 60px;
    height: 180px;
}

.searchItem{
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.5s all;
}

.searchItem img{
    position: absolute;
    width: 20px;
    height: 20px;
}

.searchInput{
    width: 560px;
    height: 60px;
    outline: none;
    border: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: transparent;
    font-size: 16px;
    font-family: 'PingFang';
    color: black;
    opacity: 0;
    transition: 1s all;
}

.searchGlass{
    z-index: -1;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;   
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    transition: 1s all;
    opacity: 0;
}

.searchGlass{
    z-index: -1;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;   
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    transition: 1s all;
    opacity: 0;
}

.searchMaskTop{
    z-index: 10;
    position: absolute;
    top: calc(30% - 180px);
    left: calc((100% - 600px) / 2);
    width: 60px;
    height: 180px;
}

.searchMaskBottom{
    z-index: 10;
    position: absolute;
    top: calc(30% + 60px);
    left: calc((100% - 600px) / 2);
    width: 60px;
    height: 180px;
}
</style>