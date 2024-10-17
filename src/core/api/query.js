/*
 * @Author: your name
 * @Date: 2021-09-08 09:50:51
 * @LastEditTime: 2021-12-10 10:25:29
 * @LastEditors: Joker
 * @Description: 接口API
 * @FilePath: \bjbank-xcoa\src\core\api\query.js
 */
import { ajaxGet, ajaxPost } from '../mxApi'
//const URL = `http://oa.bj.bob` // 生产
const URL = `http://10.51.228.84:8080` // 新oa测试
//const URL = `http://app.xcoa.bj.bob.test` // 新oa/准生产

export function queryMessage(data) {
    //return ajaxGet('/api/v1/users?limit=1') //测试接口
    return ajaxGet('/api/resoftCtrl/OFDController') //测试接口
}

// 校验用户信息
export function checkUser(data) {
    // console.log(`校验用户信息`,URL+`/mob/userDeptService/checkUser`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/userDeptService/checkUser`, data)
}
export function checkUser_v2(data) {
    return ajaxPost(`${URL}/mob/userDeptService/checkUser_v2`, data)
}
export function getJsonWebToken(data) {
    return ajaxPost(`${URL}/mob/userDeptService/getJsonWebToken`, data)
}
// 用户兼职部门列表
export function loadUserDeptList(data) {
    // console.log(`用户兼职部门列表`,URL+`/mob/userDeptService/loadUserDeptList`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/userDeptService/loadUserDeptList`, data)
}
export function loadUserDeptList_v2(data) {
    return ajaxPost(`${URL}/mob/userDeptService/loadUserDeptList_v2`, data)
}
// 查询待办、待阅接口
export function queryList(data) {
    // console.log(`查询待办、待阅接口`,URL+`/mob/taskService/mobDataList`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskService/mobDataList`, data)
}

// 首页已办
export function list(data) {
    // console.log(`查询已办接口`,URL+`/mob/taskService/list`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskService/list`, data)
}

// 获取数据字典
export function queryKeyValueByTypes() {
    // console.log(`获取数据字典`,URL+`/mob/oa/DictServiceContainer/queryKeyValueByTypes`)
    // console.log(`参数`,`DOC_PRIORITY,DOC_SECURITY_LEVEL,FILE_TYPE,is_direct,send_method,PRESERVATION_PERIOD,sys_file_position,HOST_DEP,APPLY_CHANGE_TYPE,DOC_TYPE,ARCHIVE_YEAR,OPEN_STATE,RESPON_PERSON,AUDIO_VISUAL_TYPE,TEXT_SOURCE,PRINT_WAY`)
    return ajaxPost(`${URL}/mob/oa/DictServiceContainer/queryKeyValueByTypes`,
        {
            dictTypes: `DOC_PRIORITY_TEXT,DOC_SECURITY_LEVEL,FILE_TYPE,is_direct,send_method,PRESERVATION_PERIOD,sys_file_position,HOST_DEP,APPLY_CHANGE_TYPE,DOC_TYPE,ARCHIVE_YEAR,OPEN_STATE,RESPON_PERSON,AUDIO_VISUAL_TYPE,TEXT_SOURCE,PRINT_WAY,BUSINESS_TYPE,BusinessDataType,DemandType,IsEffectClient,IsInvolveInfo,IsClientRequire,EstimateResult,DemandScreen,IsSearchSynDept,testResult,confirmResult,IsMustTest,isDataDelete,smsPubType,OPERATOR_DICT,PAYER_NAME,ZHUANXIAN_NAME,IS_NEED_MANAGE_NAME,ACCESSTYPE_DICT,DATA_TYPE_NAME,USE_SCENE_NAME,requestLineName,changeRevokeLineName`
        })
}

// OA详情 表单和意见配置
export function getFromConfig(data) {
    // console.log(`OA详情 表单和意见配置`,URL+`/mob/taskDetailService/getFormConfig`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskDetailService/getFormConfig`, data)
}

// OA详情 表单数据
export function getFormData(data) {
    // console.log(`OA详情 表单数据`,URL+`/mob/taskDetailService/getFormData`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskDetailService/getFormData`, data)
}

// OA详情 意见数据
export function getOpinionData(data) {
    // console.log(`OA详情 意见数据`,URL+`/mob/note/NoteServiceContainer/listNote`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/note/NoteServiceContainer/listNote`, data)
}

// OA详情 可编辑意见
export function getOpinionConfig(data) {
    // console.log(`OA详情 可编辑意见`,URL+`/mob/note/NoteServiceContainer/getMobNoteConfig`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/note/NoteServiceContainer/getMobNoteConfig`, data)
}

// 查询附件列表
export function queryAttachment(data) {
    // console.log(`查询附件列表`,URL+`/mob/attachementService/getAttachements`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/attachementService/getAttachements`, data)
}
// 查询重要证照附件列表
export function queryImportantPhoto(data) {
    // console.log(`查询附件列表`,URL+`/mob/importantPhotoServer/getRelList`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/importantPhotoServer/getRelList`, data)
}

// 附件预览
export function Preview(data) {
    // console.log(`附件预览`,URL+`/mob/bob/PreviewToZt/preview`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/bob/PreviewToZtV6/preview`, data)
}

// 查询未盖章附件是否有对应的已盖章附件
export function getSealAttach(data) {
    // console.log(`查询未盖章附件是否有对应的已盖章附件`,URL+`/mob/attachementService/getAttachRelIds`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/attachementService/getAttachRelIds`, data)
}

// 保存意见
export function saveOpinion(data) {
    // console.log(`保存意见`,URL+`/mob/note/NoteServiceContainer/saveMobNote`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/note/NoteServiceContainer/saveMobNote`, data)
}

// 查询下一环节
export function queryNextLink(data) {
    // console.log(`查询下一环节`,URL+`/mob/wfm/ApplicationServiceContainer/listMobNextActivities`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/listMobNextActivities`, data)
}

// 查询下一环节办理人/办理部门
export function queryHandlerList(data) {
    // console.log(`查询下一环节办理人/办理部门`,URL+`/mob/wfm/ApplicationServiceContainer/listMobActivityResources`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/listMobActivityResources`, data)
}

// 提交
export function completeWorkitem(data) {
    console.log(`提交`,URL+`/mob/wfm/ApplicationServiceContainer/mobCompleteWorkitem`)
    console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/mobCompleteWorkitem`, data)
}
//判断下一环节是否为子流程的接口
export function isSubProcess(data){
    return ajaxPost(`${URL}/mob/activity/ExtendServiceAttribute/getActivityExtendConfigByName`, data)
}
//下一环节为子流程的提交接口——保存主流程和子流程的关联关系
export function subProcessCompleteWorkItem(data){
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/mobMainCommitToSub`,data)
}
// 查询退回节点
export function queryBackLink(data) {
    // console.log(`查询退回节点`,URL+`/mob/wfm/ApplicationServiceContainer/mobListCanSendbackActivities`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/mobListCanSendbackActivities`, data)
}

// 退回
export function sendBack(data) {
    //console.log(`退回`,URL+`/mob/wfm/ApplicationServiceContainer/mobSendbackActivity`)
    //console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/mobSendbackActivity`, data)
}

// 流程跟踪
export function listProcessTracking(data) {
    // console.log(`流程跟踪`,URL+`/mob/oa/WorkflowServiceContainer/listProcessTracking`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/oa/WorkflowServiceContainer/listProcessTracking`, data)
}

// 是否可以直接提交
export function SubmitPermission(data) {
    // console.log(`是否可以直接提交`,URL+`/mob/wfm/ActivityConfigServiceContainer/listActivityExtendAttribute`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/wfm/ActivityConfigServiceContainer/listActivityExtendAttribute`, data)
}

// 结束行领导传阅流程
export function finishCy(data) {
    // console.log(`结束行领导传阅流程`,URL+`/mob/taskService/finishCy`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskService/finishCy`, data)
}

// 更新待办流程状态
export function updateProcessState(data) {
    // console.log(`更新待办流程状态`,URL+`/mob/taskDetailService/updateProcessState`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskDetailService/updateProcessState`, data)
}

// 获取用印文件信息
export function sealDetail(data) {
    // console.log(`获取用印文件信息`,URL+`/mob/taskDetailService/getPrintAttachInfo`)
    // console.log(`参数`,data)
    return ajaxPost(`${URL}/mob/taskDetailService/getPrintAttachInfo`, data)
}
//获取扩展字段的值
export function getActivityExtendConfigByName(data){
    return ajaxPost(`${URL}/mob/activity/ExtendServiceAttribute/getActivityExtendConfigByName`, data);
}
//获取发送部门
export function getSendDept(data){
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/getSendDeptAndSendUserIds`, data);
}
// //保存发送部门和对应人员到支行用印的业务表里面
// export function saveSendDeptAndUsersToFormData(data){
//     return ajaxPost(`${URL}/mob/yyzhi/saveFormDataForOperation`, data);
// }
export function yyzhiModifySendDeptAndUsers(data){
    return ajaxPost(`${URL}/mob/yyzhi/modifySendDeptAndUsers`, data);
}
export function yyfzxzhiModifySendDeptAndUsers(data){
    return ajaxPost(`${URL}/mob/yyfzxzhi/modifySendDeptAndUsers`, data);
}
export function yyfhbmModifySendDeptAndUsers(data){
    return ajaxPost(`${URL}/mob/yyfhbm/modifySendDeptAndUsers`, data);
}
export function addBusinessType(data){
    return ajaxPost(`${URL}/mob/yyfzxzhi/addBusinessType`, data);
}
//获取收藏的意见
export function getCollectedOpinion(data){
    return ajaxPost(`${URL}/mob/note/NoteServiceContainer/getNoteCollection`, data)
}
export function recordEnterOaLog(data){
    return ajaxPost(`${URL}/mob/login/log/mobCreateLoginSuccessLog`, data)
}
export function  getCurrentWorkItemType(data){
    return ajaxPost(`${URL}/mob/note/NoteServiceContainer/getCurrentWorkItemType`, data)
}
export function  isBatchBusinessHandler(data){
    return ajaxPost(`${URL}/mob/publicService/isBatchBusinessHandler`, data)
}
export function  showFwqqList(data){
    return ajaxPost(`${URL}/mob/task/TaskServiceContainer/list`, data)
}
export function  batchCompleteWorkitem(data){
    return ajaxPost(`${URL}/mob/wfm/ApplicationServiceContainer/batchCompleteWorkitem`, data)
}
export function  getSendbackPrivilige(data){
    return ajaxPost(`${URL}/mob/publicService/getSendbackPrivilige`, data)
}
export function getArchiveBorrowList(data){
    return ajaxPost(`${URL}/mob/archiveBorrow/archiveBorrowList`, data)
}
export function validateNoteContent(data){
    return ajaxPost(`${URL}/mob/CustomizeNoteService/validateNoteContent`, data)
}