<!--
 * @Author: your name
 * @Date: 2021-09-14 13:52:34
 * @LastEditTime: 2021-12-07 14:59:26
 * @LastEditors: Please set LastEditors
 * @Description: 列表组件
 * @FilePath: \vue_demo\src\components\DropList.vue
-->
<template>
  <div class="droplist-wrap">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <template v-if="!empty">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="(item, index) in list"
            :key="index"
            class="wut-card"
            @click="rowClick(item)"
          >
            <div class="wu-list">
              <div v-if="state !='closed.completed' && state!='closed.terminated' && item.priority === '001'">
                  <img style="height:40px;" src ="../assets/img/icon_flag_blue.png"></div>
                  <div v-if="state !='closed.completed' && state!='closed.terminated' && item.priority === '002'">
                  <img style="height:40px;" src ="../assets/img/icon_flag_yellow.png"></div>
                  <div v-if="state !='closed.completed' && state!='closed.terminated' && item.priority === '003'">
                  <img style="height:40px;" src ="../assets/img/icon_flag_red.png"></div>
                  <div v-if="item.priority ===null || item.priority ===''">
                  <img style="height:40px;" src ="../assets/img/icon_flag_white.png"></div>
              <div class="wu-list-content">
                <div class="title">{{ item.title }}</div>
                <div class="content-intro">
                  <div>{{ item.actCreateTime }}</div>
                  <div class="divider"></div>
                  <div>{{ item.workitemName }}</div>
                </div>
              </div>
              <div class="wuicon-right">
                <van-icon name="arrow" size="24" />
              </div>
            </div>
          </div>
        </van-list>
      </template>
      <wu-feedback v-else types="empty" />
    </van-pull-refresh>
  </div>
</template>

<script>
import { api } from "../core/api/index";
import { PullRefresh, List, Icon } from "vant";
export default {
  name: "dropList",
  components: {
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Icon.name]: Icon,
  },
  data() {
    return {
      refreshing: false, // 下拉刷新标识
      loading: false, // 列表加载标识
      finished: false, // 数据加载完成标识
      list: [], // 数据列表
      empty: false, // 暂无数据组件显示标识
      curPage: 1, // 分页查询页码
      pageSize: 10, // 每页查询条目数
      allDataCount: 0, // 总条目数
    };
  },
  computed: {
    params() {
      return {
        curPage: this.curPage,
        pageSize: this.pageSize,
        userCode: this.$store.state.userInfo.userCode,
      };
    }, // 查询参数
    currentList() {
      return this.$store.state.currentList;
    }, // 查询url
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    onRefresh() {
      // 下拉刷新
      this.list = [];
      this.curPage = 1;
      this.refreshing = false;
      this.isLoading = false;
      this.finished = false;
      this.empty = false;
      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      // 加载数据
      if (this.currentList === "doing") {
        document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML="我的已办"
        api
          .list({
            ...this.params,
          })
          .then((res) => {
            this.allDataCount = res.data.model.dataCount;
            res.data.model.pageData.forEach((item) => {
              //item.actCreateTime = this.$format("YYYY-mm-dd", item.createDate);
              this.list.push(item);
            });
            this.loading = false;
            this.curPage++;
            if (this.list.length === 0) {
              this.empty = true;
            }
            if (this.list.length >= this.allDataCount) {
              this.finished = true;
            }
            this.navTitle = "我的已办";
            // if(this.allDataCount>0){
            //     document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML=
            //     this.navTitle+"(99+)";
            // }else{
                document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML=
                this.navTitle+"("+this.allDataCount+")";
            //}
            
          });
      } else {
        if(this.currentList === "todo"){
          document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML="我的公文待办";
        }else if(this.currentList === "seal"){
          document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML="我的用印待办";
        }else{
          document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML="我的待阅";
        }
        api
          .queryList({ ...this.params, queryKind: this.currentList })
          .then((res) => {
            //console.log("currentList");
            this.allDataCount = res.data.model.allDataCount;
            res.data.model.curPageData.forEach((item) => {
              this.list.push(item);
            });
            this.loading = false;
            this.curPage++;
            if (this.list.length === 0) {
              this.empty = true;
            }
            if (this.list.length >= this.allDataCount) {
              this.finished = true;
            }
            this.navTitle="我的待阅";
            if(this.currentList === "todo"){
              this.navTitle='我的公文待办';
            }
            if(this.currentList === "seal"){
              this.navTitle='我的用印待办';
            }
            //if(this.allDataCount>0){
            //    document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML=
            //    this.navTitle+"(99+)";
            //}else{
                document.querySelectorAll("div.van-nav-bar__title")[0].innerHTML=
                this.navTitle+"("+this.allDataCount+")";
            //}

          });
      }
    },
    rowClick(row) {
      // 点击查看详情
      this.$store.commit("setCurrentProcess", row);
      this.$store.commit("setRefresh", false);
      this.$router.replace({
        name: "detail",
        params: {
          preRoute: "list",
        },
        query: {
          from: "oa",
          queryKind: this.$store.state.currentList
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.droplist-wrap {
  height: 100%;

  /deep/.van-pull-refresh {
    min-height: 70vh;
  }

  .wut-card {
    box-shadow: 0px 2px 6px 0px rgba(97, 101, 105, 0.08);
    border-radius: 8px;
    margin-top: 16px;
    padding: 5px 16px;
    background-color: #ffffff;
  }
}
</style>