<template>
  <div class="seallist-wrap">
    <div class="form-container" v-for="(item, index) in list" :key="index">
      <div
        class="form-item"
        v-for="(item_, index_) in item.keysList"
        :key="index_ + 'child'"
      >
        <div class="form-key">{{ item_ }}</div>
        <div class="form-value" ref="formValue">{{ item[item_] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "seallist",
  data() {
    return {
      list: [],
    };
  },
  props: {
    sealList: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.sealList.forEach((item) => {
        this.list.push({
          ...item,
          keysList: Object.keys(item),
        });
        this.$nextTick(() => {
          let eles = this.$refs.formValue;
          eles.forEach((item) => {
            if (item.offsetHeight > 28) {
              item.style.textAlign = "left";
            }
          });
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.seallist-wrap {
  .form-container {
    background-color: #fafafa;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;

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
  & > :last-child {
    margin-bottom: 4px;
  }
}
</style>