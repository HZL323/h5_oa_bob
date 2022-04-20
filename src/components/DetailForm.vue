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
        <div>{{ processTitle }}</div>
      </div>
      <van-divider />
      <div class="form-wrap">
        <div class="form-item" v-for="(item, index) in formConfig" :key="index">
          <div class="form-key">{{ item.colName }}</div>
          <div class="form-value" ref="formValue">{{ formMatData(item) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Divider, Skeleton } from "vant";
import { api } from "../core/api/index";
export default {
  name: "detailForm",
  components: {
    [Divider.name]: Divider,
    [Skeleton.name]: Skeleton,
  },
  data() {
    return {
      loading: true, // 加载数据标识
      formData: {}, // 表单数据
      processTitle: "", // 流程标题
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
  },
  created() {
    this.getFormData();
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
          console.log("formData", res);
          if (res.data.status === "200") {
            this.formData = res.data.model.dataForm;
            if(res.data.model.processTitle==="支行收文"  && res.data.model.dataForm.receiveDeptName==="营业部" && res.data.model.dataForm.sendDeptName==="北京银行"){
               this.processTitle = "总行支行收文";
            }else{
               this.processTitle = res.data.model.processTitle;
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
        case "sysFilePositionText":
          return formatArr("sysFilePosition");
        default:
          return this.formData[item.colCode] || "";
      }
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
      }
    }
  }
}
</style>