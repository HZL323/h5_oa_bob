<!--
 * @Author: your name
 * @Date: 2021-09-15 17:34:38
 * @LastEditTime: 2021-11-15 10:50:17
 * @LastEditors: Please set LastEditors
 * @Description: 表单详情组件
 * @FilePath: \vue_demo\src\components\DetailForm.vue
-->
<template>
  <div class="form-wrap">
    <div class="round-card" v-if="loading">
      <div class="wu-card">
        <van-skeleton title :row="3" />
      </div>
    </div>
    
    <div class="round-card" v-else>
      <div class="wu-card">
        <div class="title">
          <div class="vertical-divider"></div>
          <div class="process-title">{{ processTitle }}</div>
          <div v-if="!!sendDeptVerify && ifSendDept">
            <van-button
              class="send-dept"
              color="#ff4444"
              round
              size="small"
              @click="senDept"
              >发送部门</van-button
            >
          </div>
          <div v-if="!!businessTypeVerify && ifBusinessType">
            <van-button
              class="business-type"
              color="#ff4444"
              round
              size="small"
              @click="businessType"
              >业务类型</van-button
            >
          </div>
        </div>
        <div v-if="!specialChangeOrRevoke && !specialRequest && !sendDocIsDirect">
          <van-divider />
          <div class="form-wrap">
            <template v-for="(item, index) in formConfig" >
              <div
                :class="{
                  'form-item': true,
                  'yyxx-row': item.colCode === 'yyxx',
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  style="margin-top: 6px"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                ></div>
                <div
                  class="formRemark-value"
                  ref="formValue"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                >{{ formMatData(item) }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  v-if="item.colCode != 'yyxx'"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="!specialChangeOrRevoke && !specialRequest && sendDocIsDirect">
          <van-divider />
          <div class="form-wrap">
            <template v-for="(item, index) in sendDocFormConfig" >
              <div
                :class="{
                  'form-item': true,
                  'yyxx-row': item.colCode === 'yyxx',
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  style="margin-top: 6px"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                ></div>
                <div
                  class="formRemark-value"
                  ref="formValue"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                >{{ formMatData(item) }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  v-if="item.colCode != 'yyxx'"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="specialChangeOrRevoke || specialRequest">
          <van-divider />
          <div class="form-wrap">
            <template v-for="(item, index) in splitFormConfig" >
              <div
                :class="{
                  'form-item': true,
                  'yyxx-row': item.colCode === 'yyxx',
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  style="margin-top: 6px"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                ></div>
                <div
                  class="formRemark-value"
                  ref="formValue"
                  v-if="item.colCode === 'yyxx' && formMatData(item) != ''"
                >{{ formMatData(item) }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  v-if="item.colCode != 'yyxx'"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="specialChangeOrRevoke">
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="split1" >{{ changeRevokeLineNames[0] }}</van-divider>
          <div class="form-wrap"  v-if="split1">
            <template v-for="(item, index) in formConfig" v-if="item.colCode.endsWith('1')">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="split2" >{{ changeRevokeLineNames[1] }}</van-divider>
          <div class="form-wrap" v-if="split2" >
            <template v-for="(item, index) in formConfig" v-if="item.colCode.endsWith('2')">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="split3">{{ changeRevokeLineNames[2] }}</van-divider>
          <div class="form-wrap" v-if="split3">
            <template v-for="(item, index) in formConfig" v-if="item.colCode.endsWith('3')">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="split4">{{ changeRevokeLineNames[3] }}</van-divider>
          <div class="form-wrap" v-if="split4">
            <template v-for="(item, index) in formConfig" v-if="item.colCode.endsWith('4')">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="specialRequest">
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="specialRequestSplit1" >{{ requestLineNames[0] }}</van-divider>
          <div class="form-wrap"  v-if="specialRequestSplit1">
            <template v-for="(item, index) in formConfig" v-if="item.colCode === 'mainPayerCode' || item.colCode === 'mainBandwidthCode'">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="specialRequestSplit2" >{{ requestLineNames[1] }}</van-divider>
          <div class="form-wrap" v-if="specialRequestSplit2" >
            <template v-for="(item, index) in formConfig" v-if="item.colCode === 'bakPayerCode' || item.colCode === 'bakBandwidthCode'">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="specialRequestSplit3">{{ requestLineNames[2] }}</van-divider>
          <div class="form-wrap" v-if="specialRequestSplit3">
            <template v-for="(item, index) in formConfig" v-if="item.colCode === 'bakPayerCode2' || item.colCode === 'bakBandwidthCode2'">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
          <van-divider :style="{ color: 'red', borderColor: 'red'}" content-position="center" v-if="specialRequestSplit4">{{ requestLineNames[3] }}</van-divider>
          <div class="form-wrap" v-if="specialRequestSplit4">
            <template v-for="(item, index) in formConfig" v-if="item.colCode === 'testPayerCode' || item.colCode === 'testBandwidthCode'">
              <div
                :class="{
                  'form-item': true,
                }"
                :key="index"
              >
                <div class="form-key">{{ item.colName }}</div>
                <div
                  class="form-value"
                  ref="formValue"
                  @click="formClick(item)"
                >{{ formMatData(item) }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <van-popup
      v-model="show"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="选择部门"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm1"
        @cancel="onCancel1"
        swipe-duration="500"
        value-key="deptName"
      />
    </van-popup>
    <van-popup
      v-model="showBusinessType"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="选择业务类型"
        show-toolbar
        :columns="businessTypeColumns"
        @confirm="onConfirm2"
        @cancel="onCancel2"
        swipe-duration="500"
        value-key="value"
      />
    </van-popup>

    <van-popup
      v-model="showDocumentBasis"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="办文依据"
        show-toolbar
        :columns="documentBasisColumns"
        @confirm="onConfirmDocBa"
        @cancel="onCancelDocBa"
        swipe-duration="500"
        value-key="title"
      />
    </van-popup>
  </div>
</template>

<script>
import { Divider, Skeleton, Picker, Popup, Button, Toast } from "vant";
import moment, * as moments from "moment";
import { api } from "../core/api/index";
export default {
  //yinyanhong
  inject: ["reload"],
  name: "detailForm",
  components: {
    [Divider.name]: Divider,
    [Skeleton.name]: Skeleton,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
  },
  data() {
    return {
      loading: true, // 加载数据标识
      formData: {}, // 表单数据
      processTitle: "", // 流程标题
      show: false,
      showBusinessType: false,
      sendDeptVerify: false,
      businessTypeVerify: false,
      columns: [],
      businessTypeColumns: [],
      gwCode: "",
      //yinyanhong
      showDocumentBasis: false, //办文依据
      documentBasisColumns: [], //办文依据列表
      splitFormConfig:[],//分割后的（上部分）表单配置
      changeRevokeLineNames:['','','',''],
      requestLineNames:['','','',''],
      sendDocFormConfig:[]//这类的表单需要对字段值拆分,isDirect 发文中的是否直发文
    };
  },
  props: {
    formConfig: {
      type: Array,
      default: [],
    },
  },
  computed: {
    enumerationData() {
      return this.$store.state.enumerationData;
    },
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    ifBusinessType() {
      return (
        this.$store.state.currentList === "todo" ||
        this.$store.state.currentList === "seal" || this.$store.state === "fwtodo"
      );
    },
    ifSendDept() {
      return (
        this.$store.state.currentList === "todo" ||
        this.$store.state.currentList === "seal" || this.$store.state === "fwtodo"
      );
    },
    split1() {
      return this.formData["isUse1"] === "1";
    },
    split2(){
      return this.formData["isUse2"] === "1";
    },
    split3(){
      return this.formData["isUse3"] === "1";
    },
    split4(){
      return this.formData["isUse4"] === "1";
    },
    specialRequestSplit1(){
      console.log("useSceneName",this.formData["useSceneName"]) 
      return this.formData["useSceneName"].indexOf("生产") != -1
    },
    specialRequestSplit2(){
      return this.formData["useSceneName"].indexOf("生产") != -1
    },
    specialRequestSplit3(){
      return this.formData["useSceneName"].indexOf("生产") != -1
    },
    specialRequestSplit4(){
      return this.formData["useSceneName"].indexOf("测试") != -1
    },

    specialChangeOrRevoke(){
      let isSpecialChangeOrRevoke = (this.processTitle.indexOf("专线变更") != -1 || this.processTitle.indexOf("专线撤销") != -1);
      if(isSpecialChangeOrRevoke){
        this.splitFormConfig = this.formConfig;
        if(this.formData["isUse1"] === "1"){
          this.splitFormConfig = this.splitFormConfig.filter(item => !item.colCode.endsWith('1'))
        }
        if(this.formData["isUse2"] === "1"){
          this.splitFormConfig = this.splitFormConfig.filter(item => !item.colCode.endsWith('2'))
        }
        if(this.formData["isUse3"] === "1"){
          this.splitFormConfig = this.splitFormConfig.filter(item => !item.colCode.endsWith('3'))
        }
        if(this.formData["isUse4"] === "1"){
          this.splitFormConfig = this.splitFormConfig.filter(item => !item.colCode.endsWith('4'))
        }
        this.changeRevokeLineNames[0] = (this.enumerationData["changeRevokeLineName"]["line1"].value)
        this.changeRevokeLineNames[1] = (this.enumerationData["changeRevokeLineName"]["line2"].value)
        this.changeRevokeLineNames[2] = (this.enumerationData["changeRevokeLineName"]["line3"].value)
        this.changeRevokeLineNames[3] = (this.enumerationData["changeRevokeLineName"]["line4"].value)
      }
      return isSpecialChangeOrRevoke;
    },
    specialRequest(){
      let isSpecialRequest = (this.processTitle.indexOf("专线申请") != -1);
      console.log("isSpecialRequest", isSpecialRequest)
      if(isSpecialRequest){
        this.splitFormConfig = this.formConfig;
        //生产与测试
        let column = "mainPayerCode,mainBandwidthCode,bakPayerCode,bakBandwidthCode,bakPayerCode2,bakBandwidthCode2,testPayerCode,testBandwidthCode"
        this.splitFormConfig = this.splitFormConfig.filter(item => !(column.indexOf(item.colCode) != -1))
        this.requestLineNames[0] = (this.enumerationData["requestLineName"]["mainLine"].value)
        this.requestLineNames[1] = (this.enumerationData["requestLineName"]["bakLine1"].value)
        this.requestLineNames[2] = (this.enumerationData["requestLineName"]["bakLine2"].value)
        this.requestLineNames[3] = (this.enumerationData["requestLineName"]["testLine"].value)
      }
      return isSpecialRequest;
    },
    sendDocIsDirect(){
      console.log("_________enumerationData___________:",this.enumerationData)
      // 1 false true其实都是需要送投管的意思
      this.enumerationData["TOUGUAN_FLAG"] = 
      {0:{dictCode:"0", value:"是", sortNum : null},//代表要送投管
       1:{dictCode:"1", value:"否", sortNum : null},//代表不需要送投管
       "false":{dictCode:"false", value:"是", sortNum : null},//送投管送成功了
       "true":{dictCode:"true", value:"是", sortNum : null}}//表示送投管送失败了
      console.log("_______44__enumerationData___________:",this.enumerationData)
      let isSendDocIsDirect = (this.processTitle === "机关纪委发文"
      || this.processTitle === "工会发文" 
      || this.processTitle === "总行党委发文"
      || this.processTitle === "总行发文" 
      || this.processTitle === "部室发文" 
      || this.processTitle === "派驻纪检组发文");
      if(isSendDocIsDirect){
        console.log("_________formConfig___________:",this.formConfig)
        console.log("_________formData___________:",this.formData)
        this.sendDocFormConfig = this.formConfig;
        let k = 0;
        let sendDocFormConfigTemp = []
        let temp = this.sendDocFormConfig.filter(item => item.colCode === "isDirectText")
        for(let i = 0; i < this.sendDocFormConfig.length; i++){
          if(this.sendDocFormConfig[i].colCode === "isDirectText"){
            sendDocFormConfigTemp.push({canEdit:"0", colCode:"isDirect2", colName:"是否直发二级分行", formId: temp.formId, formName: temp.formName, id:"", name: temp.name, required: temp.required, sort:temp.sort, visiable: temp.visiable})
            sendDocFormConfigTemp.push({canEdit:"0", colCode:"isDirectzh", colName:"是否直发支行", formId: temp.formId, formName: temp.formName, id:"", name: temp.name, required: temp.required, sort:temp.sort, visiable: temp.visiable})
          }
          sendDocFormConfigTemp.push(this.sendDocFormConfig[i])
        }
        sendDocFormConfigTemp = sendDocFormConfigTemp.filter(item => !(item.colCode === "isDirectText"))
        this.sendDocFormConfig = sendDocFormConfigTemp
        if(this.formData["isDirect"] === "fou"){
          this.formData.isDirect2 = "否"
          this.formData.isDirectzh = "否"
        }
        if(this.formData["isDirect"] === "zfg"){
          this.formData.isDirect2 = "否"
          this.formData.isDirectzh = "是"
        }
        if(this.formData["isDirect"] === "zfej"){
          this.formData.isDirect2 = "是"
          this.formData.isDirectzh = "否"
        }
        if(this.formData["isDirect"] === "zfejz"){
          this.formData.isDirect2 = "是"
          this.formData.isDirectzh = "是"
        }
      }
      return isSendDocIsDirect;
    }
  },
  created() {
    this.getFormData();
    this.getActivityExtendConfigByName();
  },
  methods: {
    //yinyanhong
    refresh() {
      this.reload();
    },
    initHeight() {
      // 表单字段长度超过一行左对齐
      let refs = this.$refs.formValue;
      refs.forEach((el) => {
        let h = el.offsetHeight;
        if (h > 30) {
          el.style.textAlign = "left";
        }
      });
    },
    getFormData() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 获取表单数据
      api
        .getFormData({
          proInstId: this.currentProcess.proInstId,
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
          userId: this.$store.state.userInfo.userId,

          processName: this.currentProcess.processName,
          actDefId: this.currentProcess.actDefId,
          actInstId: this.currentProcess.actInstId,
          workitemId: this.currentProcess.workitemId,
          wfmRoleTypes: "todo,drafter",
        })
        .then((res) => {
          Toast.clear();
          //console.log("获取dataForm", res.data.model.dataForm);
          if (res.data.status === "200") {
            this.formData = res.data.model.dataForm;
            this.$store.commit("setDataForm", res.data.model.dataForm);
            if (
              res.data.model.processTitle === "支行收文" &&
              res.data.model.dataForm.receiveDeptName === "营业部" &&
              res.data.model.dataForm.sendDeptName === "北京银行"
            ) {
              this.processTitle = "总行支行收文";
            } else {
              this.processTitle = res.data.model.processTitle;
            }
            let params = {
              extendKey: "hideOpinion",
              actDefId: this.currentProcess.actDefId,
              configId: this.currentProcess.configId,
              proDirId: this.currentProcess.proDirId,
            };
            api.getActivityExtendConfigByName(params).then((res) => {
              if (res.data.status === "200") {
                if (
                  res.data.model &&
                  res.data.model.hideOpinion
                ) {
                  this.processTitle = res.data.model.hideOpinion;
                }
              }
            });
            if (res.data.model.dataForm.sendUserIds != null) {
              this.currentProcess.sendUserIds =
                res.data.model.dataForm.sendUserIds;
              //console.log("------sendUserIds这个字段有值--------")
            }
            //yinyanhong  办文依据
            this.documentBasisColumns = [];
            if (
              res.data.model.dataForm.basisList &&
              res.data.model.dataForm.basisList.length > 0
            ) {
              for (let key in res.data.model.dataForm.basisList) {
                this.documentBasisColumns.push({
                  proInstId: res.data.model.dataForm.basisList[key].proInstId,
                  title: res.data.model.dataForm.basisList[key].title,
                  processInfo: res.data.model.dataForm.basisList[key],
                });
              }
            } else {
              this.showDocumentBasis = false;
            }

            this.loading = false;
            this.$emit('updateCount')
            this.$nextTick(() => {
              this.initHeight();
            });
          }
        }); 
    },
    formMatData(item) {
      const format = "YYYY-MM-DD HH:mm";
      const format2 = "YYYY-MM-DD";
      if (item.colName === "优化完成时间" || item.colName === "短信发布时间") {
        let dateTime = moment(this.formData[item.colCode]).format(format2);
        return this.formData[item.colCode] ? dateTime : "";
      }
      if (/日期|时间/g.test(item.colName)) {
        let dateTime = moment(this.formData[item.colCode]).format(format);
        return this.formData[item.colCode] ? dateTime : "";
      }

      //   const mapDictKey = (item) =>{
      //     switch (item.colCode) {
      //       case "fwType":
      //         return "fileType";
      //       case "secretLevel":
      //         return "secret_level";
      //       default:
      //         return item.colCode;
      //     }
      //   };

      // 用来格式化表单数据值
      const reg = (dict, type) => {
        if (
          this.formData[type] &&
          this.enumerationData[dict] &&
          this.enumerationData[dict][this.formData[type]]
        ) {
          return this.enumerationData[dict][this.formData[type]].value;
        } else {
          return "";
        }
      };
      const formatArr = (type) => {
        if (this.formData[type]) {
          let arr = [];
          JSON.parse(this.formData[type]).forEach((item) => {
            arr.push(item.value);
          });
          return arr.join(",");
        } else {
          return "";
        }
      };

      switch (item.colCode) {
        case "priorityText":
          return reg("DOC_PRIORITY", "priority");
        case "secretLevelText":
          return reg("DOC_SECURITY_LEVEL", "secretLevel");
        case "fileTypeText":
          return reg("FILE_TYPE", "fileType");
        case "isDirectText":
          return reg("is_direct", "isDirect");
        case "sendMethodText":
          return reg("send_method", "sendMethod");
        case "preservationPeriodText":
          return reg("PRESERVATION_PERIOD", "preservationPeriod");
        case "mainDeptText":
          return reg("HOST_DEP", "mainDept");
        case "applyChangeTypeText":
          return reg("APPLY_CHANGE_TYPE", "applyChangeType");
        case "docTypeText":
          return reg("DOC_TYPE", "docType");
        case "pigeonholeYearText":
          return reg("ARCHIVE_YEAR", "pigeonholeYear");
        case "openStateText":
          return reg("OPEN_STATE", "openState");
        case "responsiblePersonText":
          return reg("RESPON_PERSON", "responsiblePerson");
        case "audioVisualTypeText":
          return reg("AUDIO_VISUAL_TYPE", "audioVisualType");
        case "printWayText":
          return reg("PRINT_WAY", "printWay");
        case "textSourceText":
          return reg("TEXT_SOURCE", "textSource");
        case "businessType":
          return reg("BUSINESS_TYPE", "businessType");
        //业务数据处理单
        case "dataType":
          return reg("BusinessDataType", "dataType");
        case "demandType":
          return reg("DemandType", "demandType");
        case "isEffectClient":
          return reg("IsEffectClient", "isEffectClient");
        case "isInvolveInfo":
          return reg("IsInvolveInfo", "isInvolveInfo");
        case "isClientRequire":
          return reg("IsClientRequire", "isClientRequire");
        case "estimateResult":
          return reg("EstimateResult", "estimateResult");
        case "sysFilePositionText":
          return formatArr("sysFilePosition");
        case "DemandScreen":
          return formatArr("demandScreenList");
        case "isSearchSynDept":
          return reg("IsSearchSynDept", "isSearchSynDept");
        case "testResult":
          return reg("testResult", "testResult");
        case "confirmResult":
          return reg("confirmResult", "confirmResult");
        case "isDataDelete":
          return reg("isDataDelete", "isDataDelete");
        case "isMustTest":
          return reg("IsMustTest", "isMustTest");
        case "smsPubType":
          return reg("smsPubType", "smsPubType");
        case "useSceneCode":
          return reg("USE_SCENE_NAME", "useSceneCode");
        case "dataTypeCode":
          return reg("DATA_TYPE_NAME", "dataTypeCode");
        case "isNeedManageCode":
          return reg("IS_NEED_MANAGE_NAME", "isNeedManageCode");
        case "operator1":
          return reg("OPERATOR_DICT", "operator1");
        case "operator2":
          return reg("OPERATOR_DICT", "operator2");
        case "operator3":
          return reg("OPERATOR_DICT", "operator3");
        case "operator4":
          return reg("OPERATOR_DICT", "operator4");
        case "data1":
          return reg("DATA_TYPE_NAME", "data1");
        case "data2":
          return reg("DATA_TYPE_NAME", "data2");
        case "data3":
          return reg("DATA_TYPE_NAME", "data3");
        case "data4":
          return reg("DATA_TYPE_NAME", "data4");
        case "money1":
          return reg("PAYER_NAME", "money1");
        case "money2":
          return reg("PAYER_NAME", "money2");
        case "money3":
          return reg("PAYER_NAME", "money3");
        case "money4":
          return reg("PAYER_NAME", "money4");
        case "mainPayerCode":
          return reg("PAYER_NAME", "mainPayerCode");
        case "bakPayerCode":
          return reg("PAYER_NAME", "bakPayerCode");
        case "bakPayerCode2":
          return reg("PAYER_NAME", "bakPayerCode2");
        case "testPayerCode":
          return reg("PAYER_NAME", "testPayerCode");
        case "zhuanxian1":
          return reg("ZHUANXIAN_NAME", "zhuanxian1");
        case "zhuanxian2":
          return reg("ZHUANXIAN_NAME", "zhuanxian2");
        case "zhuanxian3":
          return reg("ZHUANXIAN_NAME", "zhuanxian3");
        case "zhuanxian4":
          return reg("ZHUANXIAN_NAME", "zhuanxian4");
        case "accessType1":
          return reg("ACCESSTYPE_DICT", "accessType1");
        case "accessType2":
          return reg("ACCESSTYPE_DICT", "accessType2");
        case "accessType3":
          return reg("ACCESSTYPE_DICT", "accessType3");
        case "accessType4":
          return reg("ACCESSTYPE_DICT", "accessType4");
        case "accessTypeNew1":
          return reg("ACCESSTYPE_DICT", "accessTypeNew1");
        case "accessTypeNew2":
          return reg("ACCESSTYPE_DICT", "accessTypeNew2");
        case "accessTypeNew3":
          return reg("ACCESSTYPE_DICT", "accessTypeNew3");
        case "accessTypeNew4":
          return reg("ACCESSTYPE_DICT", "accessTypeNew4");
        case "touguanFlag":
          return reg("TOUGUAN_FLAG", "touguanFlag");
        default:
          return this.formData[item.colCode] || "";
      }
    },
    getActivityExtendConfigByName() {
      let isSendDeptVerifyParameter = {
        extendKey: "sendDeptVerify",
        actDefId: this.currentProcess.actDefId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
      };
      let isBusinessType = {
        extendKey: "isCanEditField",
        actDefId: this.currentProcess.actDefId,
        configId: this.currentProcess.configId,
        proDirId: this.currentProcess.proDirId,
      };
      api
        .getActivityExtendConfigByName(isSendDeptVerifyParameter)
        .then((res) => {
          if (res.data.status === "200") {
            if(res.data.model && res.data.model.sendDeptVerify){
            this.sendDeptVerify = true;
          };
          this.$emit('sendDeptVerify', this.sendDeptVerify)
          if(this.sendDeptVerify === true){
              let assignGwParameter = {
                extendKey: "assignGw",
                actDefId: this.currentProcess.actDefId,
                configId: this.currentProcess.configId,
                proDirId: this.currentProcess.proDirId,
              };
              api
                .getActivityExtendConfigByName(assignGwParameter)
                .then((res) => {
                  if (res.data.status === "200") {
                    if (res.data.model && res.data.model.assignGw) {
                      this.gwCode = res.data.model.assignGw;
                    }
                    if (this.gwCode !== "") {
                      let params = {
                        draftDept: this.currentProcess.draftDept,
                        gwCode: this.gwCode,
                      };
                      api.getSendDept(params).then((res) => {
                        if (res.data.status === "200") {
                          this.columns = [];
                          for (let i = 0; i < res.data.model.length; i++) {
                            //console.log(res.data.model[i]);
                            this.columns.push({
                              deptName: res.data.model[i].deptName,
                              deptId: res.data.model[i].deptId,
                              users: res.data.model[i].users,
                            });
                          }
                          //console.log("发送部门", res);
                        }
                      });
                    }
                  }
                });
            }
          }
        });
      api.getActivityExtendConfigByName(isBusinessType).then((res) => {
        if (res.data.status === "200") {
          if (
            res.data.model &&
            res.data.model.isCanEditField == "businessTypeText"
          ) {
            this.businessTypeVerify = true;
            this.businessTypeColumns = [];
            // this.businessTypeColumns.push({
            //   key:888,
            //   value:"hhh",
            //   sortNum: 888
            // })
            // this.businessTypeColumns.push({
            //   key:777,
            //   value:"rrr",
            //   sortNum: 777
            // })
            function compare(property) {
              return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
              };
            }
            // console.log("this.enumerationData[BUSINESS_TYPE]:", this.enumerationData["BUSINESS_TYPE"]);

            for (let key in this.enumerationData["BUSINESS_TYPE"]) {
              this.businessTypeColumns.push({
                key: key,
                value: this.enumerationData["BUSINESS_TYPE"][key].value,
                sortNum: this.enumerationData["BUSINESS_TYPE"][key].sortNum,
              });
            }
            this.businessTypeColumns.sort(compare("sortNum"));
          }
          this.$emit('businessTypeVerify', this.businessTypeVerify)
        }
      });
    },
    formClick(item) {
      console.log(item);
      if (item.colCode === "sendDeptText") {
        this.show = true;
      }
      if (item.colCode === "businessTypeText") {
        this.showBusinessType = true;
      }
      //   if(item.colCode === "documentBasis"){
      //     this.showDocumentBasis = true;
      //   }
    },
    senDept() {
      this.show = true;
    },
    businessType() {
      this.showBusinessType = true;
    },
    documentBasis() {
      this.showDocumentBasis = true;
    },
    onConfirm1(data, index) {
      // 切换部门确定
      if (!data.users) {
        Toast("您选择的发送部门下没有指定岗位的人员，请联系管理员");
        return;
      }
      this.$set(this.formData, "sendDeptText", data.deptName);
      this.$set(this.formData, "sendDept", data.deptId);
      this.$set(this.formData, "sendUserIds", data.users);
      this.$store.commit("setDataForm", this.formData);
      this.$store.commit("setSendDeptText", data.deptName);
      console.log("this.formData", this.formData);
      console.log("data.dept", data.dept);
      console.log("data.users", data.users);
      this.show = false;
      Toast(`当前发送部门为：${data.deptName}`);
    },
    onConfirm2(data, index) {
      this.$set(this.formData, "businessTypeText", data.value);
      this.$set(this.formData, "businessType", data.key);
      this.$store.commit("setDataForm", this.formData);
      this.$store.commit("setBusinessTypeText", data.value);
      console.log("this.formData", this.formData);
      this.showBusinessType = false;
      Toast(`当前业务类型为：${data.value}`);
    },
    onConfirmDocBa(data, index) {
      data.processInfo.processFrom = "documentBasis";
      console.log("onConfirmDocBa", data);
      this.rowClick("toread", data.processInfo);
    },
    onCancel1() {
      // 切换部门取消
      this.show = false;
    },
    onCancel2() {
      this.showBusinessType = false;
    },
    onCancelDocBa() {
      this.showDocumentBasis = false;
    },
    rowClick(type, row) {
      // 点击查看详情
      this.$store.commit("setCurrentProcess", row);
      this.$store.commit("setRefresh", true);
      this.$store.commit("setCurrentList", type);
      this.reload();
      this.$router.replace({
        name: "docDetail",
        params: {
          preRoute: "detailForm", //DetailForm  detailForm
        },
        query: {
          from: "oa",
          queryKind: type,
        },
      });
      this.reload();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.form-wrap {
  height: 100%;

  .round-card {
    margin-bottom: 16px;
  }

  .wu-card {
    margin: 0;
    .title {
      display: flex;
      align-items: center;

      .vertical-divider {
        width: 3px;
        height: 18px;
        background-color: #ff4444;
        margin-right: 5px;
      }
      .process-title {
        flex: 1;
      }
    }

    .form-wrap {
      font-size: 14px;

      .form-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;

        .form-key {
          width: 40%;
          color: #697184;
        }

        .form-value {
          width: 60%;
          text-align: right;
          color: #323233;
        }

        .formRemark-value {
          width: 100%;
          text-align: right;
          color: #697184;
          padding-left: 26px;
          font-size: 12px;
        }
      }
    }
  }

  .yyxx-row {
    display: block !important;
    .form-value {
      width: 100% !important;
      text-align: left !important;
      padding: 8px 0 0 12px;
    }
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

  .send-dept {
    width: 100px;
    height: 32px;
  }
  .business-type {
    width: 100px;
    height: 32px;
  }
}
</style>
