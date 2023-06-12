/*
 * @Author: your name
 * @Date: 2021-09-15 11:01:00
 * @LastEditTime: 2021-12-07 15:12:14
 * @LastEditors: Please set LastEditors
 * @Description: 全局工具插件配置等
 * @FilePath: \vue_demo\src\core\utils\tools.js
 */
import Vue from 'vue'
import { getCurrentUser, closeWindow } from '../../core/mxApi'
import router from '../../rootRouter/index'
import Store from '../../store/index'
import { api } from '../api/index'
import { Toast, Dialog } from 'vant'

router.beforeEach((to, from, next) => {

    // 路由守卫，动态设置缓存组件
    if (to.name === 'detail' || to.name === 'selectlink' || to.name === 'tracking' || to.name === 'preview') {
        Store.commit('setCacheList', ['homePage', 'listPage', 'detail', 'selectLink', 'processTracking'])
    } else {
        Store.commit('setCacheList', ['homePage', 'listPage'])
    }
    if (Store.state.userInfo.userCode) {
        next()
    } else {
        Toast.loading({
            duration: 0,
            forbidClick: true,
            loadingType: 'spinner',
        });
        getCurrentUser().then(user => {
            console.log("获取当前用户信息", user);
            api.checkUser({
                 id: user.login_name,//生产 - 新oa测试 - 新oa
                 uCode: ""//生产 - 新oa测试 - 新oa
                // //戴伟
                // id: "009185",
                // uCode: "daiwei"
                //赵建彰
                // id: "008922",//平时测试
                // uCode: "zhaojianzhang"//平时测试
                // id: "055639",
                // uCode: "huoxuewen"
                //李嫣然
                //   id: "009234",
                //   uCode:"liyanran"
                 //孙雪霏
                 //id: "018866",
                 //uCode:"sunxuefeibf"
                //郭建涛
                // id: "005470",//平时测试
                // uCode: "guozhentaocs"//平时测试
                //陈金金
                // id: "025143",
                // uCode: "chenjinjinhz"
                // 赵则灵
                // id: "010586",
                // uCode: "zhaozelingbf"
                // 刘彦雷
                // id: "005622",
                // uCode: "liuyanlei"
                //骆京京
                // id:"004911",
                // uCode:"luojingjingbf"
                //
                // id:"015650",
                // uCode:"chengli1bf"
                // id:"027707",
                // uCode:"cailixuan"
                // id:"024787",
                // uCode:"	wangqianbf"
                // id:"008990",
                // uCode: "tangwenbf"
                // id: "025551",
                // uCode: "yansuqianbf"
                // id: "015650",
                //  uCode: "chengli1bf"
                // id: "046231",
                // id:"007137",
                // uCode:"sunyi1bf",
                // id:"046241",
                // uCode: "yanmingxia"
                // id: "012442",
                // uCode: "liuhao3zgc"
                // id:"015170",
                // uCode:"zhanglei8zgc",
                // id : "009859",
                // uCode:"liyue2zgc"
                // id: "024328",
                // uCode:"duxinxinzgc"
                // id :"059652",
                // uCode:"libingzgc"
                // id:"014621",
                // uCode:"wenhuinazgc"
                // id: "006543",
                // uCode: "mayuezgc"
                // id: "046231",
                // uCode: "yanmingxia"
                // id: "003821",
                // uCode: "panmiaofzx"
                // id: "005539",
                // uCode: "liuhaimeifzx"
                    // id: "017260",
                    // uCode:"houxueyanfzx"
                     //id: "028379",
                 //uCode: "yexiaozhaobf"
                //       id: "004219",
                //  uCode: "caoxiaojingzgc"
                //       id: "009279",
                //  uCode: "chendandanzgc"
                //       id: "001763",
                //  uCode: "wuyihongzgc"
                // id:"004114",
                // uCode :"liangyan"
            }).then(res => {
                console.log("checkUser status", res)
                if (res.data.status === '200') {
                    if (res.data.model.code === -1) {
                        Toast.clear()
                        Dialog.alert({
                            message: res.data.model.msg,
                            width: "300px",
                            confirmButtonColor: "#ff4444",
                        }).then(() => {
                            closeWindow()
                        });
                    } else {
                        Store.commit('setUserInfo', {
                            userCode: res.data.model.data.usercode,
                            userId: res.data.model.data.useruuid,
                            userName: res.data.model.data.username,
                            ou: res.data.model.data.ou
                        })
                        Toast.clear()
                        next()
                    }
                }
            })
        })
    }
})

api.queryKeyValueByTypes().then(res => {
    // 获取枚举数据
    if (res.data.status === '200') {
        Store.commit('setEnumerationData', res.data.model)
        // console.log("queryKeyValueByTypes", res)
    }
}).catch(err => console.log(err))

const dateFormat = (fmt, date) => {
    let ret;
    date = new Date(date)
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt)
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };

    return fmt;
}

Vue.prototype.$format = dateFormat
