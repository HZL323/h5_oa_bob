/*
 * @Author: your name
 * @Date: 2021-11-02 10:00:52
 * @LastEditTime: 2021-11-02 10:11:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_demo\src\modules\preview_page\route.js
 */
export default {
    path: '/preview',
    name: 'preview',
    component: () => import('./index.vue')
}