<!--
 * @Author: your name
 * @Date: 2021-09-16 10:17:49
 * @LastEditTime: 2022-03-14 13:55:08
 * @LastEditors: Joker
 * @Description: 意见显示与编辑组件
 * @FilePath: /20211216/src/components/Opinion.vue
-->
<template>
  <div class="opinion-wrap">
    <div class="wu-card" v-if="loading">
      <van-skeleton title :row="3" />
    </div>
    <template v-else>
      <van-collapse v-model="activeNames" :border="false">
        <template v-if="sealList.length > 0">
          <van-collapse-item
            title="用印文件信息详情"
            name="sealDetail"
            :disabled="sealList.length === 0"
            :border="true"
          >
            <template slot="icon">
              <div class="vertical-divider"></div>
            </template>
            <template slot="right-icon" v-if="sealList.length === 0"
              ><span>暂无</span></template
            >
            <template v-else>
              <SealList :sealList="sealList" />
            </template>
          </van-collapse-item>
        </template>
        <template v-for="item in noteConfig">
          <div :key="item.noteCode">
            <van-collapse-item
              :title="item.noteName"
              :name="item.noteCode"
              :disabled="item.noteData.length === 0"
              :border="true"
            >
              <template slot="icon">
                <div class="vertical-divider"></div>
              </template>
              <template slot="right-icon" v-if="item.noteData.length === 0"
                ><span>暂无</span></template
              >
              <template v-else>
                <div
                  class="opinion-content"
                  v-for="(item_, index_) in item.noteData"
                  :key="index_"
                >
                  <div class="opinion-info">
                    <div class="name">{{ item_.createUserName }}</div>
                    <div class="date-time">{{ item_.createTime }}</div>
                  </div>
                  <div class="opinion-content">
                    <p v-html="item_.noteContent"></p>
                  </div>
                </div>
              </template>
            </van-collapse-item>
          </div>
        </template>
      </van-collapse>
      <div
        class="opinion-field card"
        v-if="
          opinionConfig.length > 0 &&
          (currentList === 'todo' ||
            currentList === 'seal' ||
            currentList === 'toread')
        "
      >
        <div id="showNoteText" v-if="showNote">
          <div class="header-wrap">
            <div class="header">
              <div class="vertical-divider"></div>
              <div class="field-title">填写意见</div>
            </div>
            <div>
              <van-button
                class="auto-fill"
                color="#ff4444"
                round
                size="small"
                @click="autoFill"
                >常用意见</van-button
              >
            </div>
          </div>
          <van-divider />
          <div
            class="field-wrap"
            v-for="item in opinionConfig"
            :key="item.noteId"
          >
            <div class="field-title">{{ item.noteName }}</div>
            <van-field
              v-model="item.noteContent"
              rows="4"
              type="textarea"
              maxlength="500"
              :placeholder="notePlaceHolder"
              @click-input="onClickInput"
              show-word-limit
              ref="textarea"
            />
          </div>
        </div>
      </div>
    </template>

    <div
      id="showTextArea"
      class="field-wrap"
      style="height: 10px"
      v-if="showAdd"
    >
      <van-field class="bgc-f" v-model="message" type="input" />
    </div>
    <div v-if="fromOut" style="width: 100%; height: 44px"></div>
    <CommonOpinions
      ref="CommonOpinions"
      :columns="columns"
      @onConfirm="onConfirm"
    />
  </div>
</template>

<script>
import {
  Collapse,
  CollapseItem,
  Divider,
  Field,
  Picker,
  Skeleton,
  Button,
  Popup,
  Toast,
} from "vant";
import { api } from "../core/api/index";
import SealList from "./SealList.vue";
import CommonOpinions from "./CommonOpinions.vue";
export default {
  name: "opinion",
  components: {
    SealList,
    CommonOpinions,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Divider.name]: Divider,
    [Field.name]: Field,
    [Skeleton.name]: Skeleton,
    [Button.name]: Button,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
  },
  data() {
    return {
      notePlaceHolder:"请输入意见，最多500字",
      activeNames: [],
      message: "",
      opinionData: [], // 意见内容
      loading: true, // 等待数据加载
      showAdd: true, // 控制多行文本显示
      showNote: true, //控制意见显示
      show: false,
      columns: ["同意", "已阅"], // TODO 这块要去后端获取意见列表
      sealList: [], // 用印申请明细列表
      placeholder: false,
    };
  },
  props: {
    //noteConfig是所有的意见
    noteConfig: {
      type: Array,
      default: [],
    },
    //opinionConfig是可编辑的意见
    opinionConfig: {
      type: Array,
      default: [],
    },
    fromOut: {
      type: Boolean,
    },
  },
  computed: {
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentList() {
      return this.$store.state.currentList;
    },
  },
  created() {
    this.init();
    this.getSealList();
  },
  methods: {
    init() {
      this.getOpinion();
      // this.getEditOpinion();
      this.getCollectedOpinion();
      this.changeNotePlaceHolder();
    },
    getCollectedOpinion() {
      api
        .getCollectedOpinion({
          userId: this.$store.state.userInfo.userId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            for (let i = 0; i < res.data.model.noteList.length; i++) {
              this.columns.push(res.data.model.noteList[i].note);
            }
          }
        });
    },
    getOpinion() {
      // 获取意见数据
      api
        .getOpinionData({
          proInstId: this.currentProcess.proInstId,
          configCode: this.currentProcess.configCode,
        })
        .then((res) => {
          if (res.data.status === "200") {
            let obj = {};
            this.opinionData = res.data.model;
            console.log(
              "opinionData是后端返回的全部意见数据，包括必填和非必填",
              this.opinionData
            );
            this.opinionData.forEach((item) => {
              if (obj[item.type]) {
                obj[item.type].push(item);
              } else {
                obj[item.type] = new Array(item);
              }
            });
            console.log("obj是对type相同的归到同一类", obj);

            this.noteConfig.forEach((item) => {
              //console.log("noteConfig_item", item)
              item.noteData = obj[item.noteCode] || [];
              if (item.noteData.length > 0) {
                this.activeNames.push(item.noteCode);
              }
            });
            console.log(
              "noteConfig表示所有意见框，空白的或者有意见的意见框总和",
              this.noteConfig
            );
            console.log(
              "activeNames表示所有已经填写意见的意见框名称",
              this.activeNames
            );
            this.loading = false;
            this.getEditOpinion();
          }
        });
    },
    getEditOpinion() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 获取可编辑意见
      api
        .getOpinionConfig({
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
          Toast.clear();
          console.log("getEditOpinion()_res.data.model:", res.data.model);
          if (res.data.status === "200") {
            let eum = {}; // 将意见元转换为枚举数据
            this.noteConfig.forEach((item) => {
              eum[item.noteCode] = {
                //noteCode：意见框的字母名称比如"fhbmhqyj"
                noteName: item.noteName, //noteName：意见框的中文名称比如“分行部门会签意见”
              };
            });
            let obj = {}; // 提取可编辑意见的回显数据?? 这里的obj是什么
            this.opinionData.forEach((item) => {
              if (
                item.actDefId === this.currentProcess.actDefId &&
                item.isSubmitAfter === "N" &&
                item.createUser === this.userInfo.userId &&
                item.proInstId === this.currentProcess.proInstId
              ) {
                obj[item.type] = {
                  value: item.noteContent,
                  type: item.type,
                  id: item.id,
                };
              }
            });
            const copy = Object.assign({}, obj);
            console.log("可编辑意见的回显数据obj:", copy);
            console.log("可编辑意见opinionConfig", this.opinionConfig);
            this.opinionConfig.forEach((item, i) => {
              this.opinionConfig.splice(i);
            });
            console.log("可编辑意见opinionConfig_slice", this.opinionConfig);
            console.log(
              "可编辑意见opinionConfig_长度",
              this.opinionConfig.length
            );
            console.log("res.data.model.noteEdit", res.data.model.noteEdit); //比如yydbyj
            if (res.data.model.noteEdit) {
              let arr = res.data.model.noteEdit.split(",");
              arr.forEach((item) => {
                this.opinionConfig.push({
                  noteId: item, //比如yydbyj
                  noteName: eum[item].noteName, //比如"用印督办意见"
                  noteContent: obj[item] ? obj[item].value : "",
                  id: obj[item] ? obj[item].id : "",
                });
              });
              console.log("currentList", this.currentList);
            }
            console.log("可编辑意见opinionConfig_push", this.opinionConfig);
            console.log(
              "可编辑意见opinionConfig_push_length",
              this.opinionConfig.length
            );
          }
          //校验是否需要填写意见
          //opinionConfig.length>0 -> showNote
          //判断dom存不存在
          var showNoteDom = document.getElementById("showNoteText");
          if (
            showNoteDom != null &&
            this.currentProcess.state == "closed.completed"
          ) {
            showNoteDom.hidden = true;
          }

          // this.$store.commit("updateCount", 1);
        });
    },
    getSealList() {
      // 获取用印申请明细列表
      api
        .sealDetail({
          proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          this.sealList = res.data.model;
          this.sealList.length > 0 && this.activeNames.push("sealDetail");
        });
    },
    autoFill() {
      // this.opinionConfig.forEach((item) => {
      //   if (item.noteId !== "bz") {
      //     item.noteContent = "同意";
      //   }
      // });
      // this.show = true;
      this.$refs.CommonOpinions.show = true;
    },
    onConfirm(value) {
      this.opinionConfig.forEach((item) => {
        if (item.noteId !== "bz") {
          item.noteContent = value;
        }
      });
      this.$refs.CommonOpinions.show = false;
    },
    onCancel() {
      this.show = false;
    },
    onClickInput() {
      this.$emit("onClickInput");
    },
    changeNotePlaceHolder(){
        let params = {
            extendKey: "noteRemind",
            actDefId: this.currentProcess.actDefId,
            configId: this.currentProcess.configId,
            proDirId: this.currentProcess.proDirId
        }
        api.getActivityExtendConfigByName(params).then((res) => {
            if(res.data.status === "200"){
                if(res.data.model && res.data.model.noteRemind && res.data.model.noteRemind){
                    this.notePlaceHolder = res.data.model.noteRemind;
                }
            }
        })
    }
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.opinion-wrap {
  // background-color: #ffffff;
  /deep/.van-collapse-item {
    margin-bottom: 16px;
    box-shadow: 0px 2px 6px 0px rgba(97, 101, 105, 0.08);
    border-radius: 8px;
    overflow: hidden;

    .van-collapse-item__title--disabled {
      .van-cell__title {
        color: #323233;
      }
    }

    .van-cell__title {
      font-size: 16px;
    }

    .van-cell--clickable {
      display: flex;
      align-items: center;
    }
  }

  /deep/.van-collapse-item--border::after {
    border-width: 0;
  }

  .opinion-content {
    .opinion-info {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #a7afbf;

      &::before {
        content: "";
        width: 6px;
        height: 6px;
        background: #ffffff;
        border: 2px solid #a7afbf;
        border-radius: 6px;
        margin-right: 8px;
        display: inline-block;
      }

      .name {
        margin-right: 8px;
      }
    }

    .opinion-content {
      background: #fafafa;
      border-radius: 2px;
      padding: 16px;
      font-size: 14px;
      color: #323233;
      margin: 8px 0;
    }
  }

  .opinion-field {
    padding: 16px;

    .header-wrap {
      display: flex;
    }

    .header {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .auto-fill {
      width: 100px;
      height: 32px;
    }

    .field-wrap {
      .field-title {
        font-size: 14px;
        color: #a7afbf;
        margin: 8px 0;
      }
    }

    /deep/.van-field {
      background-color: #fafafa;
    }
  }
}
</style>
