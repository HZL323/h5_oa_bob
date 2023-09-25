<!--
 * @Author: your name
 * @Date: 2021-09-10 09:55:35
 * @LastEditTime: 2021-10-20 17:43:55
 * @LastEditors: Please set LastEditors
 * @Description: 待办、已办、已阅列表查询
 * @FilePath: \vue_demo\src\modules\list_page\index.vue
-->
<template>
  <div class="handler-wrap">
    <div class="header-wrap">
      <van-nav-bar
        title="服务请求批量办理"
        @click-left="onClickLeft"
        placeholder
      >
        <template slot="left">
          <van-icon name="cross" />
        </template>
      </van-nav-bar>
      <van-search
        shape="round"
        show-action
        v-model="searchParam"
        @search="onSearch"
        placeholder="请输入标题关键词"
      >
        <template slot="action">
          <van-button
            color="#ff4444"
            round
            @click="showChangeProcess = true"
            size="small"
            >切换流程</van-button
          >
        </template>
      </van-search>
    </div>

    <div class="cell-wrap">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <template v-if="!empty">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadData"          >
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
                    :title="item.title"
                    @click="toggle(index)"
                  >
                    <template slot="right-icon">
                      <van-checkbox
                        :name="formatName(item)"
                        ref="checkboxes"
                        icon-size="16"
                        checked-color="#ff4444"
                        shape="square"
                      />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </div>
          </van-list>
        </template>
        <wu-feedback v-else types="empty" />
      </van-pull-refresh>
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
    <van-popup
      v-model="showChangeProcess"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="切换流程"
        show-toolbar
        :columns="columns"
        swipe-duration="500"
        value-key="processName"
        default-index="0"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import config from "vux/src/plugins/config";
import { api } from "../../core/api/index";
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
  Picker,
  Popup,
  Toast,
  PullRefresh,
  List,
} from "vant";

export default {
  name: "fwqqListPage",
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
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
    [Picker.name]: Picker,
    [Popup.name]: Popup,
  },
  data() {
    return {
      refreshing: false,
      active: 0,
      key: "bj",
      value: "",
      radio: "", // 单选办理人
      result: [], // 选择的多选办理人/部门
      multiCheck: true, // 是否可以多选
      showMulti: true, //是否显示全选按钮
      handlerList: [], // 办理人或办理部门list
      multiFlag: false, //多选flag
      count: 0,
      selectData: [], // 已选择的数据
      subProcessName: "", //子流程的名称
      showChangeProcess: false,
      columns: [],
      searchParam: "",
      empty: false,
      finished: false,
      curPage: 1, // 当前查询数据页码
      pageSize: 10, // 每页查询数量
      dataCount: 0, // 数据总数
      loading: false, // 列表加载标识
    };
  },
  computed: {
    refresh() {
      return this.$store.state.refresh;
    },
    reg() {
      return new RegExp(`.*${this.value}.*$`);
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    },
  watch: {
    result(newVal, oldVal) {
      this.count = newVal.length;
    },
  },

  methods: {
    onConfirm(data, index) {
      this.$store.commit("setFwqqProcess", data.configCode);
      this.showChangeProcess = false;
      this.onRefresh();
      Toast(`当前服务请求流程类别为：${data.processName}`);
    },
    onCancel() {
      // 切换部门取消
      this.showChangeProcess = false;
    },

    onRefresh() {
      // 下拉刷新
      this.handlerList = [];
      this.curPage = 1;
      this.refreshing = false;
      this.finished = false;
      this.empty = false;
      this.loading = true;
      this.loadData();
    },
    loadData() {
      console.log("loadData被调用")
      this.columns = [
        {
          processName: "全部",
          configCode: "qq_zfhgjfcx_process,fh_ywsjcl_process,zh_ywsjcl_process,qq_ywsjcl_process,qq_ty_process,qq_dxfb_process,qq_bm_process",
        },
        {
          processName: "业务数据处理申请（总行）",
          configCode: "qq_ywsjcl_process",
        },
        {
          processName: "业务数据处理申请（分行）",
          configCode: "fh_ywsjcl_process",
        },
        {
          processName: "业务数据处理申请（支行）",
          configCode: "zh_ywsjcl_process",
        },
        {
          processName: "通用标准申请",
          configCode: "qq_ty_process",
        },
        {
          processName: "公检法查询申请",
          configCode: "qq_zfhgjfcx_process",
        },
        {
          processName: "短信发布申请",
          configCode: "qq_dxfb_process",
        },
        {
          processName: "部门主管业务清单维护申请",
          configCode: "qq_bm_process",
        },
      ];
      let actDefIdAndConfigCode = {
        fh_ywsjcl_process:"wsjcl_process_act10",
        zh_ywsjcl_process:"wsjcl_process_act10",
        qq_ywsjcl_process: "wsjcl_process_act10",
        qq_zfhgjfcx_process: "hgjfcx_process_act5",
        qq_ty_process: "qq_ty_process_act8",
        qq_dxfb_process: "q_dxfb_process_act6",
        qq_bm_process:"qq_bm_process_act8"
      };
      let actDefId =
        "hgjfcx_process_act5,wsjcl_process_act10,wsjcl_process_act10,wsjcl_process_act10,qq_ty_process_act8,q_dxfb_process_act6,qq_bm_process_act8";
      let configCode =
        "qq_zfhgjfcx_process,fh_ywsjcl_process,zh_ywsjcl_process,qq_ywsjcl_process,qq_ty_process,qq_dxfb_process,qq_bm_process";
      let allProcess = configCode;
      if (this.$store.state.fwqqProcess !== null && this.$store.state.fwqqProcess !== allProcess) {
        configCode = this.$store.state.fwqqProcess;
        actDefId = actDefIdAndConfigCode[configCode];
      }      
      let queryParams = {
          queryKind: "todo",
          queryLeaderFlag: "false",
          includeJz: "false",
          pageSize: this.pageSize,
          curPage: this.curPage,
          actDefId: actDefId,
          configCode: configCode,
          field: "",
          processName: "",
          order: "",
          title_wordNo: this.searchParam,
          personId: this.userInfo.userId,
      }
      console.log("queryParams", queryParams)
      api
        .showFwqqList(queryParams)
        .then((res) => {
          this.$store.commit("setRefresh", true);
          if (res.data.status === "200") {
            this.dataCount = res.data.model.dataCount
            res.data.model.pageData.forEach(item => {
              this.handlerList.push(item)
            })
            this.loading = false;
            this.curPage++;
            if (this.handlerList.length === 0) {
              this.empty = true;
            }
            if (this.handlerList.length >= this.dataCount) {
              this.finished = true;
            }
          }
        });
    },
    
    onCheckAll() {
      this.multiFlag = !this.multiFlag;
      // 全选
        this.$refs.checkboxGroup.toggleAll(this.multiFlag);
    },
    toggle(index) {
      if (this.multiFlag) {
        this.$refs.checkboxes[index].toggle();
      }
    },
    onCommit() {
      let data = this.result.map((item) => JSON.parse(item));
      console.log("commit---data:", data);
      if (this.result.length === 0) {
        this.$toast("请选择数据");
        return;
      }
      let params = {
        paramArr: JSON.stringify(data),
        flag: "mobile",
        userId: this.userInfo.userId,
      };
      api.batchCompleteWorkitem(params).then((res) => {
        if (res.data.status === "200") {
          let msg = res.data.model.msg;
          if(msg.indexOf("<br/>")){
            msg = msg.replace("<br/>", ",")
          }
          Toast(msg);
          this.handlerList = []
          this.curPage = 1
          this.loadData();
          this.count = 0;
          this.result = [];
        }
      });
    },

    onClickLeft() {
      this.value = "";
      this.$store.commit("setRefresh", false);
      this.$store.commit("setFwqqProcess", "qq_zfhgjfcx_process,fh_ywsjcl_process,zh_ywsjcl_process,qq_ywsjcl_process,qq_ty_process,qq_dxfb_process,qq_bm_process")
      this.$router.replace({
        name: "home",
      });
    },
    formatName(name) {
      // 返回json串作为标识符
      return JSON.stringify(name);
    },
    onSearch() {
      this.onRefresh();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";

.handler-wrap {
  height: 100%;
  // position: relative;
  // -webkit-overflow-scrolling: touch;

  /deep/.van-pull-refresh {
    min-height: 100%;
  }

  /deep/.van-search__action {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
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
    // padding-bottom: 30px;
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
}
.home-wrap {
  height: 100%;

  .header-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
