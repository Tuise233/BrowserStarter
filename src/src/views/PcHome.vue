<template>
    <div class="container">
        <div class="navbar">
            <div class="pageTitle" v-on:click="toggleDetail">
                <img src="../assets/img/logo.jpg" />
                <a v-on:click="toggleBlur">拉布拉马起始页</a>
            </div>
            <NavbarDetail class="navbar-detail"></NavbarDetail>
            <div class="dataId">
            您的数据ID: 
            <span class="dataString" v-on:click="onClickData">{{dataId}}</span>
            </div>
        </div>
        <SearchBox ref="SearchBox"></SearchBox>
        <FavContainer ref="FavContainer"></FavContainer>
        <NewFavPanel ref="NewFavPanel"></NewFavPanel>
        <div class="loadPage"></div>
    </div>
</template>

<script>
import axios from "axios";

import NavbarDetail from "@/components/pc/NavbarDetail.vue";
import SearchBox from "@/components/pc/SearchBox.vue";
import FavContainer from "@/components/pc/FavContainer.vue";
import NewFavPanel from "@/components/pc/NewFavPanel.vue";

const apiUrl = "https://web.tuise233.cn:8081";

export default {
    data() {
        return {
            dataId: ""
        }
    },

    components:{
        NavbarDetail,
        SearchBox,
        FavContainer,
        NewFavPanel
    },

    methods: {
        getClass: function(name, index){
            return document.getElementsByClassName(name)[index];
        },

        toggleDetail: function(){
            var detail = this.getClass("navbar-detail", 0);
            var pageTitle = this.getClass("pageTitle", 0);
            if(detail.style.opacity == "0" || detail.style.opacity == ""){
                detail.style.opacity = "1";
                pageTitle.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            } else {
                detail.style.opacity = "0";
                pageTitle.style.backgroundColor = "";
            }
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

        //Component Events
        toggleBlur: function(state){
            this.$refs.SearchBox.toggleBlur(state);
        },

        toggleNewFavPanel: function(state){
            this.$refs.NewFavPanel.toggleNewFavPanel(state);
        },

        addNewFav: function(name, pic, url, color){
            this.$refs.FavContainer.addNewFav(name, pic, url, color);
        },

        underFavContainer: function(state){
            this.$refs.FavContainer.underFavContainer(state);
        }
    },

    created() {
        document.title = "拉布拉页";

        //判断是否拥有数据ID
        if(localStorage.getItem("dataid") == null){
            let dataid = Math.random().toString(36).substr(2);
            localStorage.setItem("dataid", dataid);
            this.dataId = dataid;
            axios.get(apiUrl + "/api/createDataId", {
                params: {
                    dataid: dataid
                }
            });
        } else {
            this.dataId = localStorage.getItem("dataid");
            //判断是否在数据库中
            axios.get(apiUrl + "/api/isExistDataId", {
                params: {
                    dataid: this.dataId
                }
            }).then((res) => {
                let type = res.data.type;
                switch(type){
                    case "unexist":{
                        //创建数据
                        axios.get(apiUrl + "/api/createDataId", {
                            params: {
                                dataid: this.dataId
                            }
                        });
                        break;
                    }
                }
            });
        }
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
}
</script>

<style>
*{
    padding: 0;
    margin: 0;
    user-select: none;
}

@font-face {
    font-family: "PingFang";
    src: url("@/assets/font/pingfang.ttf");
}

.container{
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-image: url('https://images.pexels.com/photos/9921341/pexels-photo-9921341.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    font-family: "PingFang";
}

.navbar{
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
}

.pageTitle{
    height: 50px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-left: 16px;
    margin-top: 16px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    transition: 0.3s;
    cursor: pointer;
}

.pageTitle img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.pageTitle a{
    display: inherit;
    width: auto;
    height: auto;
    margin-left: 16px;
}

.pageTitle:hover{
    background-color: rgba(0, 0, 0, 0.3);
}

.navbar-detail{
    opacity: 0;
}

.dataId{
    position: absolute;
    top: 15px;
    right: 15px;
    color: white;
    font-size: 14px;
}

.dataId span{
    cursor: pointer;
}

.loadPage{
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgb(70, 94, 99);
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    opacity: 1;
    transition: 1.0s all;
}
</style>