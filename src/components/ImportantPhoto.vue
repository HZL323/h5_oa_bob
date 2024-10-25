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
      <div class="round-card">
          <div class="wu-card">
              <div class="form-wrap">
                  <template >
                      <div class="form-item">
                          <div class="vertical-divider"></div>
                          <div class="form-key" style="font-size: 16px;color: #323233;">领用目的</div>
                          <div class="form-value">{{ this.purpose }}</div>
                      </div>
                      <div class="form-item">
                          <div class="vertical-divider"></div>
                          <div class="form-key" style="font-size: 16px;color: #323233;">发送单位</div>
                          <div class="form-value">{{ this.sendUnit }}</div>
                      </div>
                  </template>
              </div>
          </div>
      </div>
      <van-collapse
        v-model="activeNames"
        :border="false"
        v-if="this.activeNames.length > 0"
      >
        <template v-for="([key, value], index) in Object.entries(this.map)">
          <div :key="key + '_' + index">
            <van-collapse-item
              :title="value[0].ptypeName"
              :disabled="value.length === 0"
              :border="false"
            >
              <template slot="icon">
                <div class="vertical-divider"></div>
              </template>
              <template slot="right-icon" v-if="value.length === 0"
                ><span>暂无</span>
              </template>
              <template v-if="value.length > 0">
                <div
                  class="file-wrap van-hairline--top"
                  v-for="(item_, index) in value"
                  :key="index"
                >
                  <div class="file-icon">
                    <i :class="fileIcon()"></i>
                  </div>
                  <div class="file-name">{{ item_.photoName }}</div>
                  <div class="check-icon">{{ item_.pcount }}份</div>
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
  name: "importantPhoto",
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  data() {
    return {
      activeNames: [], // 展开意见标识list
      map: [], // 附件列表
      loading: true, // 等待加载数据
      sendUnit: "",
      purpose:"",
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
        .queryImportantPhoto({
          proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          if (res.data.status === "200") {
            console.log(res.data.model)
            if(res.data.model.relPhotoInfo != null){
              this.purpose = res.data.model.relPhotoInfo.purpose;
              this.sendUnit = res.data.model.relPhotoInfo.sendUnit;
            }
            let ptypeName = {}; // 用于存储分组的信息
            if (res.data.model.relPhotoList !== null && res.data.model.relPhotoList.length > 0) {
              res.data.model.relPhotoList.forEach(item => {
                if (!ptypeName[item.ptypeName]) {
                  // 如果 ptypeName 中还没有这个类型的项，则初始化一个数组
                  ptypeName[item.ptypeName] = [];
                }
                // 将 item 添加到对应类型的数组中
                ptypeName[item.ptypeName].push(item);
              });
            }
            this.map = ptypeName
            console.log("&&&&&&&:",Object.entries(this.map))
            // 获取 ptypeName 的所有键名
            this.activeNames = Object.keys(ptypeName);
            console.log("activeNames", this.activeNames)
            console.log("ptypeName", ptypeName)
            this.loading = false;
          }
        });
    },
    fileIcon() {
      return "iconfont icon-file_pdf";
    },
    onPreview(file) {
      debugger
      //console.log("未查找之前id",file.attachmentId);
      api
        .getSealAttach({
          fileId: file.attachmentId,proInstId: this.currentProcess.proInstId,
        })
        .then((res) => {
          //console.log("查找文件中",res);
          if (res.data.status === "200" && res.data.model!=false) {
              file.attachmentId = res.data.model;
          }
          //console.log("查找之后id",file.attachmentId);
          api
            .Preview({
              fileid: file.attachmentId,
              userid: this.$store.state.userInfo.userId,
              proInstId : this.currentProcess.proInstId
            })
            .then((res) => {
              if (res.data.status === "200") {
                openUrlPage(res.data.model.url).then((res) => {
                  //console.log(res);
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
