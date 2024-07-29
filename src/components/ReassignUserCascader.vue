<template>
  <!-- 选择国家的弹框 -->
  <van-popup
        v-model="show1"
        round
        :style="{ height: '70%' }"
        position="bottom"
      >
      <van-search
        v-model="keyWord"
        show-action
        placeholder="在这里查询人员"
        @search="onSearch"
        @cancel="onCancel"
      />
      <van-tree-select
        height="100%"
        :items="items"
        :active-id.sync="activeId"
        :main-active-index.sync="activeIndex"
        @click-item="confirm"
      />
    </van-popup>
</template>
<script>
import { Popup, Search, Dialog, TreeSelect} from "vant";
import { api } from "../core/api/index";
import { closeWindow } from "../core/mxApi";
export default {
  name: "ReassignUserCascader",
  components: {
    [Popup.name]: Popup,
    [Search.name]: Search,
    [TreeSelect.name]: TreeSelect
  },
  created(){
    api.getAsyncDeptTree({
      pexf: "consign",
      deptTreeId: "T001276001",
      rootCode: '["T001276001"]',
    })
    .then((res) => {
      let res1 = res.data.model;
      console.log("res1:",res1)
      let length =  res.data.model.length;
      this.items.push({
          text: '部门级',
          deptId:"",
          children: [],
      })
      for(let i = 0; i < length; i++){
        this.items.push({
          text: res1[i].deptName,
          deptId: res1[i].deptUuid,
          children: [],
        })
      }
      let deptUuid = ""
      for(let i = 0; i < length; i++){
        deptUuid += res.data.model[i].deptUuid+","
      }
      api.getUserByDeptUuidForGridNonPage({
        deptCode: "T001276001",
        deptUuid:deptUuid,
      }).then((response) => {
        let res2 = response.data.model
        console.log("res2:",res2)
        for(const [key, val] of Object.entries(res2)){
          if(key.startsWith("parent_")){
            for(let k = 0; k < res2[key].length; k++){
              this.items[0].children.push({
                text: res2[key][k].userName,
                id: k+1,
                userUuid: res2[key][k].userUuid,
              })
            }
            continue;
          }
          for(let j = 1; j < this.items.length; j++){
            if (key === this.items[j].deptId) {
              for(let k = 0; k < res2[key].length; k++){
                this.items[j].children.push({
                  text: res2[key][k].userName,
                  id: k+1,
                  userUuid: res2[key][k].userUuid,
                })
              } 
              break;
            }
          }
        }
        console.log(this.items)
      })
    })
  },
  data() {
    return {
      items: [],
      activeId: 1,
      activeIndex: 0,
      keyWord: "", // 搜索关键字
      show1: false,
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
  computed: {
    currentProcess() {
      return this.$store.state.currentProcess;
    },
    userInfo() {
        return this.$store.state.userInfo;
      },
    currentList() {
      return this.$store.state.currentList;
    },
  },
  methods: {
    confirm(value){
      console.log("confirm:", value)
      Dialog.confirm({
        title:"是否转办给"+value.text,
        confirmButtonColor: "#ff4444",
        cancelButtonText: "否",
        width: "300px",
        closeOnClickOverlay: false,
      })
      .then(() => {
        let data = {};
        data.wfmData = {
          actInstId: this.currentProcess.actInstId,
          proInstId: this.currentProcess.proInstId,
          workitemId: this.currentProcess.workitemId,
          configId: this.currentProcess.configId,
          proDirId: this.currentProcess.proDirId,
          actDefId: this.currentProcess.actDefId,
          processName: this.currentProcess.processName || "",
          userId: this.userInfo.userId,
          reassignResourceId: value.userUuid
        };
        api.reassignWorkitem(data).then((res) => {
          console.log(res)
          this.show1 = false
          this.$store.commit("setFromOut", false);
          Dialog.alert({
            message: "转办成功",
            width: "200px",
            confirmButtonColor: "#ff4444",
          }).then(() => {
            this.$store.commit("setRefresh", true);
            this.$router.replace({name:"home", force: true});
          });
        }) 
      })
      .catch((action) => {
        if (action !== "overlay") {
          setTimeout(() => {
            closeWindow();
          }, 2000);
        }
      });
    },
    cancel(){
      this.show1 = false
    },
    onCancel() {
    },
    // 检索人名
    onSearch(){
      console.log("this.keyWord:",this.keyWord)
      if(this.keyWord !== ""){
        for (let i = 0; i < this.items.length; i++) {
          for(let j = 0; j < this.items[i].children.length; j++){
            let val = this.items[i].children[j].text
            if (val === this.keyWord) {
                this.activeIndex = i;
                this.activeId = j+1;
            }
          }    
        }
      }
    },
  },
}


</script>

<style lang="less" scoped>
</style>