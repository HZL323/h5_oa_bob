<template>
  <div class="tracking-wrap">
    <van-nav-bar
      title="流程跟踪"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      z-index="99"
    />
    <wu-feedback v-if="loading" />
    <div class="setp-wrap" v-else>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(item, index) in dataList" :key="index">
          <div
            :class="{
              'step-wrap van-hairline--top': true,
              'van-hairline--bottom': item_.border,
            }"
            v-for="item_ in stepList"
            :key="item_.id"
          >
            <div class="title van-hairline--right">{{ item_.key }}</div>
            <div class="value">{{ formatData(item, item_.id) }}</div>
          </div>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import { NavBar, Step, Steps } from "vant";
import { api } from "../../core/api/index";
export default {
  name: "processTracking",
  components: {
    [NavBar.name]: NavBar,
    [Step.name]: Step,
    [Steps.name]: Steps,
  },
  data() {
    return {
      stepList: [
        {
          key: "流程名称",
          id: "proInstName",
          border: false,
        },
        {
          key: "任务名称",
          id: "name",
          border: false,
        },
        {
          key: "部门",
          id: "deptName",
          border: false,
        },
        {
          key: "办理人",
          id: "userName",
          border: false,
        },
        {
          key: "任务开始时间",
          id: "createTime",
          border: false,
        },
        {
          key: "任务结束时间",
          id: "completeTime",
          border: false,
        },
        {
          key: "办理状态",
          id: "state",
          border: true,
        },
      ],
      dataList: [],
      loading: true,
    };
  },
  computed: {
    currentProcess() {
      return this.$store.state.currentProcess;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    onClickLeft() {
      this.$router.replace({
        name: "detail",
      });
    },
    loadData() {
      api
        .listProcessTracking({
          actDefId: this.currentProcess.actDefId,
          workitemId: this.currentProcess.workitemId,
          proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            this.loading = false;
            this.dataList = res.data.model.curPageData.reverse();
          }
        });
    },
    
    formatData(item, key) {
      if (key === "state") {
        switch (item[key]) {
          case "open.running":
            return "正在办理";
          case "open.not_running.not_started":
            return "未读";
          case "closed.completed":
            return "已办理";
          case "closed.aborted":
            return "暂停";
          case "closed.terminated":
            return "已办理";
          case "open.not_running.suspended":
            return "正在办理";
          case "finished":
            return "已归档";
          default:
            return "";
        }
      } else {
        return item[key];
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.tracking-wrap {
  /deep/.van-step {
    padding-bottom: 32px !important;
  }

  /deep/.van-steps {
    .van-step--vertical {
      padding: 0;
    }

    .van-step--vertical:not(:last-child)::after {
      border-width: 0;
    }

    .van-steps__items {
      padding: 10px 0;
    }

    .van-step__icon {
      font-size: 20px;
    }

    .van-step__circle {
      width: 14px;
      height: 14px;
      background-color: #07c160;
    }
  }

  .step-wrap {
    color: #697184;
    display: flex;
    font-size: 16px;
    align-items: center;

    .title {
      width: 40%;
    }
    .value {
      width: 60%;
    }
    .title,
    .value {
      text-align: center;
      padding: 10px 0;
    }
  }
}
</style>