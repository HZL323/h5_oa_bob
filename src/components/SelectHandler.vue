<!--
 * @Author: your name
 * @Date: 2021-09-17 11:06:28
 * @LastEditTime: 2021-10-22 09:48:20
 * @LastEditors: Please set LastEditors
 * @Description: 选择办理人组件
 * @FilePath: \vue_demo\src\components\SelectHandler.vue
-->
<template>
  <div class="handler-wrap">
    <div class="header-wrap">
      <van-nav-bar :title="linkTitle" @click-left="onClickLeft" placeholder>
        <template slot="left">
          <van-icon name="cross" />
        </template>
      </van-nav-bar>
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
        <div v-if="handlerList.length > 0">
          <van-checkbox-group
            v-model="result"
            ref="checkboxGroup"
            v-if="multiCheck"
          >
            <van-cell-group>
              <van-cell
                v-for="(item, index) in handlerList"
                clickable
                :key="index"
                :title="item.orgName"
                @click="toggle(index)"
                v-show="reg.test(item.orgName)"
              >
                <template slot="right-icon">
                  <van-checkbox
                    :name="formatName(item)"
                    :disabled="!showMulti"
                    ref="checkboxes"
                    icon-size="16"
                    checked-color="#ff4444"
                    shape="square"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <van-radio-group v-model="radio" v-else>
            <van-cell-group>
              <template v-for="(item, index) in handlerList">
                <van-cell
                  :title="item.orgName"
                  clickable
                  @click="onCellClick(item)"
                  :key="index"
                  v-show="reg.test(item.orgName)"
                >
                  <template slot="right-icon">
                    <van-radio
                      :name="item.orgId"
                      icon-size="16"
                      ref="celles"
                      checked-color="#ff4444"
                    />
                  </template>
                </van-cell>
              </template>
            </van-cell-group>
          </van-radio-group>
        </div>
        <wu-feedback v-else types="empty" />
      </div>
    </div>
    <div class="footer-wrap">
      <!-- <van-tabbar :safe-area-inset-bottom="true" :placeholder="true"> -->
      <div class="btn-wrap">
        <van-button
          class="check-all"
          color="#ff4444"
          block
          round
          plain
          @click="onCheckAll"
          v-if="showMulti"
          >全选</van-button
        >
        <van-button color="#ff4444" block round @click="onCommit"
          >确定 {{ count > 0 ? `(${count})` : "" }}
        </van-button>
      </div>
      <!-- </van-tabbar> -->
    </div>
  </div>
</template>

<script>
import { api } from "../core/api/index";
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
  Icon,
  Checkbox,
  CheckboxGroup,
} from "vant";
export default {
  name: "selectHandler",
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
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  data() {
    return {
      value: "",
      radio: "", // 单选办理人
      result: [], // 选择的多选办理人/部门
      multiCheck: false, // 是否可以多选
      showMulti: false, //是否显示全选按钮
      handlerList: [], // 办理人或办理部门list
      multiFlag: false, //多选flag
      loading: true, // 加载数据
      count: 0,
      selectData: [], // 已选择的数据
      subProcessName: "", //子流程的名称
      saveOpinionParams: []//意见参数
    };
  },
  props: {
    linkTitle: {
      // navbar标题
      type: String,
      default: "",
    },
    selectIsSubProcess:{
     // 所选环节是不是部室经理会签环节
      type: Boolean,
      required: true
    },
    sendDeptVerify:{
      type: Boolean,
      required: true
    },
    businessTypeVerify:{
      type: Boolean,
      required: true
    },
    currentRadio: {
      // navbar标题
      type: String,
      default: "",
    },
    currentSelectData: {
      // navbar标题
      type: Array,
      default: () => [],
    },
    currentLink: {
      // 当前选择的环节
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    reg() {
      return new RegExp(`.*${this.value}.*$`);
    },
    opinionConfig() {
      return this.$store.state.opinionData;
    },
    dataForm() {
      return this.$store.state.dataForm;
    },
    noteRequired() {
      return this.$store.state.noteRequired;
    },
  },
  watch: {
    result(newVal, oldVal) {
      this.count = newVal.length;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      api
        .queryHandlerList({
          wfmData: {
            actInstId: this.currentProcess.actInstId,
            proInstId: this.currentProcess.proInstId,
            workitemId: this.currentProcess.workitemId,
            configId: this.currentProcess.configId,
            proDirId: this.currentProcess.proDirId,
            actDefId: this.currentProcess.actDefId,
            userId: this.userInfo.userId,
            sendUserIds: this.currentProcess.sendUserIds
              ? this.currentProcess.sendUserIds
              : "",
            activity: {
              actDefId: this.currentLink.actDefId,
              actDefName: this.currentLink.actDefName,
              proDefId: this.currentLink.proDefId,
              actDefPath: this.currentLink.actDefPath,
              proDirId: this.currentLink.proDirId,
              actInstId: this.currentLink.actInstId,
            },
          },
          dataForm:this.dataForm
        })
        .then((res) => {
          if (res.data.status === "200") {
            // 回显
            //console.log("是否有单选选择标志位----",res);
            //console.log("-------选项------",res.data.model.selectPersonType);
            if (res.data.model.selectPersonType !== "radio") {
              //if(res.data.model.selectPersonType != "all"){
              this.multiCheck = true;
              if (res.data.model.selectPersonType !== "all") {
                this.showMulti = true;
              }
              //}
              this.result = this.currentSelectData.map((item) =>
                JSON.stringify(item)
              );
            } else {
              if (this.currentSelectData.length > 0) {
                this.radio = this.currentSelectData[0].orgId;
                this.count = 1;
              }
            }

            // 数据赋值
            this.handlerList = res.data.model.resourceIds;

            if (
              res.data.model.selectPersonType === "radio" &&
              this.handlerList.length > 0 &&
              res.data.model.isCheckFirst === "true"
            ) {
              this.radio = this.handlerList[0].orgId;
            }
          }
          this.loading = false;
          if (res.data.model.selectPersonType === "all") {
            setTimeout(() => {
              this.$refs.checkboxGroup.toggleAll(true);
            }, 600);
          }
          // if(res.data.model.selectPersonType === "radio"){
          //   setTimeout(() => {
          //     this.radio=this.handlerList[0].orgId;
          //   }, 600)
          // }
        });
    },
    formatName(name) {
      // 返回json串作为标识符
      return JSON.stringify(name);
    },
    onClickLeft() {
      // 关闭选择办理人组件
      this.$emit("changeCom");
    },
    onCellClick(row) {
      // 单选状态下点击选中办理人或办理部门
      this.radio = row.orgId;
      this.count = 1;
    },
    toggle(index) {
      // 多选点击cell
      if (this.multiFlag) {
        this.$refs.checkboxes[index].toggle();
      }
    },
    onCheckAll() {
      this.multiFlag = !this.multiFlag;
      // 全选
      this.$refs.checkboxGroup.toggleAll(this.multiFlag);
    },
    onCommit() {
      // 确定选择的数据
      let data = null;
      if (this.multiCheck) {
        data = this.result.map((item) => JSON.parse(item));
      } else {
        this.handlerList.forEach((item) => {
          if (item.orgId === this.radio) {
            data = [item];
          }
        });
      }
      console.log(data);
      this.selectData = data;
      // this.$emit("checkedLink", data); // 确定选择的环节，传递选中的数据
      // this.$emit("changeCom");
      if (data.length === 0) {
        this.$toast("请选择数据");
        return;
      }
      this.completeWork();
    },
    async completeWork() {
      // 提交

      this.$toast.loading({
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
        actDefId: this.currentProcess.actDefId,
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
        if (this.opinionConfig[0] && (!this.opinionConfig[0].noteContent || this.opinionConfig[0].noteContent.trim().length === 0)) {
          this.$toast("请填写审批意见");
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
          this.$toast(`请填写发送部门再提交`);
          return;
        } else {
          this.modifySendDeptAndUsers();
        }
      }
      //校验是否是支行用印副中心流程
      if (this.businessTypeVerify == true) {
        //校验是否填写了业务类型
        if (
          this.dataForm.businessType === "" ||
          this.dataForm.businessTypeText === ""
        ) {
          this.$toast(`请填写业务类型再提交`);
          return;
        } else {
          this.addBusinessType();
        }
      }
      debugger
      //校验是否必填，必填的话调用意见保存方法 必填生效
      console.log("this.noteRequired---------", this.noteRequired)
      console.log("this.opinionConfig[0]---------", this.opinionConfig[0])
      let saveOpinionRequire = false;
      if((this.noteRequired && this.opinionConfig[0]) || (!this.noteRequired &&  this.opinionConfig[0] && this.opinionConfig[0].noteContent)){
        saveOpinionRequire = "true";
        this.getSaveOpinionParams();
        data.saveOpinionParams = this.saveOpinionParams[0];
        data.saveOpinionRequire = saveOpinionRequire;
      }
      //如果是子流程
      if (this.selectIsSubProcess) {
        data.dataForm = this.dataForm;
        setTimeout(() => {
          console.log("-----------所选环节是部室经理会签选择，调用subProcessCompleteWorkItem---------------")
          api.subProcessCompleteWorkItem(data).then((res) => {
            if(res.data.status !== "200" || (res.data.status === "200" && res.data.model.code === -1)){
              this.$toast("提交失败");
              return
            }
            //处理保存意见相关的报错
            if(res.data.status === "200" &&  res.data.model.code === -2){
              this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
              this.$router.replace({ path: '/home', force: true })
              return
            }
            this.$toast.clear();
            if (res.data.status === "200" && res.data.model.code === 0) {
              this.$store.commit("setRefresh", true);
              if (this.fromOut) {
                this.$dialog
                  .alert({
                    message: "提交成功",
                    width: "200px",
                    confirmButtonColor: "#ff4444",
                  })
                  .then(() => {
                    console.log("selectHandler 443行的提交成功")
                    this.$store.commit("setFromOut", false);
                    this.$router.replace({
                      name: this.backRoute,
                    });
                  });
                return;
              }
              this.$dialog
                .alert({
                  message: "提交成功",
                  width: "200px",
                  confirmButtonColor: "#ff4444",
                })
                .then(() => {
                 console.log("selectHandler 459行的提交成功")
                  this.$router.replace({
                    name: this.$route.params.backRoute,
                  });
                });
            } else {
              this.$toast("提交失败");
            }
          });
        }, 500);
      } else {
        console.log("-------所选环节不是部室经理会签环节---------");
        setTimeout(() => {
          console.log("-------------所选环节不是部室经理会签环节，调用completeWorkitem--------------");
          api.completeWorkitem(data).then((res) => {
            if(res.data.status !== "200" || (res.data.status === "200" && res.data.model.code === -1)){
              this.$toast("提交失败");
              return
            }
            //处理保存意见相关的报错
            if(res.data.status === "200" &&  res.data.model.code === -2){
              this.$toast("由于您在PC端已经填过意见，需要重新进入页面加载该意见");
              this.$router.replace({ path: '/home', force: true })
              return
            }
            console.log("selectHandler 473行completeWorkitem被调用")
            this.$toast.clear();
            debugger
            if (res.data.status === "200" && res.data.model.code === 0) {
              console.log("调用完成工作项接口返回值：" + res.data);
              this.$store.commit("setRefresh", true);
              if (this.fromOut) {
                this.$dialog
                  .alert({
                    message: "提交成功",
                    width: "200px",
                    confirmButtonColor: "#ff4444",
                  })
                  .then(() => {
                    console.log("selectHandler 485行的提交成功")
                    this.$store.commit("setFromOut", false);
                    this.$router.replace({
                      name: this.backRoute,
                    });
                  });
                return;
              }

              this.$dialog
                .alert({
                  message: "提交成功",
                  width: "200px",
                  confirmButtonColor: "#ff4444",
                })
                .then(() => {
                    console.log("selectHandler 501行的提交成功")
                  this.$router.replace({
                    name: this.$route.params.backRoute,
                  });
                });
            } else {
              this.$toast("提交失败");
            }
          });
        }, 500);
      }
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
    getSaveOpinionParams(){
      this.opinionConfig.map((item) => {
        item.noteContent = item.noteContent.replace(/&#13;/g, "<br/>");
        item.noteContent = item.noteContent.replace(/\n/g, "<br/>");
        this.saveOpinionParams.push({
            id: item.id || "",
            type: item.noteId,
            noteContent: item.noteContent,
            proInstId: this.currentProcess.proInstId,
            createUser: this.userInfo.userId,
            createUserName: this.userInfo.userName,
            workitemId: this.currentProcess.workitemId,
            actDefId: this.currentProcess.actDefId,
        })
      })
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
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.handler-wrap {
  height: 100%;
  // position: relative;
  // -webkit-overflow-scrolling: touch;

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

    .check-all {
      margin-right: 16px;
    }
  }

  /deep/.van-tabbar {
    height: 60px;
    position: absolute;
    bottom: 0;
  }

  /deep/.van-button {
    height: 40px;
  }
}
</style>
