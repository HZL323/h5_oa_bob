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
                  <div class="opinion-content"><p v-html="item_.noteContent"></p></div>
                </div>
              </template>
            </van-collapse-item>
          </div>
        </template>
      </van-collapse>
      <div class="opinion-field card" v-if="opinionConfig.length > 0">
        <div id="showNoteText" v-if="showNote">
          <div class="header">
            <div class="vertical-divider"></div>
            <div class="field-title">填写意见</div>
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
              :placeholder="item.noteName"
              @click-input="onClickInput"
              show-word-limit
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
  </div>
</template>

<script>
import { Collapse, CollapseItem, Divider, Field, Popup, Skeleton } from "vant";
import { api } from "../core/api/index";
export default {
  name: "opinion",
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Divider.name]: Divider,
    [Field.name]: Field,
    [Skeleton.name]: Skeleton,
  },
  data() {
    return {
      activeNames: [],
      message: "",
      opinionData: [], // 意见内容
      loading: true, // 等待数据加载
      showAdd: true, // 控制多行文本显示
      showNote: true, //控制意见显示
    };
  },
  props: {
    noteConfig: {
      type: Array,
      default: [],
    },
    opinionConfig: {
      type: Array,
      default: [],
    },
  },
  computed: {
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getOpinion();
      this.getEditOpinion();
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
            console.log("意见数据", res.data.model);
            let obj = {};
            this.opinionData = res.data.model;
            this.opinionData.forEach((item) => {
              if (obj[item.type]) {
                obj[item.type].push(item);
              } else {
                obj[item.type] = new Array(item);
              }
            });
            this.noteConfig.forEach((item) => {
              item.noteData = obj[item.noteCode] || [];
              if (item.noteData.length > 0) {
                this.activeNames.push(item.noteCode);
              }
            });
            this.loading = false;
            this.getEditOpinion();
          }
        });
    },
    getEditOpinion() {
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
          if (res.data.status === "200") {
            let eum = {}; // 将意见元转换为枚举数据
            this.noteConfig.forEach((item) => {
              eum[item.noteCode] = {
                noteName: item.noteName,
              };
            });
            let obj = {}; // 提取可编辑意见的回显数据
            this.opinionData.forEach((item) => {
              //console.log("意见中的详情数据状态", this.currentProcess.state);
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
            this.opinionConfig.forEach((item, i) => {
              this.opinionConfig.splice(i);
            });
            if (res.data.model.noteEdit) {
              let arr = res.data.model.noteEdit.split(",");
              arr.forEach((item) => {
                this.opinionConfig.push({
                  noteId: item,
                  noteName: eum[item].noteName,
                  noteContent: obj[item] ? obj[item].value : "",
                  id: obj[item] ? obj[item].id : "",
                });
              });
            }
          }
          //校验是否需要填写意见
          var showNote = document.getElementById("showNoteText");
          if (
            showNote != null &&
            this.currentProcess.state == "closed.completed"
          ) {
            showNote.hidden = true;
          }
        });
    },

    onClickInput() {
      this.$emit("onClickInput");
    },
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

    .header {
      display: flex;
      align-items: center;
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