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
      <van-collapse
        v-model="activeNames"
        :border="false"
        v-if="list.length > 0"
      >
        <template v-for="(item, index) in list">
          <div :key="index">
            <van-collapse-item
              :title="item.name"
              :name="item.type"
              :disabled="item.fileData.length === 0"
              :border="false"
            >
              <template slot="icon">
                <div class="vertical-divider"></div>
              </template>
              <template slot="right-icon" v-if="item.fileData.length === 0"
                ><span>暂无</span></template
              >
              <template v-if="item.fileData.length > 0">
                <div
                  class="file-wrap van-hairline--top"
                  v-for="item_ in item.fileData"
                  :key="item_.attachmentId"
                  @click="onPreview(item_)"
                >
                  <div class="file-icon">
                    <i :class="fileIcon(item_)"></i>
                  </div>
                  <div class="file-name">{{ item_.attachmentName }}</div>
                  <div class="check-icon">
                    <i class="iconfont icon-yulan"></i>
                  </div>
                </div>
              </template>
            </van-collapse-item>
          </div>
        </template>
      </van-collapse>
      <wu-feedback v-else types="empty" />
    </template>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from "vant";
import { api } from "../core/api/index";
import { openUrlPage } from "../core/mxApi/index";

export default {
  name: "attachment",
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  data() {
    return {
      activeNames: [], // 展开意见标识list
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
        .queryAttachment({
          proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            this.list = res.data.model;
            this.list.forEach((item) => {
              if (item.fileData.length > 0) {
                this.activeNames.push(item.type);
              }
            });
            this.loading = false;
          }
        });
    },
    fileIcon(file) {
      let type = file.attachmentName.split(".").pop().toLowerCase();
      switch (type) {
        case "pdf":
          return "iconfont icon-file_pdf";
        case "pptx":
          return "iconfont icon-file_ppt";
        case "ppt":
          return "iconfont icon-file_ppt";
        case "xls":
          return "iconfont icon-file_excel";
        case "xlsx":
          return "iconfont icon-file_excel";
        case "doc":
          return "iconfont icon-file_word";
        case "docx":
          return "iconfont icon-file_word";
        case "jpg":
          return "iconfont icon-jpg1";
        case "jpeg":
          return "iconfont icon-jpg1";
        case "png":
          return "iconfont icon-jpg1";
        case "txt":
          return "iconfont icon-file_txt";
        case "zip":
          return "iconfont icon-file_zip";
        case "rar":
          return "iconfont icon-file_zip";
        default:
          return "iconfont icon-file-unknown-fill";
      }
    },
    onPreview(file) {
      debugger
      console.log("未查找之前id",file.attachmentId);
      api
        .getSealAttach({
          fileId: file.attachmentId,proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          console.log("查找文件中",res);
          if (res.data.status === "200" && res.data.model!=false) {            
              file.attachmentId = res.data.model;    
          }
          console.log("查找之后id",file.attachmentId);
          api
            .Preview({
              fileid: file.attachmentId,
              userid: this.$store.state.userInfo.userId
            })
            .then((res) => {
              if (res.data.status === "200") {
                openUrlPage(res.data.model.url).then((res) => {
                  console.log(res);
                });
              }
            });
        });

      //api
      //  .Preview({
      //    fileid: file.attachmentId,
      //  })
      //  .then((res) => {
      //    if (res.data.status === "200") {
      //      openUrlPage(res.data.model.url).then((res) => {
      //        console.log(res);
      //      });
      //    }
      //  });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/common/css/common.less";

.attachment-wrap {
  height: 100%;

  /deep/.van-collapse-item {
    margin-bottom: 16px;
    box-shadow: 0px 2px 6px 0px rgba(97, 101, 105, 0.08);
    border-radius: 8px;
    overflow: hidden;

    .van-collapse-item__title--disabled {
      .van-cell__title {
        color: #323233;
      }
    }

    .van-cell {
      padding: 14px 16px;
    }

    .van-cell__title {
      font-size: 16px;
    }

    .van-cell--clickable {
      display: flex;
      align-items: center;
    }

    .van-collapse-item__content {
      padding: 0 16px;
    }
  }

  .file-wrap {
    padding: 16px 0;
    display: flex;
    align-items: center;

    .file-icon {
      margin-right: 6px;
    }

    .file-name {
      color: #323233;
      font-size: 16px;
      flex: 1;
    }

    .check-icon {
      .iconfont {
        color: #ff4444;
      }
    }
  }
}
</style>