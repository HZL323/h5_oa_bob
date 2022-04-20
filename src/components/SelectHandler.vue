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
    <van-nav-bar :title="linkTitle" @click-left="onClickLeft" fixed placeholder>
      <template slot="left">
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <van-sticky offset-top="46">
      <van-search
        shape="round"
        v-model="value"
        placeholder="请输入搜索关键词"
      />
    </van-sticky>
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
    <van-tabbar safe-area-inset-bottom placeholder>
      <div class="btn-wrap">
        <van-button
          class="check-all"
          color="#ff4444"
          block
          round
          plain
          @click="onCheckAll"
          v-if="multiCheck"
          >全选</van-button
        >
        <van-button color="#ff4444" block round @click="onCommit"
          >确定</van-button
        >
      </div>
    </van-tabbar>
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
      handlerList: [], // 办理人或办理部门list
      loading: true, // 加载数据
    };
  },
  props: {
    linkTitle: {
      // navbar标题
      type: String,
      default: "",
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
            proDirId: this.currentLink.proDirId,
            actDefId: this.currentProcess.actDefId,
            userId: this.userInfo.userId,
            activity: {
              actDefId: this.currentLink.actDefId,
              actDefName: this.currentLink.actDefName,
              proDefId: this.currentLink.proDefId,
              actDefPath: this.currentLink.actDefPath,
              proDirId: this.currentLink.proDirId,
              actInstId: this.currentLink.actInstId,
            },
          },
        })
        .then((res) => {
          if (res.data.status === "200") {
            // 回显
            if (res.data.model.selectPersonType !== "radio") {
              this.multiCheck = true;
              this.result = this.currentSelectData.map((item) =>
                JSON.stringify(item)
              );
            } else {
              this.currentSelectData.length > 0 &&
                (this.radio = this.currentSelectData[0].orgId);
            }

            // 数据赋值
            this.handlerList = res.data.model.resourceIds;
          }
          this.loading = false;
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
    },
    toggle(index) {
      // 多选点击cell
      this.$refs.checkboxes[index].toggle();
    },
    onCheckAll() {
      // 全选
      this.$refs.checkboxGroup.toggleAll(true);
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
      this.$emit("checkedLink", data); // 确定选择的环节，传递选中的数据
      this.$emit("changeCom");
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.handler-wrap {
  height: 100%;

  .cell-wrap {
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
  }

  /deep/.van-button {
    height: 40px;
  }
}
</style>