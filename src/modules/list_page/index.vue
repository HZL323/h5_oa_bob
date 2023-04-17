<!--
 * @Author: your name
 * @Date: 2021-09-10 09:55:35
 * @LastEditTime: 2021-10-20 17:43:55
 * @LastEditors: Please set LastEditors
 * @Description: 待办、已办、已阅列表查询
 * @FilePath: \vue_demo\src\modules\list_page\index.vue
-->
<template>
  <div class="home-wrap">
    <div class="header-wrap">
      <van-nav-bar
        :title="navTitle"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        placeholder
      />
      <!-- <van-sticky offset-top="46"> -->
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        shape="round"
      ></van-search>
      <!-- </van-sticky> -->
    </div>

    <div class="list-content content-wrap">
      <DropList :key="key" ref="dropList" :searchParams="searchParams" />
    </div>
  </div>
</template>

<script>
import { NavBar, Search, Sticky } from "vant";
import DropList from "../../components/DropList.vue";
export default {
  name: "listPage",
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Sticky.name]: Sticky,
    DropList,
  },
  data() {
    return {
      active: 0,
      key: "bj",
      value: "",
      //searchParams: {}
    };
  },
  computed: {
    navTitle() {
      return this.getNavTitle(this.$store.state.currentList);
    },
    refresh() {
      return this.$store.state.refresh;
    },
    searchParams() {
      return {
        title: this.value,
      };
    },
  },
  activated() {
    if (this.refresh) {
      this.key = new Date().getTime();
    }
  },
  methods: {
    getNavTitle(type) {
      switch (type) {
        case "todo":
          return "公文待办列表";
        case "doing":
          return "已办列表";
        case "toread":
          return "待阅列表";
        case "seal":
          return "用印待办列表";
        default:
          return "";
      }
    },
    onClickLeft() {
      this.value = "";
      this.$store.commit("setRefresh", false);
      this.$router.replace({
        name: "home",
      });
    },
    onSearch() {
      this.$refs.dropList.onRefresh();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.home-wrap {
  height: 100%;

  .header-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .content-wrap {
    position: absolute;
    top: 100px;
    left: 0;
    margin: auto;
    bottom: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
