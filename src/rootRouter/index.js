/*
 * @Author: your name
 * @Date: 2021-09-08 09:50:51
 * @LastEditTime: 2021-11-04 13:10:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_demo\src\rootRouter\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import homePageRouter from '@/modules/home_page/route' // 首页路由
import listPageRouter from '@/modules/list_page/route' // 列表页路由
import fwqqListPageRouter from '@/modules/fwqqList_page/route' // 服务请求页路由
import detailPageRouter from '@/modules/detail_page/route' // 详情页路由
import docDetailPageRouter from '@/modules/docBasis_page/route' // 详情页路由
import processTrackingRouter from '@/modules/process_tracking/route' // 流程跟踪路由
import selectLinkRouter from '@/modules/commit_page/route' // 选择下一环节路由
// import previewRouter from '@/modules/preview_page/route'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'auth',
      redirect: '/home'
    },
    homePageRouter,
    fwqqListPageRouter,
    listPageRouter,
    detailPageRouter,
    processTrackingRouter,
    selectLinkRouter,
    // previewRouter
    docDetailPageRouter,
  ]
})

export default router;
