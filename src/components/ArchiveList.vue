<!--
 * @Author: your name
 * @Date: 2021-09-15 17:57:05
 * @LastEditTime: 2021-11-15 10:50:11
 * @LastEditors: Please set LastEditors
 * @Description: 附件列表组件
 * @FilePath: \vue_demo\src\components\Attachment.vue
-->
<template>
    <div class="attachment-wrap">
      <wu-feedback v-if="loading" />
      <template v-else>
          <template v-for="(item, index) in list">
            <div :key="index">
                <div class="round-card">
                    <div class="wu-card">
                        <div class="title">
                            <div class="vertical-divider"></div>
                            <div class="process-title">{{ item.operSystem }}</div>
                        </div>
                        <van-divider />
                        <div class="form-wrap">
                            <template >
                                <div class="form-item">
                                    <div class="form-key">年度</div>
                                    <div class="form-value">{{ item.pigeonholeYear }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">文件类型</div>
                                    <div class="form-value">{{ item.operSystem }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">归档部室</div>
                                    <div class="form-value">{{ item.pigeonholeDept }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">文件字号</div>
                                    <div class="form-value">{{ item.fileNumber }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">文件标题</div>
                                    <div class="form-value">{{ item.mainTitle }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">盒号</div>
                                    <div class="form-value">{{ item.carrierNumber }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">件号</div>
                                    <div class="form-value">{{ item.fileSequence }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">保管期限</div>
                                    <div class="form-value">{{ item.preservationPeriod }}</div>
                                </div>
                                <div class="form-item">
                                    <div class="form-key">借出状态</div>
                                    <div class="form-value">{{ item.borrowState === "0" ? "未借出": item.borrowState === "1" ? "已借出"+ getTimeDiff(item.lendTime) : "已归还" }}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
          </template>
      </template>
    </div>
  </template>
  
  <script>
  import { Divider } from "vant";
  import { api } from "../core/api/index";
  import moment from "moment";
  export default {
    name: "archiveList",
    components: {
      [Divider.name]: Divider,
    },
    data() {
      return {
        list: [], // 附件列表
        loading: true, // 等待加载数据
      };
    },
    computed: {
      currentProcess() {
        return this.$store.state.currentProcess;
      },
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        api
          .getArchiveBorrowList({
            proInstId: this.currentProcess.proInstId,
          })
          .then((res) => {
            if (res.data.status === "200") {
              this.list = res.data.model;
              this.loading = false;
            }
          });
      },
      getTimeDiff(lendTime){
        const targetDate = moment(lendTime, 'YYYY-MM-DD HH:mm');
        // 当前时间
        const now = moment();
        // 计算日期差值
        const diff = moment.duration(now.diff(targetDate));
        // 获取天数，小时数，分钟数
        const days = diff.days();
        const minutes = diff.minutes();
        const hours = diff.hours();
        // 构建显示字符串
        let diffString = "";
        if(days !== 0){
            diffString += `${days}天`;
        }
        if(hours !== 0){
            diffString += `${hours}小时`;
        }
        if (minutes !== 0) {
            diffString += `${minutes}分钟`;
        }
        return diffString;
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  @import "../assets/common/css/common.less";
  
  .attachment-wrap {
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
        }
        }
    }
  }
  </style>
  