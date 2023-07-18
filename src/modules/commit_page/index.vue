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
    <!--选完部门之后会出现这个div，不选部门不会出现-->
    <div v-if="flag">
      <SelectHandler
        @changeCom="changeCom"
        @checkedLink="checkedLink"
        :currentLink.sync="currentLink"
        :linkTitle="linkTitle"
        :currentRadio="radio"
        :currentSelectData="selectData"
        :selectIsSubProcess="selectIsSubProcess"
      />
    </div>
    <div class="selet-ling-wrap" v-else>
      <div class="header-wrap">
        <van-nav-bar
          title="选择下一环节"
          left-arrow
          @click-left="onClickLeft"
          placeholder
        />
        <!-- <van-sticky offset-top="46"> -->
        <van-search
          shape="round"
          v-model="value"
          placeholder="请输入搜索关键词"
        />
        <!-- </van-sticky> -->
      </div>
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
      <div class="footer-wrap">
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
      </div>
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
import moment from "moment";
import { ajaxPost, closeWindow } from "../../core/mxApi";
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
      selectIsSubProcess: false, //所选的是不是子流程
      isZhyyjh: false, //当前环节是不是支行用印校核
      subProcessName: "", //子流程的名称
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    noteRequired() {
      return this.$store.state.noteRequired;
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
    dataForm() {
      return this.$store.state.dataForm;
    },
    businesssTypeVerify() {
      return this.$store.state.businessTypeVerify;
    },
    sendDeptVerify() {
      return this.$store.state.sendDeptVerify;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      //查询下一环节
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
            debugger
            if (res.data.status === "200") {
                console.log("----commit_page下一环节返回内容----", res.data);
                if (res.data.model.flag == false) {
                    this.onMultiCommit();
                } else {
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
        console.log("end_点击某一行的数据rowData=", row);
        // if (this.currentProcess.processName.indexOf("子流程") > 0) {
        //   console.log("---当前流程是子流程---");
        //   this.onSubCommit();
        // }
      } else {
        //不是结束
        let isSubProcessParameter = {
          //proInstId: this.currentProcess.proInstId,
          extendKey: "subProcess",
          actDefId: this.currentLink.actDefId,
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
        };
        api.isSubProcess(isSubProcessParameter).then((res) => {
          console.log(
            "是否是子流程接口返回值res：" + res.data.model.subProcess
          );
          if (res.data.model && res.data.model.subProcess) {
            this.selectIsSubProcess = true;
            console.log("结果:", this.selectIsSubProcess);
            this.subProcessName = res.data.model.subProcess;
          }
        });
        this.linkTitle = row.actDefName;
        this.flag = true;
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
    async onCommit() {
        console.log("所选环节为结束环节才走这个onCommit")
      // 提交
      if (this.currentProcess.processName.indexOf("子流程") > 0) {
        console.log("---当前流程是子流程---");
        this.onSubCommit();
        return;
      }
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
      console.log("this.noteRequired", this.noteRequired);
      if (this.noteRequired) {
        //如果输入框内容是空的
        if (this.opinionConfig[0] && !this.opinionConfig[0].noteContent) {
          Toast("请填写审批意见");
          return;
        }
      }
      //校验是否支行用印流程
      if (this.sendDeptVerify == true) {
        //校验是否填写了发送部门
        if (
          this.dataForm.sendDept === "" ||
          this.dataForm.sendDeptText === ""
        ) {
          Toast(`请填写发送部门再提交`);
          return;
        } else {
          this.modifySendDeptAndUsers();
        }
      }
      //校验是否是支行用印副中心流程
      console.log("this.businesssTypeVerify", this.businesssTypeVerify);
      console.log("this.dataForm.businessTyp", this.dataForm.businessType);
      if (this.businesssTypeVerify == true) {
        //校验是否填写了业务类型
        if (
          this.dataForm.businessType === "" ||
          this.dataForm.businessTypeText === ""
        ) {
          Toast(`请填写业务类型再提交`);
          return;
        } else {
          this.addBusinessType();
        }
      }
      let saveNoteResult = 0;
      //校验是否必填，必填的话调用意见保存方法 20220714
      if(this.noteRequired || (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
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
            this.$toast("提交失败");
            return
        }
        if(saveNoteResult === -2){
            this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
            this.$router.replace({ path: '/home', force: true })
            return
        }
      }
      //如果是子流程
      if (this.selectIsSubProcess) {
        data.isMobile = true;
        data.dataForm = this.dataForm;
        console.log("data.dataForm:", data.dataForm);
        console.log("data.wfmData", data.wfmData);
        console.log("接口开始时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

        setTimeout(() => {
          console.log("-----------所选环节是部室经理会签选择，调用subProcessCompleteWorkItem---------------")
          api.subProcessCompleteWorkItem(data).then((res) => {
            Toast.clear();
            if (res.data.status === "200") {
              this.$store.commit("setRefresh", true);
              if (this.fromOut) {
                Dialog.alert({
                  message: "提交成功",
                  width: "200px",
                  confirmButtonColor: "#ff4444",
                }).then(() => {
                    console.log("commitPage 381行的提交成功")
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
                console.log("commitPage 394行的提交成功")
                this.$router.replace({
                  name: this.backRoute,
                });
              });
            } else {
                this.$toast("提交失败");
            }
          });
        }, 500);
        console.log("接口结束时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

      } else {
        console.log("接口开始时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

        console.log("-------所选环节不是子流程---------");
        setTimeout(() => {
          console.log("-------------所选环节不是子流程，调用completeWorkitem--------------");
          api.completeWorkitem(data).then((res) => {
            console.log("commit_page 409行completeWorkitem被调用")
            Toast.clear();
            if (res.data.status === "200") {
              console.log("调用完成工作项接口返回值：" + res.data);
              this.$store.commit("setRefresh", true);
              if (this.fromOut) {
                Dialog.alert({
                  message: "提交成功",
                  width: "200px",
                  confirmButtonColor: "#ff4444",
                }).then(() => {
                    console.log("commitPage 419行的提交成功")
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
                console.log("commitPage 433行的提交成功")
                this.$router.replace({
                  name: this.backRoute,
                });
              });
            } else {
                this.$toast("提交失败");
            }
          });
        }, 500);
        console.log("接口结束时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

      }
    },

    async onMultiCommit() {
        this.$toast.loading({
            message: "提交中...",
            forbidClick: true,
            duration: 0,
      });
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
      let saveNoteResult = 0;
      if(this.noteRequired || (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
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
            this.$toast("提交失败");
            return
        }
        if(saveNoteResult === -2){
            this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
            this.$router.replace({ path: '/home', force: true })
            return
        }
      }
      console.log("接口开始时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

      setTimeout(() => {
        api.completeWorkitem(data).then((res) => {
            console.log("commit_page 478行completeWorkitem被调用")
            this.$toast.clear();
          if (res.data.status === "200") {
            this.$store.commit("setRefresh", true);
            Dialog.alert({
              message: "提交成功",
              width: "200px",
              confirmButtonColor: "#ff4444",
              closeOnClickOverlay: false,
            }).then(() => {
                console.log("commitPage 487行的提交成功")
              this.$router.replace({
                name: this.backRoute,
              });
            });
          } else {
            this.$toast("提交失败");
          }
        });
      }, 500);
      console.log("接口结束时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

    },
    async onSubCommit() {
        this.$toast.loading({
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
      let saveNoteResult = 0;
      //保存意见
      if(this.noteRequired || (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
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
            this.$toast("提交失败");
            return
        }
        if(saveNoteResult === -2){
            this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
            this.$router.replace({ path: '/home', force: true })
            return
        }
      }
      console.log("接口开始时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

      //移动端完成工作项
      setTimeout(() => {
        api.completeWorkitem(data).then((res) => {
          console.log("commit_page 551行completeWorkitem被调用")
          this.$toast.clear()
          if (res.data.status === "200") {
            this.$store.commit("setRefresh", true);
            if (this.fromOut) {
              Dialog.alert({
                message: "提交成功",
                width: "200px",
                confirmButtonColor: "#ff4444",
              }).then(() => {
                console.log("commitPage 560行的提交成功")
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
                console.log("commitPage 574行的提交成功")

              this.$router.replace({
                name: this.backRoute,
              });
            });
          } else {
            this.$toast("提交失败");
          }
        });
      }, 500);
      console.log("接口结束时间",moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

    },
    modifySendDeptAndUsers() {
      //保存发送部门以及对应的人员到业务表中
      console.log("modifySendDeptAndUsers", this.dataForm);

      if (this.dataForm.sendDept === null || this.dataForm.sendDept === "") {
        Toast("sendDept字段为空，请填写发送部门再提交");
      }
      if (
        this.dataForm.sendUserIds === null ||
        this.dataForm.sendUserIds === ""
      ) {
        Toast("sendUserIds字段为空，请填写发送部门再提交");
      }
      if (
        this.dataForm.sendUserIds === null ||
        this.dataForm.sendUserIds === ""
      ) {
        Toast("业务表单id字段为空，请填写发送部门再提交");
      }
      let params = {
        sendDept: this.dataForm.sendDept,
        sendUserIds: this.dataForm.sendUserIds,
        id: this.dataForm.id,
      };
      let distinguishFhbmYyzhiParameter = {
        extendKey: "distinguishFhbmYyzhi",
        actDefId: this.currentProcess.actDefId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
      };
      console.log("--------0----------");
      api
        .getActivityExtendConfigByName(distinguishFhbmYyzhiParameter)
        .then((res) => {
          console.log("-------1-----------");
          if (
            res.data.model &&
            res.data.model.distinguishFhbmYyzhi &&
            res.data.model.distinguishFhbmYyzhi == "fhbm"
          ) {
            console.log("---------2---------");
            api.yyfhbmModifySendDeptAndUsers(params).then((res) => {
              console.log(res.data.model.distinguishFhbmYyzhi);
              if (res.data.status === "200") {
                console.log("分行部门发送部门以及指定人员更新成功");
              }
            });
          }
          if (
            res.data.model &&
            res.data.model.distinguishFhbmYyzhi &&
            res.data.model.distinguishFhbmYyzhi == "yyzhi"
          ) {
            console.log("----------3--------");
            console.log(res.data.model.distinguishFhbmYyzhi);
            console.log(params);
            // api.getActivityExtendConfigByName(distinguishFhbmYyzhiParameter).then((res) => {

            //   })
            api.yyzhiModifySendDeptAndUsers(params).then((res) => {
              if (res.data.status === "200") {
                console.log("支行发送部门以及指定人员更新成功");
              }
            });
          }
          if (
            res.data.model &&
            res.data.model.distinguishFhbmYyzhi &&
            res.data.model.distinguishFhbmYyzhi == "yyfzxzhi"
          ) {
            console.log("----------3--------");
            console.log(res.data.model.distinguishFhbmYyzhi);
            console.log(params);
            // api.getActivityExtendConfigByName(distinguishFhbmYyzhiParameter).then((res) => {

            //   })
            api.yyfzxzhiModifySendDeptAndUsers(params).then((res) => {
              if (res.data.status === "200") {
                console.log("支行副中心发送部门以及指定人员更新成功");
              }
            });
          }
        });
    },
    addBusinessType() {
      if (
        this.dataForm.businessType === null ||
        this.dataForm.businessTypeText === ""
      ) {
        Toast("businessType或businessTypeText字段为空，请填写发送部门再提交");
      }
      let params = {
        businessType: this.dataForm.businessType,
        businessTypeText: this.dataForm.businessTypeText,
        id: this.dataForm.id,
      };
      api.addBusinessType(params).then((res) => {
        if (res.data.status === "200") {
          console.log("业务类型更新成功");
        }
      });
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
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.selet-ling-wrap {
  height: 100%;
  -webkit-overflow-scrolling: touch;

  .header-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .cell-wrap {
    position: absolute;
    top: 100px;
    bottom: 60px;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;

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

  .footer-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
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
