<!--
 * @Author: your name
 * @Date: 2021-09-17 15:13:54
 * @LastEditTime: 2021-09-17 15:33:46
 * @LastEditors: Please set LastEditors
 * @Description: 加载动画和暂无数据组件
 * @FilePath: \vue_demo\src\components\EmptyLoading.vue
-->
<template>
  <div class="feedback-wrap">
    <van-loading size="24px" v-if="types === 'loading'">加载中...</van-loading>
    <van-empty :description="description" v-else />
  </div>
</template>

<script>
import { Loading, Empty } from "vant";
export default {
  name: "feedBack",
  components: {
    [Loading.name]: Loading,
    [Empty.name]: Empty,
  },
  props: {
    types: {
      // 反馈类型 loading empty
      type: String,
      default: "loading",
    },
    description: {
      // 空数据描述
      type: String,
      default: "暂无数据",
    },
  },
};
</script>

<style lang="less" scoped>
.feedback-wrap {
  display: flex;
  justify-content: center;
  padding: 8px;
}
</style>
