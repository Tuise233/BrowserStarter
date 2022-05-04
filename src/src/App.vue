<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
    created() {
        if(this.$route.path !== "/"){
            this.$router.push("/");
        }

        if(this.isMobile()){
            if(this.$route.path !== "/pe"){
                this.$router.push("/pe");
            }
        } else {
            if(this.$route.path !== "/pc"){
                this.$router.push("/pc");
            }
        }
    },

    methods: {
        isMobile: function(){
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            return flag != null;
        }
    },
}
</script>

<style>

</style>
