<template>
  <div class="detail-wrap">
    <van-nav-bar
      title="OA详情"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    >
      <template slot="right">
        <i class="iconfont icon-liucheng"></i>
      </template>
    </van-nav-bar>
    <van-tabs
      v-model="activeName"
      title-active-color="#ff4444"
      sticky
      swipeable
      offset-top="46"
    >
      <van-tab title="表单详情" name="a">
        <div class="tab-wrap" ref="detailWrap">
          <wu-feedback v-if="loading" />
          <template v-else>
            <DetailForm :formConfig="formConfig" />
            <Opinion
              :noteConfig="noteConfig"
              :opinionConfig.sync="opinionConfig"
              @onClickInput="onClickInput"
              ref="opinion"
            />
          </template>
        </div>
      </van-tab>
      <van-tab title="附件" name="b">
        <div class="tab-wrap-attachment">
          <Attachment />
        </div>
      </van-tab>
    </van-tabs>

    <van-tabbar safe-area-inset-bottom placeholder v-if="showTabbar">
      <div class="btn-wrap">
        <van-button
          class="send-back"
          color="#ff4444"
          plain
          block
          round
          @click="show = true"
          :disabled="loading"
          v-if="showBackbar"
          >退回</van-button
        >
        <van-button
          color="#ff4444"
          block
          round
          @click="onCommit"
          :disabled="loading"
          >提交</van-button
        >
      </div>
    </van-tabbar>
    <van-popup
      v-model="show"
      round
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="sendback-wrap">
        <div class="sendback-header">
          <div @click="show = false">取消</div>
          <div>选择退回的人</div>
          <div @click="sendBack">确定</div>
        </div>
        <wu-feedback v-if="backLink.length === 0" types="empty" />
        <van-radio-group class="sendback-content" v-model="radio" v-else>
          <van-cell-group>
            <template v-for="(item, index) in backLink">
              <div :key="index">
                <div class="backlink-title">{{ item.name }}</div>
                <template v-if="item.handler.length > 0">
                  <div v-for="item_ in item.handler" :key="item_.orgId">
                    <van-cell
                      :title="item_.orgName"
                      clickable
                      @click="onClick(item, item_)"
                    >
                      <template slot="right-icon">
                        <van-radio
                          :name="item_"
                          icon-size="16"
                          checked-color="#ff4444"
                        />
                      </template>
                    </van-cell>
                  </div>
                </template>
                <div v-else class="empty-tips">暂无数据</div>
              </div>
            </template>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  Tab,
  Tabs,
  Tabbar,
  Button,
  Popup,
  Cell,
  CellGroup,
  Radio,
  RadioGroup,
  Toast,
  Dialog,
} from "vant";
import DetailForm from "../../components/DetailForm.vue";
import Opinion from "../../components/Opinion.vue";
import Attachment from "../../components/Attachment.vue";
import { api } from "../../core/api/index";
import { closeWindow } from "../../core/mxApi";
export default {
  name: "detail",
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Tabbar.name]: Tabbar,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    DetailForm,
    Opinion,
    Attachment,
  },
  data() {
    return {
      activeName: 0,
      show: false, // 退回弹窗展示
      radio: null, // 选择的退回节点
      activity: null, // 退回节点的上级活动节点
      backLink: [], // 退回节点
      formConfig: [], // 表单字段
      noteConfig: [], // 意见元字段
      opinionConfig: [], // 编辑意见
      preRoute: this.$route.params.preRoute || "home",
      loading: true, // 等待加载
      SubmitPermission: true, // 提交权限 true: 可提交，false: 不可提交
      noteRequired: true,  //意见必填  true: 必填, false: 非必填   20220714
      //fromOut: true, // 是否从外部跳转进OA
      selectIsSubProcess: false,//是不是子流程
      subProcessName: "",//子流程名称
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    showTabbar() {
      if (this.$store.state.currentList !== "doing"  
      &&  this.$store.state.currentProcess.workitemName.indexOf("行领导传阅")===-1) {
        return true;
      } else {
        return false;
      }
    },
    showNote() {
      console.log("this.$store.state.currentList", this.$store.state.currentList)
      if (this.$store.state.currentList !== "doing") {
        return true;
      } else {
        return false;
      }
    },
    showBackbar() {
      //console.log("----显示退回与否---",this.$store.state.currentProcess.workitemName)
      if (this.$store.state.currentProcess.editFlag !== "1"  
        &&  this.$store.state.currentProcess.workitemName.indexOf("会签")===-1   
        &&  this.$store.state.currentProcess.workitemName !=="相关人员办理"    
        &&  this.$store.state.currentProcess.workitemName !=="收文经办" 
        &&  this.$store.state.currentProcess.workitemName !=="送相关支行"   
      ) {
        return true;
      } else {
        return false;
      }
    },
    fromOut() {
      // 是否从外部跳转进OA 
      return this.$store.state.fromOut;
    },
    currentList(){
      return this.$store.state.currentList;
    }
  },
  created() {
     if (this.$route.query.from !== "oa") {
      if(this.$store.state.userInfo.userCode !== this.$route.query.userCode){
        api.checkUser({
            uCode: this.$route.query.userCode,
            id: ""
        }).then(res => {
            if (res.data.status === '200') {
                if (res.data.model.usercode !== "") { 
                    this.$store.commit('setUserInfo', {
                        userCode: res.data.model.usercode,
                        userId: res.data.model.useruuid,
                        userName: res.data.model.username,
                        ou: res.data.model.ou
                    })
                    this.$store.commit("setFromOut", true);
                    const queryKind = this.$route.query.queryKind;
                    const workItemId = this.$route.query.workItemId;
                    const pubFormDataId = this.$route.query.pubFormDataId;
                    // 此处需调用接口获取数据
                    this.getData(queryKind, workItemId, pubFormDataId).then((res) => {
                      let data = res.data.model.curPageData[0];
                      this.$store.commit("setCurrentProcess", data);
                      this.getBackLink();
                      this.getFromConfig();
                      this.isSubmmit();
                      this.updateProcessState(); 
                    });
                } 
            }
        })
      }else{
          this.$store.commit("setFromOut", true);
          //this.$store.commit("setCurrentList", this.$route.query.queryKind);
          const queryKind = this.$route.query.queryKind;
          const workItemId = this.$route.query.workItemId;
          const pubFormDataId = this.$route.query.pubFormDataId;
          // 此处需调用接口获取数据
          this.getData(queryKind, workItemId, pubFormDataId).then((res) => {
            let data = res.data.model.curPageData[0];
            this.$store.commit("setCurrentProcess", data);
            this.getBackLink();
            this.getFromConfig();
            this.isSubmmit();
            this.updateProcessState(); 
          });
      } 

    } else {
      if (this.$store.state.currentList !== "doing") { 
          this.updateProcessState();
      }
      this.getBackLink();
      this.getFromConfig();
      this.isSubmmit();
    }

    setTimeout(() => {
      var showText = document.getElementById("showTextArea");
      if (showText != null) {
        showText.hidden = true;
      }
    }, 1500);
    if(this.currentList === "todo" || this.currentList === "seal"){
      this.isSubProcess();
    }
  },
  methods: {
    isSubProcess(){
      console.log("isSubProcess被调用")
      console.log(this.currentProcess.actDefId)
      console.log(this.currentProcess.configId)
      console.log(this.currentProcess.proDirId)
      let isSubProcessParameter = {
        extendKey: "subProcess",
        actDefId: this.currentProcess.actDefId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
      }
     
      api.isSubProcess(isSubProcessParameter).then((res) => {
        console.log("detail_page里面是否是子流程，接口返回值res：" + res);
        console.log("res.data.model:"+res.data.model); 
        console.log("res.data.model.subProcess:"+res.data.model.subProcess)
        if(res.data.model && res.data.model.subProcess){
          this.selectIsSubProcess = true;
          this.subProcessName = res.data.model.subProcess;
        };
        if(this.selectIsSubProcess){
          console.log("detail_page里面是子流程，设置为已办，控制提交按钮的显示")
          this.$store.commit("setCurrentList", "doing");
        }else{
          console.log("this.selectIsSubProcess = false"); 
          console.log("this.$route.query.queryKind", this.$route.query.queryKind)
          this.$store.commit("setCurrentList", this.$route.query.queryKind);
        }
      });
    },
    getData(queryKind, workItemId, pubFormDataId) {
      // 进入系统方式为外部跳转时查询数据
      if (queryKind === "doing") {
        return api.list({
          curPage: 1,
          pageSize: 1,
          userCode: this.$store.state.userInfo.userCode,
          pubFormDataId,
        });
      }
      return api.queryList({
        curPage: 1,
        pageSize: 1,
        userCode: this.$store.state.userInfo.userCode,
        workItemId,
        queryKind,
      });
    },

    updateProcessState(){
      // console.log("-----------workitemId------------",this.currentProcess.workitemId)
       api
        .updateProcessState({
          proInstId: this.currentProcess.proInstId,
          userId: this.userInfo.userId,
          name: this.currentProcess.workitemName,
          workitemId: this.currentProcess.workitemId,
        })
        .then((res) => {
          if (res.data.status === "200") {
              // console.log("更新待办流程状态成功");
          }
        });
    },
    isSubmmit() {
      api
        .SubmitPermission({
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
          actDefId: this.currentProcess.actDefId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            res.data.model.forEach((item) => {
              //console.log("itemContent",item)
              if (
                item.extendKey === "isMustEditField" ||
                item.extendKey === "wordNoEdit" ||
                //item.extendKey === "subProcess" ||
                item.actDefId === "pb" ||
                item.extendKey === "isFjSeal"
                // || item.extendKey === "deptCount"
              ) {
                this.SubmitPermission = false;
              }
              //处理下，判断意见是否必填   20220714
              if(item.extendKey ==="noteIsRequired" && item.extendValue==="0"){
                this.noteRequired = false;
              }else{
                this.noteRequired = true;
              }
              //判断是否有发送部门字段
              if(item.extendKey === "isMustEditField" && item.extendValue === "sendDept"){
                this.SubmitPermission = true;
              }
            });
          }
        });
    },
    getFromConfig() {

      // 获取表单字段和意见字段（修改逻辑，加入子流程验证环节）
      //console.log("-----currentProcess------",this.currentProcess)
      api
        .getFromConfig({
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
          userId: this.$store.state.userInfo.userId,
          processName: this.currentProcess.processName,
          actDefId: this.currentProcess.actDefId,
          proInstId: this.currentProcess.proInstId,
          actInstId: this.currentProcess.actInstId,
          workitemId: this.currentProcess.workitemId,
          wfmRoleTypes: "todo,drafter",
        })
        .then((res) => {
          console.log("formconfig", res);
          if (res.data.status === "200") {
            this.formConfig = res.data.model.formMetaList;
            this.noteConfig = res.data.model.noteMetaList;
            this.loading = false;
          }
        });
    },
    getBackLink() {
      // 查询退回节点
      api
        .queryBackLink({
          wfmData: {
            actInstId: this.currentProcess.actInstId,
            proInstId: this.currentProcess.proInstId,
            workitemId: this.currentProcess.workitemId,
            wfmInitPageType: "running",
            configId: this.currentProcess.configId,
            configCode: this.currentProcess.configCode,
            proDirId: this.currentProcess.proDirId,
            actDefId: this.currentProcess.actDefId,
            userId: this.userInfo.userId,
          },
          wfmActivityConfig: {
            sendbackType: "pass",
          },
        })
        .then((res) => {
          if (res.data.status === "200") {
            if (res.data.model instanceof Array) {
              res.data.model.forEach((item) => {
                this.backLink.push({ ...item, handler: [] });
              });
            }
            this.backLink.forEach((item) => {
              //console.log("-----item资源-----", item);
              this.getSendBackResource(item);
            });
          }
        });
    },
    getSendBackResource(item) {
      // 获取退回环节资源
      let data = {
        wfmData: {
          actInstId: this.currentProcess.actInstId,
          proInstId: this.currentProcess.proInstId,
          workitemId: this.currentProcess.workitemId,
          configId: this.currentProcess.configId,
          proDirId: item.proDirId,
          actDefId: this.currentProcess.actDefId,
          userId: this.userInfo.userId,
          activity: {
            actDefId: item.actDefId,
            actDefName: item.name,
            proDefId: item.proDefId,
            actDefPath: item.actDefPath,
            proDirId: item.proDirId,
            actInstId: item.id,
          },
        },
      };
      api.queryHandlerList(data).then((res) => {
        if (res.data.status === "200") {
          item.handler = res.data.model.resourceIds;
        }
      });
    },
    formatRadio(item) {
      return JSON.stringify(item);
    },
    onClickLeft() {
      //处理行领导传阅，关闭即签收，结束流程问题
      //console.log("---看看是不是行领导传阅环节----",this.currentProcess.workitemName)
      if(this.currentProcess.workitemName.indexOf("行领导传阅") !=-1){
        api
        .finishCy({
          proInstId: this.currentProcess.proInstId,
          userId: this.userInfo.userId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            //console.log("----行领导传阅结束----");
              // 退出详情页
              if (this.fromOut) {
                Dialog.confirm({
                  title: "是否留在OA系统？",
                  confirmButtonColor: "#ff4444",
                  cancelButtonText: "返回待办",
                  width: "300px",
                  closeOnClickOverlay: true,
                })
                  .then(() => {
                    this.$store.commit("setFromOut", false);
                    this.$router.replace({
                      name: this.preRoute,
                    });
                  })
                  .catch((action) => {
                    //console.log("action", action);
                    if (action !== "overlay") {
                      setTimeout(() => {
                        closeWindow();
                      }, 2000);
                    }
                  });
                return;
              }
              this.$store.commit("setRefresh", true);
              this.$router.replace({ 
                name: this.preRoute,
              });
          }
        });
      }else{      
            // 退出详情页
            if (this.fromOut) {
              Dialog.confirm({
                title: "是否留在OA系统？",
                confirmButtonColor: "#ff4444",
                cancelButtonText: "返回待办",
                width: "300px",
                closeOnClickOverlay: true,
              })
                .then(() => {
                  this.$store.commit("setFromOut", false);
                  this.$router.replace({
                    name: this.preRoute,
                  });
                })
                .catch((action) => {
                  //console.log("action", action);
                  if (action !== "overlay") {
                    setTimeout(() => {
                      closeWindow();
                    }, 2000);
                  }
                });
              return;
            }

            this.$router.replace({
              name: this.preRoute,
            });
      }
    },
    onClickRight() {
      // 查看流程跟踪
      this.$router.replace({
        name: "tracking",
      });
    },
    onCommit() {
      // 提交
      if (!this.SubmitPermission) {
        Toast("请前往PC端提交!");
        return;
      }
      var u = navigator.userAgent,app = navigator.appVersion;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      //console.log("isiOS", isiOS);
      for (let i = 0; i < this.opinionConfig.length; i++) {
        //意见必填时再进行意见填写  20220714
        if(this.noteRequired){
          //如果输入框内容是空的
          if (!this.opinionConfig[i].noteContent) {
            if (isiOS) {
              document.documentElement.scrollTop = this.$refs.detailWrap.clientHeight - 255;
            } else {
              window.scrollTo(0, 9999);
            }
            Toast("请填写审批意见");
            return;
          } else {
            if (this.opinionConfig[i].noteContent.length > 500) {
              Toast("意见内容已超过500字限制");
              return;
            }
          }
        }
      }
      //保存意见是否必填  20220714
      this.$store.commit("setNoteRequired",this.noteRequired);
      this.$store.commit("setOpinionData", this.opinionConfig);
      //进入选择环节页面
      this.$router.replace({
        name: "selectlink",
        params: {
          backRoute: this.preRoute,
        },
      });
    },
    onClick(activity, radio) {
      //console.log("---退回节点名称---", activity.name);
      //选择退回节点
      this.activity = activity;
      this.radio = radio;
    },
    sendBack() {
      //let sendNode = this.$refs.sendBack.selectData;
      //console.log("---currentProcess---", this.currentProcess);
      // 退回上一环节  
      if (!this.radio) {
        Toast("请选择回退环节");
        return;
      }
      if (this.activity.name.indexOf("会签") != -1 
        || this.activity.name === "相关业务线办理" 
        || this.activity.name === "相关人员办理" 
        || this.activity.name === "相关部室办理" 
        || this.activity.name === "辅办部室办理" 
        || this.activity.name === "收文经办"
        || this.activity.name === "送相关支行"     
      ) {
        Toast("请前往PC端退回该环节");
        return;
      }
      Toast.loading({
        message: "回退中...",
        forbidClick: true,
        duration: 0,
      });
      api
        .sendBack({
          wfmData: {
            actInstId: this.currentProcess.actInstId,
            proInstId: this.activity.proInstId,
            workitemId: this.currentProcess.workitemId,
            configId: this.activity.configId,
            proDirId: this.activity.proDirId,
            actDefId: this.activity.actDefId,
            userId: this.radio.orgId,
            toActInstId: this.activity.id,
            returnSelect: "false",
          },
          wfmActivityConfig: {
            sendbackType: "pass",
          },
        })
        .then((res) => {
          Toast.clear();
          if (res.data.status === "200") {
            this.show = false;
            this.$store.commit("setRefresh", true);
            //如果从统一待办进入选择退回的，应在退回后可选择是否返回统一待办  (安卓返回待办请下拉刷新列表)
            if (this.fromOut) {              
              Dialog.alert({
                  message: "退回成功",
                  width: "200px",                  
                  confirmButtonColor: "#ff4444",
              }).then(() => {
                  this.$store.commit("setFromOut", false);
                  this.$router.replace({
                    name: this.preRoute,
                  });
              });
              return;
                
            }
            Dialog.alert({
                message: "退回成功",
                width: "200px",                  
                confirmButtonColor: "#ff4444",
            }).then(() => {
                this.$store.commit("setRefresh", true);
                this.$router.replace({
                  //name: this.backRoute,
                  name: this.preRoute,
                });
            });
            
          } else {
            Toast("退回失败");
          }
        });
    },
    // onSave() {
    //   // 调用保存方法
    //   this.opinionConfig.forEach((item) => {
    //     this.saveOpinion(item);
    //   });
    // },
    // saveOpinion(item) {
    //   // 保存意见内容
    //   console.log(1234);
    //   let data = {
    //     id: item.id || "",
    //     type: item.noteId,
    //     noteContent: item.noteContent,
    //     proInstId: this.currentProcess.proInstId,
    //     createUser: this.userInfo.userId,
    //     createUserName: this.userInfo.userName,
    //     workitemId: this.currentProcess.workitemId,
    //     actDefId: this.currentProcess.actDefId,
    //   };
    //   api.saveOpinion(data).then((res) => {
    //     item.id = res.data.model.id;
    //   });
    // },
    onClickInput() {
      //console.log("input");
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      //console.log(isiOS);

      if (isiOS) {
        const input = document.getElementsByTagName("textarea")[0];
        var showFlag = document.getElementById("showTextArea");
        showFlag.style.height = "282px";
        if (showFlag.hidden === true) {
          showFlag.hidden = false;
          window.scrollTo(0, 9999);
        }
        input.addEventListener("focus", () => {
          //console.log("focus-start");
          showFlag.hidden = false;
          window.scrollTo(0, 9999);
        });
        input.addEventListener("blur", () => {
          //console.log("blur-start");
          showFlag.hidden = true;
        });
      } else {
        //console.log("scrollTop", document.documentElement.scrollTop);
        //console.log("clientHeight", this.$refs.detailWrap.clientHeight);
        if (
          document.documentElement.scrollTop ===
          this.$refs.detailWrap.clientHeight
        ) {
          return false;
        }
        document.documentElement.scrollTop = this.$refs.detailWrap.clientHeight;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.detail-top {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
}

.detail-wrap {
  min-height: 100%;

  overflow: hidden;
  display: flex;
  flex-direction: column;

  .tab-wrap {
    flex:1;
    padding: 16px;
    white-space:pre-line;
  }

  .tab-wrap-attachment {
    flex:1;
    padding: 16px 0;
  }

  .btn-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;

    .send-back {
      margin-right: 16px;
    }
  }

  .backlink-title {
    padding: 8px 16px;
    background-color: #fafafa;
    font-size: 14px;
    color: #969799;
  }

  /deep/.van-tabbar {
    height: 60px;
  }

  /deep/.van-button {
    height: 40px;
  }

  .sendback-wrap {
    min-height: 264px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /deep/.van-cell {
      padding: 12px 16px;
      .van-cell__title {
        font-size: 16px;
      }
    }

    .empty-tips {
      padding: 16px;
      text-align: center;
      color: #969799;
    }

    .sendback-header {
      display: flex;
      width: 100%;
      height: 44px;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      box-sizing: border-box;

      & > :nth-child(1) {
        color: #969799;
      }

      & > :nth-child(2) {
        font-size: 18px;
      }

      & > :nth-child(3) {
        color: #ff4444;
      }
    }
    .sendback-content{
      flex:1;
      overflow-y:auto;
    }
  }
}
</style>
