<template>
  <div>

  </div>
</template>

<script>
export default {
    created() {
        //判断是否是手机端
        if(this.isMobile()){
            this.$router.push({
                path: '/pe'
            });
        } else {
            this.$router.push({
                path: '/pc'
            });
        }
    },

    methods: {
        isMobile: function(){
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            return flag;
        }
    },
}
</script>

<style>

</style>