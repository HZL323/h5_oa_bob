<!--
 * @Author: your name
 * @Date: 2021-11-02 10:01:01
 * @LastEditTime: 2021-11-15 10:51:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_demo\src\modules\preview_page\index.vue
-->
<template>
  <div class="preview-wrap">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    >
    </van-nav-bar>
    <div id="pdfWrap"></div>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
import { api } from "../../core/api/index";

export default {
  components: {
    [NavBar.name]: NavBar,
  },
  name: "preview",
  data() {
    return {
      pdfh5: null,
      title: this.$route.params.title,
      attachmentId: this.$route.params.attachmentId,
    };
  },
  mounted() {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
    });
    api
      .Preview({
        fileid: this.attachmentId,
      })
      .then((res) => {
        Toast.clear();
        if (res.data.status === "200") {
          this.pdfh5 = new Pdfh5("#pdfWrap", {
            pdfurl: res.data.model.url,
            lazy: true,
            cMapUrl: "https://unpkg.com/pdfjs-dist@2.0.943/cmaps/",
            maxZoom: 6,
          });
          //监听完成事件
          this.pdfh5.on("complete", function (status, msg, time) {
            console.log(
              "状态：" +
                status +
                "，信息：" +
                msg +
                "，耗时：" +
                time +
                "毫秒，总页数：" +
                this.totalNum
            );
          });
        }
      });
  },
  methods: {
    onClickLeft() {
      this.$router.replace({
        name: "detail",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/common/css/common.less";
.preview-wrap {
  height: 100vh;
  overflow: hidden;

  #pdf {
    height: 100vh;
    width: 100vh;
  }
}
</style>