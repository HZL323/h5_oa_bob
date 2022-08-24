<!--
 * @Author: your name
 * @Date: 2021-09-17 09:34:19
 * @LastEditTime: 2022-03-14 14:00:20
 * @LastEditors: Joker
 * @Description: 选择下一环节页
 * @FilePath: /20211216/src/modules/commit_page/index.vue
-->
<template>
  <div>
    <div v-if="flag">
      <SelectHandler
        @changeCom="changeCom"
        @checkedLink="checkedLink"
        :currentLink.sync="currentLink"
        :linkTitle="linkTitle"
        :currentRadio="radio"
        :currentSelectData="selectData"
      />
    </div>
    <div class="selet-ling-wrap" v-else>
      <van-nav-bar
        title="选择下一环节"
        left-arrow
        @click-left="onClickLeft"
        fixed
        placeholder
      />
      <van-sticky offset-top="46">
        <van-search
          shape="round"
          v-model="value"
          placeholder="请输入搜索关键词"
        />
      </van-sticky>
      <div class="cell-wrap">
        <wu-feedback v-if="loading" />
        <div v-else>
          <van-radio-group v-model="radio" v-if="linkList.length > 0">
            <van-cell-group>
              <template v-for="(item, index) in linkList">
                <van-cell
                  :is-link="item.actType !== 'end'"
                  :key="index"
                  @click="onCellClick(item)"
                  v-show="reg.test(item.actDefName)"
                >
                  <template slot="icon">
                    <van-radio
                      :name="item.actDefId"
                      checked-color="#ff4444"
                      icon-size="16"
                      disabled
                    />
                  </template>
                  <template slot="title">
                    <div class="cell-title">
                      <div class="title-text">{{ item.actDefName }}</div>
                      <div class="link-count">{{ getCount(item) }}</div>
                    </div>
                  </template>
                </van-cell>
              </template>
            </van-cell-group>
          </van-radio-group>
          <wu-feedback types="empty" v-else />
        </div>
      </div>
      <van-tabbar safe-area-inset-bottom placeholder>
        <div class="btn-wrap">
          <van-button
            color="#ff4444"
            block
            round
            @click="onCommit"
            :disabled="!isEnd && selectData.length === 0"
            >确定</van-button
          >
        </div>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Search,
  Sticky,
  Cell,
  CellGroup,
  RadioGroup,
  Radio,
  Tabbar,
  Button,
  Toast,
  Dialog,
} from "vant";
import SelectHandler from "../../components/SelectHandler.vue";
import { api } from "../../core/api/index";
import { closeWindow } from "../../core/mxApi";
export default {
  name: "selectLink", // 选择环节页
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Sticky.name]: Sticky,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Tabbar.name]: Tabbar,
    [Button.name]: Button,
    SelectHandler,
  },
  data() {
    return {
      flag: false, // 切换显示组件
      value: "",
      radio: "",
      loading: true, // 加载数据
      linkList: [], // 环节list
      linkTitle: "", // 环节名称，选择办理人页面nav-title
      currentLink: {}, // 选择的当前环节
      selectData: [], // 已选择的数据
      isEnd: false, // 当前选择环节是否为结束节点
      backRoute: this.$route.params.backRoute, // 返回上一个页面
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    reg() {
      return new RegExp(`(.*${this.value}.*)$`);
    },
    fromOut() {
      return this.$store.state.fromOut;
    },
    opinionConfig() {
      return this.$store.state.opinionData;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      api
        .queryNextLink({
          wfmData: {
            actInstId: this.currentProcess.actInstId,
            proInstId: this.currentProcess.proInstId,
            workitemId: this.currentProcess.workitemId,
            configId: this.currentProcess.configId,
            configCode: this.currentProcess.configCode,
            proDirId: this.currentProcess.proDirId,
            actDefId: this.currentProcess.actDefId,
            userId: this.userInfo.userId,
            // sendUserIds: this.currentProcess.sendUserIds ? this.currentProcess.sendUserIds:"",
          },
        })
        .then((res) => {      
          if (res.data.status === "200") {
            //console.log("----提交可选资源----",res.data);
            //console.log("----当前环节资源----",this.currentProcess)
            if(res.data.model.flag==false){
               this.onMultiCommit();
            }else{
              this.linkList = res.data.model.nextActDefIds.map((item) => ({
                ...item,
                ...{ data: [] },
              }));
            }
            
          }
          this.loading = false;
        });
    },
    onClickLeft() {
      this.$router.replace({
        name: "detail",
      });
    },
    getCount(row) {
      let count = "";
      if (row.data.length > 0) {
        count = row.data.length;
      }
      return count;
    },
    onCellClick(row) {
      // 点击选择环节
      this.currentLink = row;
      if (row.actType === "end") {
        this.linkList.forEach((item) => {
          item.data = [];
        });
        this.isEnd = true;
        this.selectData = [];
        this.radio = row.actDefId;

        if(this.currentProcess.processName.indexOf("子流程")===-1){
            Toast("请前往PC端提交!");
            return;
        }else{
            //是子流程的话直接提交
            console.log("---这个是子流程---");
            this.onSubCommit();
        }
        
      } else {
        if (
          row.actDefName.indexOf("部室经理会签") != -1  
          || row.actDefName==="部门经理会签" 
          || row.actDefName.indexOf("排版") != -1  
          || row.actDefName === "相关业务线办理"  
          || row.actDefName === "相关部室办理"  
          || row.actDefName === "辅办部室办理"  
          // || row.actDefName === "相关人员办理"  
          // || row.actDefName === "送相关支行"    
          // || row.actDefName === "收文经办"  
        ) {
          Toast("请前往PC端提交!");
          return;
        } else {
          this.linkTitle = row.actDefName;
          this.flag = true;
        }
      }
    },
    checkedLink(val) {
      // 确定选中的数据 
      this.selectData = [];
      this.linkList.forEach((item) => {
        item.data = [];
      });
      this.currentLink.data = val;
      this.selectData = val;
      this.isEnd = false;
      if (val.length > 0) {
        this.radio = this.currentLink.actDefId;
      } else {
        this.radio = "";
      }
    },
    changeCom() {
      this.flag = false;
    },
    onCommit() {
      // 提交
      Toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      let data = {};
      let participants = [];
      this.selectData.forEach((item) => {
        participants.push(`${item.orgType}:${item.orgId}`);
      });
      data.wfmData = {
        actInstId: this.currentProcess.actInstId,
        proInstId: this.currentProcess.proInstId,
        workitemId: this.currentProcess.workitemId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
        actDefId: this.currentLink.actDefId,
        processName: this.currentProcess.processName || "",
        userId: this.userInfo.userId,
        nextActivities: [
          {
            actDefId: this.currentLink.actDefId || "",
            actDefName: this.currentLink.actDefName || "",
            proDefId: this.currentLink.proDefId || "",
            actDefPath: this.currentLink.actDefPath || "",
            proDirId: this.currentLink.proDirId || "",
            actInstId: this.currentLink.actInstId || "",
            participants: participants.join(","),
            returnSelect: false,
          },
        ],
      };
      //校验是否必填，必填的话调用意见保存方法 20220714
      if(this.$store.state.noteRequired){
        this.onSave();
      }
      setTimeout(() => {
            api.completeWorkitem(data).then((res) => {
              Toast.clear();
              if (res.data.status === "200") {
                this.$store.commit("setRefresh", true);
                if (this.fromOut) {
                  //Dialog.confirm({
                    //title:"提交成功",
                    //title:"提交成功，请选择是否继续留在OA系统？",
                    //confirmButtonColor: "#ff4444",
                    //cancelButtonText: "返回待办",
                    //width: "300px",
                    //closeOnClickOverlay: true,
                  //})
                    //.then(() => {
                    //  this.$store.commit("setFromOut", false);
                    //  this.$router.replace({
                    //    name: this.backRoute,
                    //  });
                   // })
                    //.catch((action) => {
                     // if (action !== "overlay") {
                     //   setTimeout(() => {
                       //   closeWindow();
                       // }, 2000);
                      //}
                    //});
                  //return;

                  Dialog.alert({
                      message: "提交成功",
                      width: "200px",                  
                      confirmButtonColor: "#ff4444",
                  }).then(() => {
                      this.$store.commit("setFromOut", false);
                      this.$router.replace({
                        name: this.backRoute,
                      });
                  });
                  return;
                }

                Dialog.alert({
                    message: "提交成功",
                    width: "200px",                 
                    confirmButtonColor: "#ff4444",
                }).then(() => {
                    this.$router.replace({
                      name: this.backRoute,
                    });
                });       
              } else {
                Toast("提交失败");
              }
            });
      }, 500);    
    },

    onMultiCommit() {
      // 会签环节直接提交
      Toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      let data = {};
      data.wfmData = {
        actInstId: this.currentProcess.actInstId,
        proInstId: this.currentProcess.proInstId,
        workitemId: this.currentProcess.workitemId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
        actDefId: this.currentProcess.actDefId,
        processName: this.currentProcess.processName || "",
        userId: this.userInfo.userId,
      };
      this.onSave();
      setTimeout(() => {
            api.completeWorkitem(data).then((res) => {
              Toast.clear();
              if (res.data.status === "200") {
                this.$store.commit("setRefresh", true);
                if (this.fromOut) {
                  //Dialog.confirm({
                    //title:"提交成功，请选择是否继续留在OA系统？",
                    //title:"提交成功",
                    //confirmButtonColor: "#ff4444",
                    //cancelButtonText: "返回待办",
                    //width: "300px",
                    //closeOnClickOverlay: true,
                  //})
                  //  .then(() => {
                  //    this.$store.commit("setFromOut", false);
                  //    this.$router.replace({
                  //      name: this.backRoute,
                  //    });
                  //  })
                  //  .catch((action) => {
                  //    if (action !== "overlay") {
                  //      setTimeout(() => {
                  //        closeWindow();
                  //      }, 2000);
                  //    }
                  //  });
                  return;

                  Dialog.alert({
                      message: "提交成功",
                      width: "200px",
                      confirmButtonColor: "#ff4444",
                  }).then(() => {
                      this.$store.commit("setFromOut", false);
                      this.$router.replace({
                        name: this.backRoute,
                      });
                  });
                  return;
                }
                Dialog.alert({
                      message: "提交成功",
                      width: "200px",
                      confirmButtonColor: "#ff4444",
                }).then(() => {
                    this.$router.replace({
                      name: this.backRoute,
                    });
                });   
              } else {
                Toast("提交失败");
              }
            });
      }, 500);    
    },


    onSubCommit() {
      // 子流程结束环节直接提交
      Toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      let data = {};
      data.wfmData = {
        actInstId: this.currentProcess.actInstId,
        proInstId: this.currentProcess.proInstId,
        workitemId: this.currentProcess.workitemId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
        actDefId: this.currentProcess.actDefId,
        processName: this.currentProcess.processName,
        isSkiped: "false",
        userId: this.userInfo.userId,
        nextActivities: [
          {
            actDefId: this.currentLink.actDefId || "",
            actDefName: this.currentLink.actDefName || "",
            proDefId: this.currentLink.proDefId || "",
            actDefPath: this.currentLink.actDefPath || "",
            proDirId: this.currentLink.proDirId || "",
            actInstId: "",
            selectPersonType: "all",
            isShowReplace: "false",
            participants: "",
            returnSelect: false,
          },
        ],
      };
      this.onSave();
      setTimeout(() => {
            api.completeWorkitem(data).then((res) => {
              Toast.clear();
              if (res.data.status === "200") {
                this.$store.commit("setRefresh", true);
                if (this.fromOut) {
                  //Dialog.confirm({
                    //title:"提交成功，请选择是否继续留在OA系统？",
                    //title:"提交成功",
                    //confirmButtonColor: "#ff4444",
                    //cancelButtonText: "返回待办",
                    //width: "300px",
                    //closeOnClickOverlay: true,
                  //})
                   // .then(() => {
                    //  this.$store.commit("setFromOut", false);
                    //  this.$router.replace({
                    //    name: this.backRoute,
                    //  });
                    //})
                    //.catch((action) => {
                    //  if (action !== "overlay") {
                     //   setTimeout(() => {
                     //     closeWindow();
                     //   }, 2000);
                     // }
                    //});
                  //return;

                  Dialog.alert({
                      message: "提交成功",
                      width: "200px",
                      confirmButtonColor: "#ff4444",
                  }).then(() => {
                      this.$store.commit("setFromOut", false);
                      this.$router.replace({
                        name: this.backRoute,
                      });
                  });
                  return;
                }
                Dialog.alert({
                      message: "提交成功",
                      width: "200px",
                      confirmButtonColor: "#ff4444",
                }).then(() => {
                    this.$router.replace({
                      name: this.backRoute,
                    });
                });
                
              } else {
                Toast("提交失败");
              }
            });
      }, 500);    
    },

    onSave() {
      // 调用保存方法
      this.opinionConfig.forEach((item) => {
        this.saveOpinion(item);
      });
    },
    saveOpinion(item) {
      //console.log("----意见内容-----",item.noteContent);
      item.noteContent = item.noteContent.replace(/&#13;/g, "<br/>");
      item.noteContent = item.noteContent.replace(/\n/g, "<br/>");
      //item.noteContent = item.noteContent.replace(/\\r\\n/g,'<br/>');
      // 保存意见内容
      let data = {
        id: item.id || "",
        type: item.noteId,
        noteContent: item.noteContent,
        proInstId: this.currentProcess.proInstId,
        createUser: this.userInfo.userId,
        createUserName: this.userInfo.userName,
        workitemId: this.currentProcess.workitemId,
        actDefId: this.currentProcess.actDefId,
      };
      api.saveOpinion(data).then((res) => {
        item.id = res.data.model.id;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.selet-ling-wrap {
  height: 100%;

  .cell-wrap {
    padding-top: 10px;
    padding-bottom: 30px;
    background-color: #fafafa;

    /deep/.van-cell {
      padding: 12px 16px;
      .van-cell__title {
        font-size: 16px;
      }
    }

    /deep/.van-radio {
      margin-right: 8px;
    }

    /deep/.van-radio__icon--disabled .van-icon {
      border-color: #c8c9cc;
      background-color: #ffffff;
    }

    /deep/.van-radio__icon--disabled.van-radio__icon--checked .van-icon {
      background-color: #ff4444;
      border-color: #ff4444;
      color: #ffffff;
    }

    .cell-title {
      display: flex;

      .title-text {
        flex: 1;
        padding-right: 8px;
      }

      .link-count {
        font-size: 14px;
        color: #969799;
      }
    }
  }

  .btn-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
  }

  /deep/.van-tabbar {
    height: 60px;
  }

  /deep/.van-button {
    height: 40px;
  }
}
</style>