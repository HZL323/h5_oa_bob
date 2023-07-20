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
    if (to.name === 'detail' || to.name === 'selectlink' || to.name === 'tracking' || to.name === 'preview' || to.name === 'fwqqList') {
        Store.commit('setCacheList', ['homePage', 'listPage', 'detail', 'selectLink', 'processTracking', 'fwqqListPage'])
    } else {
        Store.commit('setCacheList', ['homePage', 'listPage','fwqqListPage'])
    }
    if(to.name === 'detail' && to.query.from  !== 'oa' && to.query.queryKind === "doing"){
        Toast("请到OA（新）或用印申请（新）系统查看")
        return
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
                uCode: ""
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
