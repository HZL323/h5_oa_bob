<template>
  <div class="detail-wrap">
    <!-- yinyanhong -->
    <!-- <router-view v-if="isRouterAlive"/> -->

    <div class="header">
      <van-nav-bar
        title="OA详情"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        placeholder
      >
        <template slot="right">
          <i class="iconfont icon-liucheng"></i>
        </template>
      </van-nav-bar>
    </div>
    <div class="tabs-wrap" ref="tabsWrap">
      <van-tabs v-model="activeName" title-active-color="#ff4444" swipeable>
        <van-tab title="表单详情" name="a">
          <div class="tab-wrap" id="tabWrap" ref="detailWrap">
            <wu-feedback v-if="loading" />
            <template v-else>
              <DetailForm :formConfig="formConfig" />
              <div v-if="showOpinion">
                <Opinion
                :noteConfig="noteConfig"
                :opinionConfig.sync="opinionConfig"
                :fromOut="fromOut"
                @onClickInput="onClickInput"
                ref="opinion"
                />
              </div>
            </template>
          </div>
        </van-tab>
        <van-tab title="附件" name="b">
          <div class="tab-wrap-attachment">
            <Attachment />
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- <div style="position:relative;bottom:0;left:0;height:60px;width:100%" v-if="showTabbar"> -->
    <!-- <van-tabbar :safe-area-inset-bottom="true" :placeholder="true" v-if="showTabbar"> -->
    <div class="footer btn-wrap" ref="footer" v-if="showTabbar">
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
    <!-- </van-tabbar> -->
    <!-- </div> -->
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
  //yinyanhong
  provide() {
    return {
      reload: this.reload,
    };

  },
  watch:{
    dataForm(newVal, oldVal){
        if(JSON.stringify(newVal) !== {}){
            this.getBackLink()
        }
    }
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
      noteRequired: true, //意见必填  true: 必填, false: 非必填   20220714
      //fromOut: true, // 是否从外部跳转进OA
      selectIsSubProcess: false, //是不是子流程
      subProcessName: "", //子流程名称
      dropListCurrentList: "",
      //yinyanhong
      isRouterAlive: true,
      showOpinion:true
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    dataForm() {
      return this.$store.state.dataForm;
    },
    showTabbar() {
      if (
        this.$store.state.currentProcess.processFrom &&
        this.$store.state.currentProcess.processFrom === "documentBasis"
      ) {
        return false;
      }
      if(this.$store.state.currentList === "doing"){
        return false;
      }
      return true;
    },
    showNote() {
      console.log(
        "this.$store.state.currentList",
        this.$store.state.currentList
      );
      if (this.$store.state.currentList !== "doing") {
        return true;
      } else {
        return false;
      }
    },
    showBackbar() {
      //console.log("----显示退回与否---",this.$store.state.currentProcess.workitemName)
      if (
        this.$store.state.currentProcess.editFlag === "1" ||
        this.$store.state.currentProcess.workitemName.indexOf("会签") !== -1 ||
        this.$store.state.currentProcess.workitemName === "相关人员办理" ||
        this.$store.state.currentProcess.workitemName === "收文经办" ||
        this.$store.state.currentProcess.workitemName === "送相关支行"||
        this.$store.state.currentProcess.workitemName.indexOf("行领导传阅") !== -1||
        this.$store.state.currentProcess.workitemName === "技术可行性及业务测试评估" ||
        this.$store.state.currentProcess.workitemName === "技术可行性评估结果审核" ||
        this.$store.state.currentProcess.workitemName === "结果确认" ||
        this.$store.state.currentProcess.workitemName === "业务测试" ||
        this.$store.state.currentProcess.workitemName === "确认数据销毁" 



      ) {
        return false;
      } else {
        return true;
      }
    },
    fromOut() {
      // 是否从外部跳转进OA
      return this.$store.state.fromOut;
    },
    currentList() {
      return this.$store.state.currentList;
    },
    sendDeptVerify() {
      return this.$store.state.sendDeptVerify;
    },
    sendDeptText() {
      return this.$store.state.sendDeptText;
    },
    businessTypeVerify() {
      return this.$store.state.businessTypeVerify;
    },
    businessTypeText() {
      return this.$store.state.businessTypeText;
    },
  },
  created() {
    console.log("生产版本号--1.4.1");
    this.$store.commit("setCurrentList", this.$route.query.queryKind);
    this.dropListCurrentList = this.$route.query.queryKind;
    console.log("this.$route.query.queryKind:", this.$route.query.queryKind);

    if (this.$route.query.from !== "oa") {
      console.log("-------------recordEnterOaLog调用前-------------")
      this.recordEnterOaLog();
      console.log("-------------recordEnterOaLog调用后-------------")
      if (this.$store.state.userInfo.userCode !== this.$route.query.userCode) {
        console.log(
          "-------------!=oa this.$store.state.userInfo.userCode !== this.$route.query.userCode-------------"
        );
        //兼容旧版本的待办
        let resourceid = "";
        if(this.$route.query.hasOwnProperty('resourceid')){
            resourceid = this.$route.query.resourceid
        }
        api
          .checkUser({
            uCode: this.$route.query.userCode,
            id: "",
            resourceid: resourceid
          })
          .then((res) => {
            if (res.data.status === "200") {
              console.log(
                "-------------!=oa this.$store.state.userInfo.userCode !== this.$route.query.userCode  checkUser 200-------------"
              );
              if (res.data.model.code == 0) {
                this.$store.commit("setUserInfo", {
                  userCode: res.data.model.data.usercode,
                  userId: res.data.model.data.useruuid,
                  userName: res.data.model.data.username,
                  ou: res.data.model.data.ou,
                });
                console.log(
                  "res.data.model.usercode:",
                  res.data.model.data.usercode
                );
                console.log(
                  "res.data.model.userId:",
                  res.data.model.data.useruuid
                );
                console.log(
                  "res.data.model.userName:",
                  res.data.model.data.username
                );
                console.log("res.data.model.ou:", res.data.model.data.ou);

                this.$store.commit("setFromOut", true);
                const queryKind = this.$route.query.queryKind;
                const workItemId = this.$route.query.workItemId;
                const pubFormDataId = this.$route.query.pubFormDataId;
                // 此处需调用接口获取数据
                this.getData(queryKind, workItemId, pubFormDataId).then(
                  (res) => {
                    console.log(
                      "-------------!=oa this.$store.state.userInfo.userCode !== this.$route.query.userCode  checkUser 200 getData 200-------------"
                    );
                    console.log("getData--res,", res);
                    if (res.data.model == null) {
                      Dialog.confirm({
                        title:
                          "未查询到该待办详情，有可能该待办已经失效，请刷新列表，检查该流程的待办是否已经办理完成，您是否留在OA系统？",
                        confirmButtonColor: "#ff4444",
                        cancelButtonText: "返回待办",
                        width: "300px",
                        closeOnClickOverlay: false,
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
                    let data = res.data.model.curPageData[0];
                    this.$store.commit("setCurrentProcess", data);
                    //this.getBackLink();
                    this.getFromConfig();
                    this.isSubmmit();
                    this.isShowOpinion();
                    if (this.$store.state.currentList !== "doing") {
                      this.updateProcessState();
                    }
                    if (
                      this.currentList === "todo" ||
                      this.currentList === "seal"
                    ) {
                      this.isSubProcess();
                    }
                  }
                );
              } else if (res.data.model.code == -1) {
                //兼职已删除提示“对不起，你没有访问权限，请检查该待办所属兼职是否已删除”
                Dialog.confirm({
                  title: res.data.model.msg + "，您是否留在OA系统？",
                  confirmButtonColor: "#ff4444",
                  cancelButtonText: "返回待办",
                  width: "300px",
                  closeOnClickOverlay: false,
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
            }
          });
      } else {
        console.log(
          "---------------!=oa this.$store.state.userInfo.userCode == this.$route.query.userCode---------------"
        );
        this.$store.commit("setFromOut", true);
        const queryKind = this.$route.query.queryKind;
        const workItemId = this.$route.query.workItemId;
        const pubFormDataId = this.$route.query.pubFormDataId;
        // 此处需调用接口获取数据
        this.getData(queryKind, workItemId, pubFormDataId).then((res) => {
          console.log("getData--res,", res);
          console.log(
            "-------------!=oa this.$store.state.userInfo.userCode == this.$route.query.userCode getData 200 curPageData[0]-------------"
          );
          if (res.data.model == null) {
            Dialog.confirm({
              title:
                "未查询到该待办详情，有可能该待办已经失效，请刷新列表，检查该流程的待办是否已经办理完成，您是否留在OA系统？",
              confirmButtonColor: "#ff4444",
              cancelButtonText: "返回待办",
              width: "300px",
              closeOnClickOverlay: false,
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
          let data = res.data.model.curPageData[0];
          this.$store.commit("setCurrentProcess", data);
          //this.getBackLink();
          this.getFromConfig();
          this.isSubmmit();
          this.isShowOpinion();
          if (this.$store.state.currentList !== "doing") {
            this.updateProcessState();
          }
          if (this.currentList === "todo" || this.currentList === "seal") {
            this.isSubProcess();
          }
        });
      }
    } else {
      console.log("-----------------------=oa------------------------");
      if (this.$store.state.currentList !== "doing") {
        this.updateProcessState();
      }
      //this.getBackLink();
      this.getFromConfig();
      this.isSubmmit();
      this.isShowOpinion();
      if (this.currentList === "todo" || this.currentList === "seal") {
        this.isSubProcess();
      }
    }

    setTimeout(() => {
      var showText = document.getElementById("showTextArea");
      if (showText != null) {
        showText.hidden = true;
      }
    }, 1500);
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.showTabbar);
      if (!this.showTabbar) {
        this.$refs.tabsWrap.style.bottom = 0;
      }
    });
  },
  methods: {
    isShowOpinion(){
        console.log("hideOpinion --------------")
        let params = {
            extendKey: "hideOpinion",
            actDefId: this.currentProcess.actDefId,
            configId: this.currentProcess.configId,
            proDirId: this.currentProcess.proDirId
        }
        api.getActivityExtendConfigByName(params).then((res) => {
          if(res.data.model && res.data.model.hideOpinion && res.data.model.hideOpinion){
            this.showOpinion = false;
            console.log("hideOpinion --------true-------")
            return;
          }
          this.showOpinion = true;
          console.log("hideOpinion --------false-------")
        });
    },
    recordEnterOaLog() {
      console.log("-----------调用recordEnterOaLog函数-----------")
      let userAgent = navigator.userAgent.toLowerCase();
      console.log("userAgent:",userAgent)
      let PCType = "";
      if (userAgent.indexOf("windows") !== -1) PCType = "windows";
      if (userAgent.indexOf("macintosh") !== -1) PCType = "macintosh";
      let isAndroid = /android/.test(userAgent) && !/iphone|ipad|ipod/.test(userAgent);
      let isIPad = /ipad/.test(userAgent);
      console.log("-----------调用recordEnterOaLog接口-----------")
      api
        .recordEnterOaLog({
          userUuid: this.$store.state.userInfo.userId,
          userAgent:
            PCType == ""
              ? isAndroid
                ? "Android"
                : isIPad
                ? "iPad"
                : "iPhone"
              : PCType,
        })
        .then((res) => {
          console.log("------记录进入OA的设备日志---------");
        });
    },
    //yinyanhong
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    isSubProcess() {
      console.log("isSubProcess被调用");
      console.log(this.currentProcess.actDefId);
      console.log(this.currentProcess.configId);
      console.log(this.currentProcess.proDirId);
      let isSubProcessParameter = {
        extendKey: "subProcess",
        actDefId: this.currentProcess.actDefId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
      };

      api.isSubProcess(isSubProcessParameter).then((res) => {
        if (res.data.status === "200") {
          console.log("-------------此待办是否是子流程------------");
          if (res.data.model && res.data.model.subProcess) {
            console.log("--------------此待办是子流程------------");
            this.selectIsSubProcess = true;
            this.subProcessName = res.data.model.subProcess;
          }
          if (this.selectIsSubProcess) {
            console.log(
              "detail_page里面是子流程，设置为已办，控制提交按钮的显示"
            );
            this.$store.commit("setCurrentList", "doing");
            console.log(
              "设置完doing之后this.$route.query.queryKind: ",
              this.$route.query.queryKind
            );
            Dialog.alert({
              message: "此环节是部门会签环节，如需增删会签可往PC端处理",
              width: "250px",
              confirmButtonColor: "#ff4444",
              closeOnClickOverlay: false,
            }).then(() => {
              this.$router.replace({
                name: this.backRoute,
              });
            });
          } else {
            console.log("this.selectIsSubProcess = false");
            console.log(
              "this.$route.query.queryKind",
              this.$route.query.queryKind
            );
            this.$store.commit("setCurrentList", this.$route.query.queryKind);
          }
        }
      });
    },
    getData(queryKind, workItemId, pubFormDataId) {
      console.log(
        "getData:",
        "queryKind:",
        queryKind,
        "workItemId:",
        workItemId,
        "pubFormDataId:",
        pubFormDataId
      );
      // 进入系统方式为外部跳转时查询数据
      if (queryKind === "doing") {
        console.log("queryKind === doing getData api.list");
        return api.list({
          curPage: 1,
          pageSize: 1,
          userCode: this.$store.state.userInfo.userCode,
          userId: this.$store.state.userInfo.userId,
          pubFormDataId,
        });
      }
      console.log("queryKind !=== doing getData api.queryList");

      return api.queryList({
        curPage: 1,
        pageSize: 1,
        userCode: this.$store.state.userInfo.userCode,
        workItemId,
        queryKind,
      });
    },

    updateProcessState() {
      api
        .updateProcessState({
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
          userId: this.$store.state.userInfo.userId,
          processName: this.currentProcess.processName,
          actDefId: this.currentProcess.actDefId,
          proInstId: this.currentProcess.proInstId,
          actInstId: this.currentProcess.actInstId,
          workitemId: this.currentProcess.workitemId,
          name: this.currentProcess.workitemName,
          device: "mobile",
          wfmRoleTypes: "todo,drafter",
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
                //item.extendKey === "wordNoEdit" ||
                //item.extendKey === "subProcess" ||
                item.extendKey === "isMustSealField" || //填写申请
                item.actDefId === "pb" || //排版
                item.extendKey === "isFjSeal" //商务用印申请 具体说明查询explainExtendAttrDialog
              ) {
                this.SubmitPermission = false;
              }
              //处理下，判断意见是否必填   20220714
              if (
                item.extendKey === "noteIsRequired" &&
                item.extendValue === "0"
              ) {
                console.log("this.noteRequired = false");
                this.noteRequired = false;
              }
              //判断是否有发送部门字段
              if (
                item.extendKey === "isMustEditField" &&
                item.extendValue === "sendDept"
              ) {
                this.SubmitPermission = true;
              }
              if (
                item.extendKey === "isPCHandle" &&
                (item.extendValue == true || item.extendValue == "true")
              ) {
                this.SubmitPermission = false;
              }
            });
          }
        });
    },
    getFromConfig() {
        debugger
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
        dataForm:this.dataForm
      };
      api.queryHandlerList(data).then((res) => {
        if (res.data.status === "200") {
          item.handler = res.data.model.resourceIds || [];
        }
      });
    },
    formatRadio(item) {
      return JSON.stringify(item);
    },
    onClickLeft() {
      //处理行领导传阅，关闭即签收，结束流程问题
      //console.log("---看看是不是行领导传阅环节----",this.currentProcess.workitemName)
      if (this.showOpinion === false) {
        api
          .finishCy({
            proInstId: this.currentProcess.proInstId,
            userId: this.userInfo.userId,
          })
          .then((res) => {
            if (res.data.status === "200") {
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
      } else {
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
              this.$store.commit("setCurrentList", this.dropListCurrentList);
              this.$store.commit("setFromOut", false);
              this.$router.replace({
                name: this.preRoute,
              });
            })
            .catch((action) => {
              console.log("action", action);
              //点击蒙层action为overlay
              if (action !== "overlay") {
                closeWindow();
              }
            });
          return;
        } else {
          this.$store.commit("setCurrentList", this.dropListCurrentList);
        }

        this.$router.replace({
          name: this.preRoute,
        });
        console.log("点击左箭头：", this.$route.query.queryKind);
      }
    },
    onClickRight() {
      // 查看流程跟踪
      this.$router.replace({
        name: "tracking",
      });
    },
    async onMultiCommit() {
      // 会签环节直接提交
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
      //必填生效
      let saveNoteResult = 0;
      if((this.noteRequired && this.opinionConfig[0])|| (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
        debugger
        await this.saveOpinion().then((results) => {
            if(results[0].data.status !== "200" || (results[0].data.status === "200" && results[0].data.model.code === -1)){
                saveNoteResult = -1;
            };
             if(results[0].data.status === "200" && results[0].data.model.code === -2){
                saveNoteResult = -2;
            };
            // 处理第一个元素的结果
            }).catch((error) => {
                // 处理错误
                saveNoteResult = -1;
        });
        if(saveNoteResult === -1){
            this.$toast.clear();
            this.$toast("提交失败");
            return
        }
        if(saveNoteResult === -2){
            this.$toast.clear();
            this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
            this.$router.replace({ path: '/home', force: true })
            return
        }
      }
      debugger
      setTimeout(() => {
        api.completeWorkitem(data).then((res) => {
            console.log("detail_page 870行completeWorkitem被调用")
            this.$toast.clear();
          if (res.data.status === "200" && res.data.model.code === 0) {
            this.$store.commit("setRefresh", true);
            Dialog.alert({
              message: "提交成功",
              width: "200px",
              confirmButtonColor: "#ff4444",
              closeOnClickOverlay: false,
            }).then(() => {
                console.log("detailPage 878行的提交成功")

              this.$router.replace({
                name: 'home',
              });
            });
          } else {
            this.$toast("提交失败");
          }
        });
      }, 500);
    },
    async saveOpinion() {
        debugger
        //因为forEach()方法不会等待异步操作的结果，它只是遍历数组中的每个元素并对其执行回调函数
        //异步操作是在回调函数中发生的，但是forEach()方法并不会等待它们完成。因此，在forEach()中返回的返回值是undefined
        //使用了map()方法替代了forEach()方法来生成一个包含多个Promise对象的数组。然后，我们使用Promise.all()方法来等待所有异步操作完成，最终返回一个新的Promise对象。
        const promises = this.opinionConfig.map(async (item) => {
            item.noteContent = item.noteContent.replace(/&#13;/g, "<br/>");
            item.noteContent = item.noteContent.replace(/\n/g, "<br/>");
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
            const res = await api.saveOpinion(data);
            if (res.data.status === 200 && res.data.model.code === 0) item.id = res.data.data.id;
            return res;
        });
        debugger
        return Promise.all(promises);
    },

    async onCommit() {
        debugger
        this.$toast.loading({
            message: "提交中...",
            forbidClick: true,
            duration: 0,
        });
        let commited = 0
        //判断是否是行领导传阅流程 showOpinion是通过hideOpinion扩展属性设置的
        if (this.showOpinion === false) {
            await this.onCommitFinishCy().then((result) => {
                if(result.data.status === "200" && result.data.model === true){
                    commited = 1;//正常结束
                }else if(result.data.status === "200" && result.data.model === false){
                    commited = 1;//在调用此接口之前已经结束了
                }else{
                    commited = 2;//非200状态
                }
            }).catch((error) => {
                commited = 2;//接口无法返回
            });
            // 关闭提交loading
            this.$toast.clear();
            console.log("commited:1--------------",commited)
            if(commited === 1){
                console.log("commited:2--------------",commited)
                this.$store.commit("setRefresh", true);
                if (this.fromOut) {
                    console.log("commited:3--------------",commited)
                    debugger
                    this.$dialog
                    .alert({
                        message: "提交成功",
                        width: "200px",
                        confirmButtonColor: "#ff4444",
                    })
                    .then(() => {
                        console.log("detailPage 944行的提交成功")

                        this.$store.commit("setFromOut", false);
                        console.log("commited:3--------------",commited)
                        this.$router.replace({
                            name: 'home',
                        });
                    });
                    return;
                }
                Dialog.alert({
                    message: "提交成功",
                    width: "200px",
                    confirmButtonColor: "#ff4444",
                    closeOnClickOverlay: false,
                }).then(() => {
                    console.log("detailPage 961行的提交成功")

                    this.$router.replace({
                        name: 'home',
                    });
                });
                return
            }
            if(commited === 2){
                this.$toast("提交失败");
                return
            }
        }
        if (this.sendDeptVerify && (this.$store.state.currentList === "todo" || this.$store.state.currentList === "seal")) {
            if (this.dataForm.sendDeptText == null ||this.dataForm.sendDeptText == "") {
                Toast("请选择发送部门");
                return;
            }
        }
        if (this.businessTypeVerify && (this.$store.state.currentList === "todo" || this.$store.state.currentList === "seal")) {
            if (this.dataForm.businessType == null ||this.dataForm.businessType == "") {
                Toast("请选择业务类型");
                return;
            }
        }
        // 提交
        if (!this.SubmitPermission) {
            Toast("请前往PC端提交!");
            return;
        }
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        //console.log("isiOS", isiOS);
        for (let i = 0; i < this.opinionConfig.length; i++) {

            //意见必填时再进行意见填写  20220714
            console.log(this.noteRequired);
            if (this.noteRequired) {
            //如果输入框内容是空的
                if (!this.opinionConfig[i].noteContent  || this.opinionConfig[i].noteContent.trim().length === 0) {
                    // if (isiOS) {
                    //   document.documentElement.scrollTop =
                    //     this.$refs.detailWrap.clientHeight - 255;
                    // } else {
                    //   window.scrollTo(0, 9999);
                    // }
                    let scrollEle = document.querySelector(".van-tabs__content");
                    let elH = document.querySelector("#tabWrap").clientHeight;
                    let scrollH = elH - scrollEle.clientHeight;
                    scrollEle.scrollTop = scrollH;
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
        this.$store.commit("setNoteRequired", this.noteRequired);
        this.$store.commit("setOpinionData", this.opinionConfig);
        //如果多人会签环节，并且不是最后一个人提交则直接提交
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
                    console.log("----detail_page下一环节返回内容----", res.data);
                    if (res.data.model.flag == false) {
                        this.onMultiCommit();
                    }
                    //勾选了不弹出选人的复选框
                    else if(res.data.model.flag == true && res.data.model.wfmData.isShowCompleteDialog == false){
                        debugger
                        let data = {};
                        data.wfmData = {
                            actInstId: this.currentProcess.actInstId,
                            proInstId: this.currentProcess.proInstId,
                            workitemId: this.currentProcess.workitemId,
                            configId: this.currentProcess.configId,
                            proDirId: this.currentProcess.proDirId,
                            actDefId: res.data.model.wfmData.nextActivities[0].actDefId,
                            processName: this.currentProcess.processName || "",
                            userId: this.userInfo.userId,
                            nextActivities: [
                                {
                                    actDefId: res.data.model.wfmData.nextActivities[0].actDefId || "",
                                    actDefName:  "",
                                    proDefId: res.data.model.wfmData.nextActivities[0].proDefId || "",
                                    actDefPath: res.data.model.wfmData.nextActivities[0].actDefPath || "",
                                    proDirId: res.data.model.wfmData.nextActivities[0].proDirId || "",
                                    actInstId: "",
                                    participants:res.data.model.wfmData.nextActivities[0].participants,
                                    returnSelect: false,
                                },
                            ],
                        };
                        this.hldNotShowNextActivities(data);
                    }
                     else {
                        //if(this.currentProcess.)
                        //进入选择环节页面
                        this.$toast.clear();
                        this.$router.replace({
                            name: "selectlink",
                            params: {
                                backRoute: this.preRoute,
                            },
                        });
                    }
                }
                this.loading = false;
            });
    },
    async onCommitFinishCy(){
        const res = await api.finishCy({
            proInstId: this.currentProcess.proInstId,
            userId: this.userInfo.userId,
        })
        return res;
    },
    onClick(activity, radio) {
      //console.log("---退回节点名称---", activity.name);
      //选择退回节点
      this.activity = activity;
      this.radio = radio;
    },
    async sendBack() {
      //let sendNode = this.$refs.sendBack.selectData;
      //console.log("---currentProcess---", this.currentProcess);
        Toast.loading({
            message: "回退中...",
            forbidClick: true,
            duration: 0,
        });
      // 退回上一环节
        if (!this.radio) {
            Toast("请选择回退环节");
            return;
        }
        if (
            this.activity.name.indexOf("会签") != -1 ||
            this.activity.name === "相关业务线办理" ||
            this.activity.name === "相关人员办理" ||
            this.activity.name === "相关部室办理" ||
            this.activity.name === "辅办部室办理" ||
            this.activity.name === "收文经办" ||
            this.activity.name === "送相关支行"
        ) {
            Toast("请前往PC端退回该环节");
            return;
        }
        console.log("sendBack:----", this.currentProcess.processName)
        debugger
        if(this.currentProcess.processName === '业务数据处理申请流程' ||
            this.currentProcess.processName === '总行办公自动化用户维护申请流程' ||
            this.currentProcess.processName === '通用流程' ||
            this.currentProcess.processName === '总分行办公检法查询申请流程' ||
            this.currentProcess.processName === '短信发布申请' ){
            if(this.opinionConfig[0] && (!this.opinionConfig[0].noteContent  || this.opinionConfig[0].noteContent.trim().length === 0)){
                Toast("请填写审批意见");
                return;
            }
        }
        if(this.opinionConfig[0] && this.opinionConfig[0].noteContent){
            debugger
            let saveNoteResult = 0
            await this.saveOpinion().then((results) => {
                if(results[0].data.status !== "200" || (results[0].data.status === "200" && results[0].data.model.code === -1)){
                    saveNoteResult = -1;
                };
                if(results[0].data.status === "200" && results[0].data.model.code === -2){
                    saveNoteResult = -2;
                };
                // 处理第一个元素的结果
            }).catch((error) => {
                    // 处理错误
                    saveNoteResult = -1;
            });
            if(saveNoteResult === -1){
                this.$toast("提交失败");
                return
            }
            if(saveNoteResult === -2){
                this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
                this.$router.replace({ path: '/home', force: true })
                return
            }
        }

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
    async hldNotShowNextActivities(data){
        //必填生效
        let saveNoteResult = 0;
        if((this.noteRequired && this.opinionConfig[0]) || (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
            debugger
            await this.saveOpinion().then((results) => {
                if(results[0].data.status !== "200" || (results[0].data.status === "200" && results[0].data.model.code === -1)){
                    saveNoteResult = -1;
                };
                if(results[0].data.status === "200" && results[0].data.model.code === -2){
                    saveNoteResult = -2;
                };
                // 关闭提交loading
                this.$toast.clear();
                // 处理第一个元素的结果
                }).catch((error) => {
                    // 处理错误
                    saveNoteResult = -1;
            });
            if(saveNoteResult === -1){
                // 关闭提交loading
                this.$toast.clear();
                this.$toast("提交失败");
                return
            }
            if(saveNoteResult === -2){
                // 关闭提交loading
                this.$toast.clear();
                this.$toast("PC端已经填过意见，但未提交，请重新进入页面加载该意见");
                this.$router.replace({ path: '/home', force: true })
                return
            }
        }
        setTimeout(() => {
            api.completeWorkitem(data).then((res) => {
                this.$toast.clear();
                if (res.data.status === "200" && res.data.model.code === 0) {
                    this.$store.commit("setRefresh", true);
                    // Dialog.alert({
                    //     message: "提交成功",
                    //     width: "200px",
                    //     confirmButtonColor: "#ff4444",
                    //     closeOnClickOverlay: false,
                    // }).then(() => {
                    //     this.$router.replace({
                    //         name: 'home',
                    //     });
                    // });
                    const toast = Toast.loading({
                      duration: 0, // 持续展示 toast
                      forbidClick: true,
                      message: "3 秒后返回首页",
                    });

                    let second = 3;
                    const timer = setInterval(() => {
                      second--;
                      if (second) {
                        toast.message = `${second} 秒后返回首页`;
                      } else {
                        clearInterval(timer);
                        // 手动清除 Toast
                        Toast.clear();
                        this.$router.replace({
                          name: "home",
                        });
                      }
                    }, 1000);
                } else {
                    this.$toast("提交失败");
                }
            });
        }, 500);
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

/deep/.van-tabs.van-tabs--line {
  position: relative;
  height: 100%;
}

/deep/.van-tabs__wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

/deep/.van-tabs__content {
  position: absolute;
  top: 44px;
  bottom: 0px;
  left: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.detail-wrap {
  height: 100vh;
  //   position:relative;
  // overflow: scroll;
  // display: flex;
  // flex-direction: column;
  // padding-bottom: 10px;

  .van-tabs__wrap {
    background-color: red;
  }

  .header {
    position: absolute;
    height: 46px;
    width: 100%;
    left: 0;
    top: 0;
  }
  .tabs-wrap {
    // height: calc(~"100vh - 106px");
    // overflow: scroll;
    // -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 46px;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: auto;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
  }

  .tab-wrap {
    flex: 1;
    padding: 16px;
    white-space: pre-line;
  }

  .tab-wrap-attachment {
    flex: 1;
    padding: 16px 0;
  }

  .btn-wrap {
    width: 100%;
    // height: 100%;
    background-color: #fff;
    height: 60px;
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
    .sendback-content {
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>
