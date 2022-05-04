<template>
  <div>
        <div class="addFavContainer">
            <span style="font-size: 18px; margin-left: -240px;">添加链接</span>
            
            <img src="@/assets/img/close.png" class="closeBtn" v-on:click="onClickAddClose">

            <span>链接名称</span>
            <input type="text" placeholder="请输入链接名称" v-model="prevName">

            <span>链接地址</span>
            <input type="text" placeholder="请输入链接地址" v-model="prevUrl">

            <span>链接颜色</span>
            <div style="width: 350px; height: 35px; display: flex; flex-direction: row; justify-content: center;">
                <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="R值" v-model="prevColorR" @input="onColorChange">
                <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="G值" v-model="prevColorG" @input="onColorChange">
                <input class="disableScroll" style="width: 15%; margin: 0 6px;" type="number" placeholder="B值" v-model="prevColorB" @input="onColorChange">
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
  </div>
</template>

<script>
import axios from "axios";

const apiUrl = "https://web.tuise233.cn:8081";

export default {
    data() {
        return {
            prevName: "",
            prevUrl: "",
            prevColorR: null,
            prevColorG: null,
            prevColorB: null,
            prevIconUrl: ""
        }
    },

    methods: {
        getClass: function(name, count){
            return document.getElementsByClassName(name)[count];
        },

        onClickAddClose: function(){
            this.toggleNewFavPanel(false);
            this.$parent.toggleBlur(false);
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
        },

        onClickUploadIcon: function(){
            this.$refs.fileRef.dispatchEvent(new MouseEvent('click'));
        },

        onClickApplyAdd: function(){
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
                const datas = new URLSearchParams();
                datas.append("dataid", dataid);
                datas.append("color", color);
                datas.append("name", name);
                datas.append("url", url);
                datas.append("pic", iconUrl);
                axios.post(apiUrl + "/api/createFav", datas).then((res) => {
                    this.$parent.toggleBlur(false);
                    this.toggleNewFavPanel(false);
                });
                
                this.$parent.addNewFav(name, iconUrl, url, color);
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

        //Component Events
        toggleNewFavPanel: function(state){
            if(state){
                var panel = this.getClass("addFavContainer", 0);
                panel.style.zIndex = "99";
                panel.style.opacity = "1";
            } else {
                var panel = this.getClass("addFavContainer", 0);
                panel.style.zIndex = "-1";
                panel.style.opacity = "0";
            }
        },
    },
}
</script>

<style>
.addFavContainer{
    z-index: -1;
    width: 300px;
    height: 680px;
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    top: 10%;
    background-color: #3b3b44;
    opacity: 1;
    transition: 1s all;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-family: "pingfang";
    color: white;
    padding: 0 20px;
    transition: 0.5s all;
    opacity: 0;
}

.addFavContainer span{
    font-size: 13px;
    margin-left: -250px;
    margin-top: 20px;
    margin-bottom: 5px;
}

.addFavContainer input{
    width: 270px;
    height: 35px;
    border-radius: 5px;
    background-color: #2f2f37;
    border: 1px solid #1c1c21;
    padding: 0 20px;
    outline: none;
    color: #888;
}

.addIconBtn{
    height: 45px;
    width: 100%;
    border-radius: 5px;
    background-color: #2f2f37;
    border: none    ;
    font-family: "pingfang";
    color: white;
    font-size: 14px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: 1.0s all;
}

.addIconBtn:hover{
    background-color: #25252b;
}

.addPreview{
    width: 100%;
    height: 200px;
    border-radius: 5px;
    background-color: #2f2f37;
    border: 1px solid #1c1c21;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.previewItem{
    width: 70px;
    height: 70px;
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
}

.previewItem img{
    width: 25px;
    height: 25px;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    background-color: white;
}

.prevImage{
    width: 25px;
    height: 25px;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
}

.prevText{
    font-size: 25px;
    margin-bottom: 5px;
    width: 45px;
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
}

.applyAddBtn{
    margin-top: 20px;
    margin-left: 240px;
    width: 70px;
    height: 35px;
    border-radius: 5px;  
    background-color: #2f2f37;
    border: none    ;
    font-family: "pingfang";
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: 1.0s all;
    outline: none;
}

.applyAddBtn:hover{
    background-color: #25252b;
}
</style>