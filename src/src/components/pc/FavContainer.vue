<template>
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
                <img src="@/assets/img/bilibili.png">
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
                <img src="@/assets/img/addon.png">
                <span>新增</span>
            </div>
        </div> -->
    </div>
</template>

<script>
import axios from "axios";

const apiUrl = "https://web.tuise233.cn:8081";

export default {
    data() {
        return {
            favList: [ [], [] ]
        }
    },

    created() {
        this.getFavData();
    },

    methods: {
        getClass: function(name, count){
            return document.getElementsByClassName(name)[count];
        },

        getFavData: function(){
            //获取列表 
            axios.get(apiUrl + "/api/getFav", {
                params: {
                    dataid: this.dataid
                }
            }).then((res) => {
                let array = JSON.parse(res.data.result);
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
                            pic: require("@/assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        });
                    } else {
                        this.favList[1].push({
                            name: "添加",
                            pic: require("@/assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        });
                    }
                } else {
                    if(favCount != 12){
                        this.favList[1].push({
                            name: "添加",
                            pic: require("@/assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        })
                    }
                }

                setTimeout(() => {
                    this.setFavData();
                    setTimeout(() => {
                        var fav = this.getClass("favContainer", 0);
                        fav.style.zIndex = "11";
                        fav.style.opacity = "1";
                    }, 500);
                }, 500);
            })
        },

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
        
        onClickFav: function(url){
            if(url == ""){
                //打开新增数据表
                this.$parent.toggleBlur(true);
                this.$parent.toggleNewFavPanel(true);
            } else {
                window.open(url, "_self");
            }
        },

        //Component Events
        addNewFav: function(name, pic, url, color){
            //添加到列表中
            if(this.favList[0].length <= 6){
                if(this.favList[0].length <= 5){
                    this.favList[0].splice(this.favList[0].length - 1, 1);
                    this.favList[0].push({
                        name: name,
                        pic: pic,
                        url: url,
                        color: color
                    });
                    this.favList[0].push({
                        name: "添加",
                        pic: require("@/assets/img/addon.png"),
                        url: "",
                        color: "rgb(51, 51, 68)"
                    });
                } else if(this.favList[0].length == 6){
                    this.favList[0].splice(5, 1);
                    this.favList[0].push({
                        name: name,
                        pic: pic,
                        url: url,
                        color: color
                    });
                    this.favList[1].push({
                        name: "添加",
                        pic: require("@/assets/img/addon.png"),
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
                            pic: pic,
                            url: url,
                            color: color
                        });
                        this.favList[1].push({
                            name: "添加",
                            pic: require("@/assets/img/addon.png"),
                            url: "",
                            color: "rgb(51, 51, 68)"
                        });
                    } else {
                        this.favList[1].splice(5, 1);
                        this.favList[1].push({
                            name: name,
                            pic: pic,
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
        },

        underFavContainer: function(state){
            var fav = this.getClass("favContainer", 0);
            if(state){
                fav.style.opacity = "0";
            } else {
                fav.style.opacity = "1";
            }
        }
    },
}
</script>

<style>
.favContainer{
    z-index: 11;
    width: 600px;
    height: 180px;
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    top: 40%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition: 0.5s all;
    opacity: 0;
}

.favRow{
    width: 100%;
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.favItem{
    width: 70px;
    height: 70px;
    /* background-color: rgba(255, 255, 255, 0.3); */
    margin: 0 15px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    font-family: "pingfang";
    color: white;
    font-weight: 550;
    font-size: 12px;
    letter-spacing: 1px;

    cursor: pointer;
}

.favItem img{
    width: 25px;
    height: 25px;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
}

.disableScroll::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
 
.disableScroll[type="number"] {
    -moz-appearance: textfield;
}

.closeBtn{
    position: absolute;
    width: 25px;
    height: 25px;
    right: -5px;
    margin: 20px;
    cursor: pointer;
    outline: none;
}
</style>