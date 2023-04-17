<template>
  <div class="common-opinions">
    <van-popup
      v-model="show"
      round
      :style="{ height: '70%' }"
      position="bottom"
    >
      <van-picker
        title="选择意见"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        swipe-duration="500"
        default-index="0"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Picker } from "vant";

export default {
  name: "commonOpinions",
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  data() {
    return {
      show: false,
    };
  },
  props: ["columns"],
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
    onConfirm(value, index) {
      this.$emit("onConfirm", value);
    },
    onCancel() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-picker__toolbar {
  .van-picker__title {
    font-size: 18px;
  }

  .van-picker__cancel,
  .van-picker__confirm {
    font-size: 16px;
  }

  .van-picker__confirm {
    color: #ff4444;
  }
}

/deep/.van-picker-column__item--selected {
  color: #ff4444;
}
</style>