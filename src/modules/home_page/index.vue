<template>
  <div class="home-wrap">
    <!-- <van-sticky offset-top="0" > -->
    <div class="header_box">
      <div class="banner">
        <img class="logo" src="../../assets/img/logo.png" alt="" srcset="" />
        <img class="word" src="../../assets/img/word.png" alt="" srcset="" />
      </div>
      <div class="changedept-wrap">
        <div class="user-info van-ellipsis">
          {{ welcome + "：" + userInfo.userName + "_" + userInfo.ou }}
        </div>
        <div class="custom-btn" @click="show = true">
          <!-- <van-button
            class="change-dept"
            color="#ff4444"
            round
            @click="show = true"
            size="small"
            >切换部门
          </van-button> -->
          切换部门
        </div>
      </div>
    </div>
    <!-- </van-sticky> -->

    <div class="content-wrap">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-collapse v-model="activeNames">
          <template v-for="(item, index) in collapseList">
            <van-collapse-item :name="item.name" :border="false" :key="index">
              <template slot="icon">
                <i
                  :class="{
                    'iconfont icon-Down-': true,
                    'rotate-icon': onRotate(item.name),
                  }"
                ></i>
              </template>
              <template slot="title">{{ item.title }}</template>
              <template slot="right-icon">
                <div class="more" @click.stop="getMore(item.type)">
                  more...
                </div></template
              >
              <wu-feedback v-if="item.loading" />
              <template v-else>
                <div class="empty" v-if="item.list.length === 0">
                  无更多数据
                </div>
                <div v-else>
                  <div
                    class="wu-list"
                    v-for="item_ in item.list"
                    :key="item_.id"
                    @click="rowClick(item.type, item_)"
                  >
                    <div
                      v-if="item.type != 'doing' && item_.priority === '001'"
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_blue.png"
                      />
                    </div>
                    <div
                      v-if="item.type != 'doing' && item_.priority === '002'"
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_yellow.png"
                      />
                    </div>
                    <div
                      v-if="item.type != 'doing' && item_.priority === '003'"
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_red.png"
                      />
                    </div>
                    <div
                      v-if="
                        item.type != 'doing' &&
                        (item_.priority === null || item_.priority === '')
                      "
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_white.png"
                      />
                    </div>

                    <!-- 已办 -->
                    <div
                      v-if="
                        item.type == 'doing' && item_.priorityCode === '001'
                      "
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_blue.png"
                      />
                    </div>
                    <div
                      v-if="
                        item.type == 'doing' && item_.priorityCode === '002'
                      "
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_yellow.png"
                      />
                    </div>
                    <div
                      v-if="
                        item.type == 'doing' && item_.priorityCode === '003'
                      "
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_red.png"
                      />
                    </div>
                    <div
                      v-if="
                        item.type == 'doing' &&
                        (item_.priorityCode === null ||
                          item_.priorityCode === '')
                      "
                    >
                      <img
                        style="height: 40px"
                        src="../../assets/img/icon_flag_white.png"
                      />
                    </div>

                    <div class="wu-list-content">
                      <div class="title">
                        {{ item_.title }}
                      </div>
                      <div class="content-intro">
                        <div>{{ item_.actCreateTime }}</div>
                        <div class="divider"></div>
                        <div>{{ item_.workitemName }}</div>
                      </div>
                    </div>
                    <div class="wuicon-right">
                      <van-icon name="arrow" size="24" />
                    </div>
                  </div>
                </div>
              </template>
            </van-collapse-item>
          </template>
        </van-collapse>
      </van-pull-refresh>
    </div>

    <van-popup
      v-model="show"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="切换部门"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        swipe-duration="500"
        value-key="ou"
        default-index="0"
      />
    </van-popup>
  </div>
</template>

<script>
import { pid } from "process";
import { api } from "../../core/api/index";
import {
  PullRefresh,
  Sticky,
  Collapse,
  CollapseItem,
  Icon,
  Picker,
  Popup,
  Button,
} from "vant";
export default {
  name: "homePage",
  components: {
    [PullRefresh.name]: PullRefresh,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
  },
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      collapseList: [
        {
          title: "公文待办",
          type: "todo",
          name: "1",
          loading: true,
          list: [],
        },
        {
          title: "用印待办",
          type: "seal",
          name: "2",
          loading: true,
          list: [],
        },
        {
          title: "已办",
          type: "doing",
          name: "3",
          loading: true,
          list: [],
        },
        {
          title: "待阅",
          type: "toread",
          name: "4",
          loading: true,
          list: [],
        },
      ],
      show: false, // 展示兼职列表
      refreshing: false, // 下拉刷新
      currentDept: {
        ou: "",
        userCode: "",
      },
      columns: [],
      welcome: "",
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    refresh() {
      return this.$store.state.refresh;
    },
  },
  created() {
    console.log("-------------home_page-recordEnterOaLog调用前-------------")
    this.recordEnterOaLog();
    console.log("-------------home_page-recordEnterOaLog调用后-------------")
    this.loadUserDeptList();
    this.getTimeState();
    this.loadData();
  },
  activated() {
    if (this.refresh) {
      console.log("refres被调用");
      this.loadData();
    }
  },
  methods: {
    recordEnterOaLog(){
        let userAgent = navigator.userAgent.toLowerCase();
        let PCType = "";
        if(userAgent.indexOf('windows') !== -1 )
            PCType = "windows";

        if(userAgent.indexOf('macintosh') !== -1){
            PCType = "macintosh";
        }
        let isAndroid = /android/.test(userAgent) && !/iphone|ipad|ipod/.test(userAgent);
        let isIPad = /ipad/.test(userAgent);

        api
        .recordEnterOaLog({
          userUuid: this.$store.state.userInfo.userId,
          userAgent: PCType == "" ? (isAndroid ? "Android" :  (isIPad ? "iPad" : "iPhone")) : PCType,
        })
        .then((res) => {
            console.log("------记录进入OA的设备日志---------")
        });
    },
    onRefresh() {
      this.loadData();
    },
    loadData() {
      this.refreshing = false;
      this.collapseList.forEach((item) => {
        item.list = [];
        item.loading = true;
      });
      api
        .queryList({
          curPage: 1,
          pageSize: 5,
          userCode: this.$store.state.userInfo.userCode,
          queryKind: "todo",
        })
        .then((res) => {
          //console.log("-------公文待办---------",res.data.model);
          this.collapseList[0].list = res.data.model.curPageData;
          if (res.data.model.allDataCount > 99) {
            this.collapseList[0].title = "公文待办(99+)";
          } else {
            this.collapseList[0].title =
              "公文待办(" + res.data.model.allDataCount + ")";
          }
          //this.collapseList[0].title = '待办('+res.data.model.allDataCount+')';
          this.collapseList[0].loading = false;
        });
      api
        .queryList({
          curPage: 1,
          pageSize: 5,
          userCode: this.$store.state.userInfo.userCode,
          queryKind: "seal",
        })
        .then((res) => {
          //console.log("-------用印待办---------",res.data.model);
          this.collapseList[1].list = res.data.model.curPageData;
          if (res.data.model.allDataCount > 99) {
            this.collapseList[1].title = "用印待办(99+)";
          } else {
            this.collapseList[1].title =
              "用印待办(" + res.data.model.allDataCount + ")";
          }
          //this.collapseList[0].title = '待办('+res.data.model.allDataCount+')';
          this.collapseList[1].loading = false;
        });
      api
        .list({
          curPage: 1,
          pageSize: 5,
          userCode: this.$store.state.userInfo.userCode,
        })
        .then((res) => {
          if (res.data.model.pageData instanceof Array) {
            res.data.model.pageData.forEach((item) => {
              // item.actCreateTime = this.$format("YYYY-mm-dd", item.createTime);
            });
          }
          this.collapseList[2].list = res.data.model.curPageData;
          if (res.data.model.allDataCount > 99) {
            this.collapseList[2].title = "已办(99+)";
          } else {
            this.collapseList[2].title =
              "已办(" + res.data.model.allDataCount + ")";
          }
          this.collapseList[2].loading = false;
        });
      api
        .queryList({
          curPage: 1,
          pageSize: 5,
          userCode: this.$store.state.userInfo.userCode,
          queryKind: "toread",
        })
        .then((res) => {
          this.collapseList[3].list = res.data.model.curPageData;
          if (res.data.model.allDataCount > 99) {
            this.collapseList[3].title = "待阅(99+)";
          } else {
            this.collapseList[3].title =
              "待阅(" + res.data.model.allDataCount + ")";
          }
          this.collapseList[3].loading = false;
        });
    },
    getTimeState() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let state = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        state = `早上好`;
      } else if (hours > 10 && hours <= 14) {
        state = `中午好`;
      } else if (hours > 14 && hours <= 18) {
        state = `下午好`;
      } else if (hours > 18 && hours <= 24) {
        state = `晚上好`;
      }
      this.welcome = state;
    },
    loadUserDeptList() {
      // 获取用户部门列表
      api.loadUserDeptList({ userCode: this.userInfo.userCode }).then((res) => {
        if (res.data.status === "200") {
          this.columns = res.data.model;
          console.log("this.columns", this.columns);
        }
      });
    },
    onRotate(key) {
      for (let i = 0; i < this.activeNames.length; i++) {
        if (key === this.activeNames[i]) {
          return true;
        }
      }
      return false;
    },
    getMore(type) {
      this.$store.commit("setCurrentList", type);
      this.$store.commit("setRefresh", true);
      console.log("more", type);
      this.$router.replace({
        name: "list",
        query: {
          queryKind: type,
        },
      });
    },
    rowClick(type, row) {
      // 点击查看详情
      this.$store.commit("setCurrentProcess", row);
      this.$store.commit("setCurrentList", type);
      this.$router.replace({
        name: "detail",
        params: {
          preRoute: "home",
        },
        query: {
          from: "oa",
          queryKind: type,
        },
      });
    },
    onConfirm(data, index) {
      // 切换部门确定
      this.$store.commit("setUserInfo", {
        userCode: data.usercode,
        userId: data.useruuid,
        userName: data.username,
        ou: data.ou,
      });
      this.show = false;
      this.loadData();
    },
    onCancel() {
      // 切换部门取消
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.home-wrap {
  height: 100%;
  //   -webkit-overflow-scrolling: touch;
  .header_box {
    // top: 0;
    position: absolute;
    height: 155px;
    top: 0;
    left: 0;
    width: 100%;

    .banner {
      height: 120px;
      background-color: #ffffff;
      //text-align: center;
      background-image: url("../../assets/img/banner.jpg");
      //background-position: center;
      position: relative;
      background-repeat: no-repeat;
      background-size: 100% 100%;

      img.logo {
        width: 100px;
        height: 30px;
        position: relative;
        left: 20px;
      }

      img.word {
        width: 250px;
        height: 50px;
        position: relative;
        left: -87px;
        top: 55px;
      }

      .tips {
        position: absolute;
        right: 8px;
        bottom: 8px;
        color: #ffffff;
        font-size: 18px;
      }
    }
  }

  .content-wrap {
    position: absolute;
    width: 100%;
    top: 155px;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .icon-Down- {
    transition: all 0.3s ease-in;
    transform: rotate(-90deg);
  }

  .rotate-icon {
    transform: rotate(0deg);
  }

  .changedept-wrap {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-top: 1px solid rgba(255, 68, 68, 0.3);
    border-bottom: 1px solid rgba(255, 68, 68, 0.3);
  }

  .user-info {
    background-color: #ffffff;
    padding: 5px;
    // border-top: 1px solid rgba(255, 68, 68, 0.3);
    // border-bottom: 1px solid rgba(255, 68, 68, 0.3);
    flex: 1;
    .change-dept {
      width: 100px;
      height: 32px;
    }
  }

  .custom-btn {
    background-color: #ff4444;
    color: #ffffff;
    padding: 2px 8px;
    border-radius: 14px;
    margin: 0 6px;
  }

  .empty {
    text-align: center;
  }

  /deep/.van-cell {
    font-size: 16px;
    background-color: rgba(255, 68, 68, 0.1);
    border-bottom: 2px solid #ff4444;
    color: #ff4444;

    .iconfont {
      margin-right: 5px;
    }

    .van-cell__title {
      font-weight: 600;
    }
  }

  /deep/.van-collapse-item__content {
    padding: 7px 16px;
  }

  /deep/.van-picker__toolbar {
    .van-picker__title {
      font-size: 18px;
    }

    .van-picker__cancel,
    .van-picker__confirm {
      font-size: 16px;
    }

    .van-picker__confirm {
      color: #ff4444;
    }
  }

  /deep/.van-picker-column__item--selected {
    color: #ff4444;
  }
}
</style>
