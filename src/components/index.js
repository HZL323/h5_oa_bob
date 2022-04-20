/*
 * @Author: your name
 * @Date: 2021-09-17 15:29:14
 * @LastEditTime: 2021-09-17 15:30:39
 * @LastEditors: Please set LastEditors
 * @Description: 注册公共插件
 * @FilePath: \vue_demo\src\components\index.js
 */
import FeedBack from './Feedback.vue'

export default (Vue) => {
    Vue.component('wu-feedback', FeedBack)
}