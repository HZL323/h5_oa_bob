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
        <van-field
            center
            label-width="150px"
            input-align="center"
            label-align="left"
            v-model="estimateFieldValue"
            is-link
            readonly
            label="技术可行性评估"
            @click="autoFill"/>
        <div class="round-card">
          <div class="opinion-field card">
            <div id="showNoteText">
              <div class="header-wrap">
                <div class="header">
                  <div class="vertical-divider"></div>
                  <div class="field-title">评估结果说明</div>
                </div>
                <div class="header-right">
                </div>
              </div>
              <van-divider />
              <div class="field-wrap">
                <van-field
                  v-model="estimateRemark"
                  rows="4"
                  type="textarea"
                  maxlength="200"
                  :placeholder="notePlaceHolder"
                  @input="onClickInput"
                  show-word-limit
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <CommonCascader
        ref="CommonCascader"
        @onConfirm="onConfirm"
        />
    </div>
  </template>
  
  <script>
  import {
    Divider,
    Field,
    Picker,
    Skeleton,
    Button,
    Popup,
    Cascader
  } from "vant";
  import CommonCascader from "./CommonCascader.vue";
  export default {
    name: "fwqqBusiness",
    components: {
      CommonCascader,
      [Divider.name]: Divider,
      [Field.name]: Field,
      [Skeleton.name]: Skeleton,
      [Button.name]: Button,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Cascader.name]: Cascader
    },
    data() {
      return {
        estimateRemark:"",
        show: false,
        estimateFieldValue: "",
        notePlaceHolder: "请软件开发中心进行可行性评估并选择评估结果，最多200字",
        loading: true, // 等待数据加载
      };
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
      this.loading = false;
    },
    methods: {
      autoFill() {
        window.scroll(0, 0);
        let ele = document.documentElement || document.body;
        ele.scrollTop = 0;
        this.$refs.CommonCascader.show = true;
      },
      onClickInput() {
        this.$emit("onEstimateRemark", this.estimateRemark);
      },
      onConfirm(value) {
        this.estimateFieldValue = value
        this.$refs.CommonCascader.show = false;
        this.$emit("onEstimateFieldValue", this.estimateFieldValue);
      },
      onCancel() {
        this.show = false;
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  @import "../assets/common/css/common.less";
  
  .opinion-wrap {
    // background-color: #ffffff;
    .card {
      margin-bottom: 10px;
    }
    .opinion-content {
      .opinion-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #a7afbf;
  
        &::before {
          content: "";
          width: 8px;
          height: 8px;
          background: url("../assets/img/dot.png");
          background-size: contain;
          // border: 2px solid #a7afbf;
          // border-radius: 6px;
          margin-right: 8px;
          display: inline-block;
        }
  
        .name {
          margin-right: 8px;
        }
      }
  
      .opinion-content {
        background: #fafafa;
        // border-radius: 2px;
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
  
        .header-right {
          display: flex;
          align-items: center;
          height: 100%;
        }
        .button-wrap {
          border-radius: 16px;
          overflow: hidden;
  
          .custom-button {
            height: 32px;
            width: 100px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ff4444;
          }
        }
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
  