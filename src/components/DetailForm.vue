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
    <div class="wu-card" v-if="loading">
      <van-skeleton title :row="3" />
    </div>
    <div class="wu-card" v-else>
      <div class="title">
        <div class="vertical-divider"></div>
        <div class="process-title">{{ processTitle }}</div>
        <div v-if="!!senddeptverify && ifSendDept">
          <van-button
            class="send-dept"
            color="#ff4444"
            round
            size="small"
            @click="senDept"
            >发送部门</van-button
          >
        </div>
      </div>
      <van-divider />
      <div class="form-wrap">     
        <template v-for="(item,index) in formConfig">
          <div :class="{'form-item':true,'yyxx-row':item.colCode==='yyxx'}"  :key="index">
             <div class="form-key">{{item.colName}}</div>
             <div style="margin-top:6px;" v-if="item.colCode==='yyxx' && formMatData(item)!='' "></div>
             <div class="formRemark-value" ref="formValue" v-if="item.colCode==='yyxx' && formMatData(item)!='' ">{{ formMatData(item)}}</div>
             <div class="form-value" ref="formValue" v-if="item.colCode!='yyxx' " @click="formClick(item)">{{ formMatData(item)}}</div>
          </div>   
        </template>
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
          @confirm="onConfirm"
          @cancel="onCancel"
          swipe-duration="500"
          value-key="deptName"
          default-index="0"
        />
      </van-popup>
    </div>
</template>

<script>
import { Divider, Skeleton, Picker, Popup, Button, Toast } from "vant";
import { api } from "../core/api/index";
export default {
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
      senddeptverify: null,
      columns: [],
      gwCode: "",
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
    ifSendDept() {
      return this.$store.state.currentList === 'todo' || this.$store.state.currentList === 'seal';
    },
  },
  created() {
    this.getFormData();
    this.getActivityExtendConfigByName();
  },
  methods: {
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
          console.log("获取dataForm", res.data.model.dataForm);
          if (res.data.status === "200") {
            this.formData = res.data.model.dataForm
            this.$store.commit('setDataForm', res.data.model.dataForm);
            if(res.data.model.processTitle==="支行收文"  && res.data.model.dataForm.receiveDeptName==="营业部" && res.data.model.dataForm.sendDeptName==="北京银行"){
               this.processTitle = "总行支行收文";
            }else{
               this.processTitle = res.data.model.processTitle;
            }
            if(res.data.model.dataForm.sendUserIds!=null){
              this.currentProcess.sendUserIds=res.data.model.dataForm.sendUserIds;
              //console.log("------sendUserIds这个字段有值--------")
            }   
            this.loading = false;
            this.$nextTick(() => {
              this.initHeight();
            });
          }
        });
    },
    formMatData(item) {
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
        case "sysFilePositionText":
          return formatArr("sysFilePosition");
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
      }
      api.getActivityExtendConfigByName(isSendDeptVerifyParameter).then((res) => {
        if (res.data.status === '200') {
          if(res.data.model && res.data.model.sendDeptVerify){
            this.senddeptverify = true;
          };
          if(this.senddeptverify === true){
            let assignGwParameter = {
              extendKey: "assignGw",
              actDefId: this.currentProcess.actDefId,
              configId: this.currentProcess.configId,
              proDirId: this.currentProcess.proDirId,
            }
            api.getActivityExtendConfigByName(assignGwParameter).then((res) => {
              if (res.data.status === '200') {
                if(res.data.model && res.data.model.assignGw){
                  this.gwCode = res.data.model.assignGw;
                };
                if(this.gwCode !== ""){
                  let params = {
                    draftDept: this.currentProcess.draftDept,
                    gwCode: this.gwCode,
                  }
                  api.getSendDept(params).then(res => {
                    if (res.data.status === '200') {
                      this.columns = []
                      for(let i = 0; i < res.data.model.length; i++){
                          console.log( res.data.model[i])
                          this.columns.push({
                          deptName: res.data.model[i].deptName,
                          deptId: res.data.model[i].deptId,
                          users: res.data.model[i].users
                        })
                      }
                      console.log('发送部门',res);
              
                      // for(let key in res.data.model){
                      //   console.log(key)
                      //   let left = key.split("|")[0];//|左边是部门中文名称
                      //   let right = key.split("|")[1]//右边是部门id
                      //   this.columns.push({
                      //     deptName: left,
                      //     deptId: right,
                      //     users: res.data.model[key]
                      //   })
                      // }
                    }
                  })
                }
              }
            }) 
          }
        }
      });
    },
    formClick(item) {
      console.log(item);
      if (item.colCode === "sendDeptText") {
        this.show = true;
      }
    },
    senDept() {
      this.show = true
    },
    onConfirm(data, index) {
      // 切换部门确定
      if (!data.users) {
        Toast('您选择的发送部门下没有指定岗位的人员，请联系管理员')
        return
      }
      this.$set(this.formData, 'sendDeptText', data.deptName)
      this.$set(this.formData, 'sendDept', data.deptId)
      this.$set(this.formData, 'sendUserIds', data.users)
      this.$store.commit('setDataForm', this.formData);
      console.log("this.formData",this.formData)
      console.log("data.dept", data.dept)
      console.log("data.users", data.users)
      this.show = false;
      Toast(`当前发送部门为：${data.deptName}`)
    },
    onCancel() {
      // 切换部门取消
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.form-wrap {
  height: 100%;

  .wu-card {
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
          padding-left:26px;
          font-size:12px;
        }
      }
    }
  }

  .yyxx-row{
    display:block !important;
    .form-value{
      width:100%  !important;
      text-align:left !important;
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
}
</style>