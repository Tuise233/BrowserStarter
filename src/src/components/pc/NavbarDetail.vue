<template>
    <div class="detail">
        <a>起始页介绍</a>
        <a style="margin-top: 10px;">欢迎使用拉布拉马起始页</a>
        <a style="margin-top: 10px;">这是一个 <b>快速、简洁</b> 的浏览器起始页</a>
    </div> 
</template>

<script>
export default {

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

.detail{
    position: absolute;
    top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 280px;
    padding: 20px 0;
    margin-left: 16px;
    background-color: rgba(0, 0, 0, 0.6);
    font-family: 'PingFang';
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    transition: 1s all;
}

.detail a{
    width: 90%;
    height: auto;
}
</style>