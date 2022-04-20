<!--
 * @Author: your name
 * @Date: 2021-09-08 09:50:51
 * @LastEditTime: 2021-10-25 15:15:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_demo\src\App.vue
-->
<template>
  <div id="app">
    <keep-alive :include="cacheList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      init: false,
    };
  },
  computed: {
    cacheList() {
      return this.$store.state.cacheList;
    },
  },
};
</script>
<style lang='less'>
html,
body{
  min-height: 100%;
}
#app {
  min-height: 100vh;
  background-color: #fafafa;
}

</style>
