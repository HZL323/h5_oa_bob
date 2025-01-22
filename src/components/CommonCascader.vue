<template>
    <div>
      <van-popup
        v-model="show"
        round
        :style="{ height: '70%' }"
        position="bottom"
      >
      <van-cascader
        v-model="estimateFieldValue"
        title="技术可行性评估"
        :options="options"
        @close="show = false"
        @finish="onFinish"
        swipe-duration="500"
        default-index="0"
      />
      </van-popup>
    </div>
  </template>
  
  <script>
  import { Popup, Cascader } from "vant";
  
  export default {
    name: "commonCascader",
    components: {
      [Popup.name]: Popup,
      [Cascader.name]: Cascader
    },
    data() {
      return {
        estimateFieldValue:"",
        // 选项列表，children 代表子选项，支持多级嵌套
        options: [
            {
                text: '通过',
                value: '1',
                children: [{ text: '需要业务测试', value: '11' },{ text: '不需要业务测试', value: '10' }],
            },
            {
                text: '不通过',
                value: '0',
            },
        ],
        show: false,
      };
    },
    mounted() {
      const body = document.querySelector("body");
      if (body.append) {
        body.append(this.$el);
      } else {
        body.appendChild(this.$el);
      }
    },
    destroyed() {
      this.$el.remove();
    },
    methods: {
        // 全部选项选择完毕后，会触发 finish 事件
      onFinish({ selectedOptions }) {
        this.show = false;
        this.estimateFieldValue = selectedOptions.map((option) => option.text).join('/');
        this.$emit("onConfirm", this.estimateFieldValue);
        console.log(this.estimateFieldValue,"---------------")
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  </style>