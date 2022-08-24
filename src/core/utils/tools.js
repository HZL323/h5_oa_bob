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

    //debugger
    // 路由守卫，动态设置缓存组件
    if (to.name === 'detail' || to.name === 'selectlink' || to.name === 'tracking' || to.name === 'preview') {
        Store.commit('setCacheList', ['homePage', 'listPage', 'detail', 'selectLink', 'processTracking'])
    } else {
        Store.commit('setCacheList', ['homePage', 'listPage'])
    }
    console.log("----路由位置----",Store.state.currentProcess);
    if(to.name === 'detail' && Store.state.currentProcess.workitemName !=undefined  && ( 
    //Store.state.currentProcess.workitemName.indexOf('部室经理会签')!=-1  || 
    Store.state.currentProcess.workitemName==='部室经理会签' || 
    Store.state.currentProcess.workitemName==='部门经理会签' || 
    Store.state.currentProcess.workitemName==='相关业务线办理' || 
    //Store.state.currentProcess.workitemName==='相关人员办理' ||
    Store.state.currentProcess.workitemName==='相关部室办理' || 
    Store.state.currentProcess.workitemName==='辅办部室办理' 
    //Store.state.currentProcess.workitemName==='送相关支行' || 
    //Store.state.currentProcess.workitemName==='收文经办' || 
    // || Store.state.currentProcess.actDefId.indexOf('sub_process')!=-1 
    )) {
        Toast("请前往PC端处理!!")
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
                id: user.login_name,
                uCode: ""
                //Id:""
            }).then(res => {
                if (res.data.status === '200') {
                    if (typeof res.data.model === "string") {
                        Toast.clear()
                        Dialog.alert({
                            message: res.data.model,
                            width: "300px",
                            confirmButtonColor: "#ff4444",
                        }).then(() => {
                            closeWindow()
                        });
                    } else {
                        Store.commit('setUserInfo', {
                            userCode: res.data.model.usercode,
                            userId: res.data.model.useruuid,
                            userName: res.data.model.username,
                            ou: res.data.model.ou
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
        console.log("queryKeyValueByTypes", res)
    }
})

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
