/*
 * @Author: your name
 * @Date: 2021-09-08 09:50:51
 * @LastEditTime: 2021-12-09 14:01:25
 * @LastEditors: Please set LastEditors
 * @Description: 接口API
 * @FilePath: \vue_demo\src\core\api\query.js
 */
import { ajaxPost } from '../mxApi'

// 校验用户信息
export function checkUser(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    "msg": "",
                    "model": {
                        "ou": "北京银行.总行.办公室",
                        "usercode": "originaladmin",
                        "useruuid": "c8f1ba6c7cf842409aba43206e9f7442",
                        "username": "管理员"
                    },
                    // model: "对不起，您没有访问权限",
                    "wrapModel": true,
                    "status": "200"
                }
            })
        }, 1000)
    })
}

// 查询待办、已办、待阅接口
export function queryList(data) {
    //console.log(data)
    let arr = []
    for (let i = 0; i < 4; i++) {
        arr.push({
            actDefId: "ng",
            actInstId: "4ffe3c69b1a54d9c85d3f51e81ce3361",
            archState: "0",
            bold: false,
            configCode: "huiyijiyao_zhhyjj_process",
            configId: "b5c988ec42c4432c9bec85378d638859",
            createDate: "2021-08-25 11:18:34",
            createTime: "2021-08-25",
            actCreateTime: "2021-08-25",
            createUser: "d9d0c2ea74ec4c7593731c329bd47302",
            deleteFlag: "0",
            draftDate: "2021-08-25 11:20:23",
            draftDept: "310200004",
            draftDeptname: "北京银行",
            drafter: "d9d0c2ea74ec4c7593731c329bd47302",
            drafterName: "刘昱程",
            editFlag: "1",
            invalid: "N",
            isMerge: "0",
            jygNode: false,
            lastModifyTime: "2021-08-25 11:20:23",
            lastModifyUser: "d9d0c2ea74ec4c7593731c329bd47302",
            operStatus: "I",
            priority: "003",
            proDirId: "af2558b99d264fd6a5d52e98e7d454ff" + i,
            proInstId: "9d7befc87dea459aab1b26b5935cacd8" + i,
            proInstIdReal: "9d7befc87dea459aab1b26b5935cacd8",
            processName: "总行会议决议",
            processState: "running",
            pubFormDataId: "b098679a87874ebbbf2248c19004cd56",
            recTime: "2021-08-25 11:18:34",
            resourceId: "d9d0c2ea74ec4c7593731c329bd47302",
            secretLevel: "2",
            state: "open.running",
            title: "关于进一步加强211工程管理的通知" + i,
            tmFlag: "0",
            txFlag: "0",
            type: "normal",
            wordNo: "",
            workitemId: "a7ab00718dd040beac3e91cecaa6835d",
            workitemName: "主办部门负责人审核主办部门负责人审核"
        })
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        curPageData: arr,
                        allDataCount: 4,
                    }
                }
            })
        }, 1000)
    })
}

// 首页已办
export function list(data) {
    //console.log(data)
    return new Promise((resolve, reject) => {
        resolve({
            data: {
                "model": {
                    "allDataCount": 1,
                    "curPageData": [
                        {
                            "actDefId": "bswjglycs",
                            "actInstId": "47990b630b314376a16d6cd7d3c7beba",
                            "allBmldNote": null,
                            "allHldNote": null,
                            "archFileid": null,
                            "archState": null,
                            "attachName": "",
                            "bmdbCollection": "false",
                            "bmfzrNote": null,
                            "bold": false,
                            "actCreateTime": "2021-08-25",
                            "completetime": "2021-10-20 19:56:16",
                            "configCode": "fw_bs_process",
                            "configId": "37497df019f844968f6e964df6ed98b4",
                            "controljyFlag": "",
                            "createDate": "2021-10-20 19:55:32",
                            "createTime": "2021-10-20 19:26:07",
                            "createUser": "5a9854296a1a43e394376407cfeca997",
                            "currentPosition": "北京银行/办公室/办公室->李思",
                            "currentProcessNode": null,
                            "cyCollection": "false",
                            "cyPaperNo": null,
                            "cyState": null,
                            "cyTitle": null,
                            "dealLimit": "无",
                            "deleteFlag": "未发送",
                            "dispatchDate": null,
                            "dispatchUser": null,
                            "docState": "部室发文流程_拟稿部室经理审核[北京银行/办公室/办公室->李思]",
                            "domainId": null,
                            "draftDate": "2021-10-20 19:25:32",
                            "draftDept": "dd212955b1cc499782c98212e0efd625",
                            "draftDeptname": "办公室",
                            "drafter": "5a9854296a1a43e394376407cfeca997",
                            "drafterBelongOrg": null,
                            "drafterName": "李嫣然",
                            "editFlag": "0",
                            "endDate": null,
                            "fileNo": null,
                            "fileType": "gzzd",
                            "fromDate": null,
                            "gqTemplateid": null,
                            "gwTemplateid": null,
                            "internalData": null,
                            "internaldataSpan": null,
                            "invalid": "N",
                            "isMerge": "0",
                            "isNew": "false",
                            "isSend": null,
                            "isSendCy": null,
                            "jygNode": false,
                            "lastModifyTime": "2021-10-20 19:56:11",
                            "lastModifyUser": "a08de0ef1374456ab992642b6ffef952",
                            "messageTitle": "部室发文流程",
                            "nerisCreatetime": null,
                            "operStatus": "U",
                            "orderid": null,
                            "orgcode": null,
                            "orgname": null,
                            "orguuid": null,
                            "paperFileSignState": null,
                            "priority": "",
                            "priorityCode": "003",
                            "proDirId": "24b030c4c8e84ede89f646abbdffad75",
                            "proInstId": "99ea91c1b1fe4dd7955eab6ec625f137",
                            "proInstIdReal": "99ea91c1b1fe4dd7955eab6ec625f137",
                            "processName": "部室发文流程",
                            "processState": "running",
                            "pubFormDataId": "26012336ef4a480c86904d1ed1ca5f6c",
                            "recDate": null,
                            "receiveDept": null,
                            "receiveFileNo": null,
                            "releaseRquire": null,
                            "releaseType": null,
                            "resourceId": "a08de0ef1374456ab992642b6ffef952",
                            "saveFrom": null,
                            "secretLevel": null,
                            "secretLevelCode": null,
                            "secretTime": null,
                            "sendTime": null,
                            "sendUserid": null,
                            "sendUsername": null,
                            "state": "closed.completed",
                            "strDraftDateEnd": null,
                            "strDraftDateStart": null,
                            "strEndDateEnd": null,
                            "strEndDateStart": null,
                            "systemid": null,
                            "title": "总行关于调整个人信贷部设置的通知",
                            "tmDate": null,
                            "tmFlag": "0",
                            "tmUserid": null,
                            "txFlag": null,
                            "type": null,
                            "wordNo": "",
                            "workitemId": "7f620a665d4d449fb640bf6e1cf1d5d1",
                            "workitemName": "拟稿部室经理审核"
                        }
                    ]
                },
                "msg": "",
                "status": "200",
                "wrapModel": true
            }
        })
    })
}

// 查询附件列表
export function queryAttachment() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: [
                        {
                            fileData: [
                                {
                                    attachmentId: "52fa0a51eaee4ce8bcc956148148a5ce",
                                    attachmentName: "正文.doc",
                                    sort: null,
                                    type: "zw"
                                }
                            ],
                            name: "正文",
                            sort: 1,
                            type: "zw"
                        },
                        {
                            fileData: [
                                {
                                    attachmentId: "bb536e3dcfba44189c831e0bf727b7e3",
                                    attachmentName: "公文.doc",
                                    sort: null,
                                    type: "gw"
                                }
                            ],
                            name: "公文",
                            sort: 2,
                            type: "gw"
                        },
                        {
                            fileData: [
                                {
                                    attachmentId: "9a704d228b124bca82f1e78b0b9e3fac",
                                    attachmentName: "2019年度历史库收发文迁移.docx",
                                    sort: "7",
                                    type: "normal"
                                },
                                {
                                    attachmentId: "cd90db208c7b44dc809f171680c4b9ee",
                                    attachmentName: "2019年度历史库收发文迁移.pdf",
                                    sort: "7",
                                    type: "normal"
                                },
                                {
                                    attachmentId: "cd90db208c7b44dc809f171680c4b9ed",
                                    attachmentName: "2021年度分析报告会.pdf",
                                    sort: "7",
                                    type: "normal"
                                },
                                // {
                                //     attachmentId: "ca90db208c7b44dc809f171680c4b9ed",
                                //     attachmentName: "2022年度经营分析报告.pdf",
                                //     sort: "7",
                                //     type: "normal"
                                // },
                                // {
                                //     attachmentId: "ca90db708c7b44dc809f171680c4b9ed",
                                //     attachmentName: "银行收益分析报表总结会.pdf",
                                //     sort: "7",
                                //     type: "normal"
                                // },
                                {
                                    attachmentId: "ca90db708c7b55dc809f171680c4b9ed",
                                    attachmentName: "全国疫情一览分析报表.pdf",
                                    sort: "7",
                                    type: "normal"
                                }
                            ],
                            name: "附件",
                            sort: 7,
                            type: "normal"
                        }
                    ],
                    msg: "",
                    status: "200",
                    wrapModel: true
                }
            })
        }, 1000)
    })
}

// 保存意见
export function saveOpinion(data) {
    return new Promise((resolve, reject) => {
        resolve(
            {
                data: {
                    "msg": "",
                    "model": {
                        "id": "40d9613319be448f90aa064cf97af4e2",
                        "noteContent": "同意。",
                        "status": true
                    },
                    "wrapModel": true,
                    "status": "200"
                }
            }
        )
    })
}

// 查询退回节点
export function queryBackLink(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    "model": [
                        {
                            "actDefId": "hd_process_wp1_act1",
                            "actSetDefId": null,
                            "blockActInstId": null,
                            "completeTime": null,
                            "configId": "e3ee981ae95f4aca90cc0178e664b738",
                            "createTime": "2021-10-14 17:25:49",
                            "description": "",
                            "fromActInstIds": "0",
                            "id": "79ea2fecc08b4881b29625172ef1a0bc",
                            "limitTime": null,
                            "modelId": "29de9a323bca4f068e848dc079ac6c4e",
                            "name": "文件管理员提出申请",
                            "orgId": "",
                            "pkgId": "hnhd_pkg",
                            "pkgVersion": 1,
                            "preActInstIds": "0",
                            "preState": "open.running",
                            "priority": 1,
                            "proDefId": "hnhd_process_wp1",
                            "proDirId": "accc5a28326d4e0cbc4780a4a30a565f",
                            "proInstDesc": "",
                            "proInstId": "84ae6017d4044af39b49d5f3633b0884",
                            "proInstName": "行内活动流程",
                            "resourceIds": "user:c8f1ba6c7cf842409aba43206e9f7442",
                            "state": "closed.completed",
                            "type": "normal",
                            "updateTime": null
                        }
                    ],
                    "msg": "",
                    "status": "200",
                    "wrapModel": true
                }
            })
        }, 1000)
    })
}

// 退回
export function sendBack(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: null,
                    status: "200"
                }
            })
        }, 1000)
    })
}

// 查询下一环节
export function queryNextLink() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        actDefId: "d_process_wp1_act10",
                        configId: "e3ee981ae95f4aca90cc0178e664b738",
                        flag: true,
                        isAllowParallel: "",
                        isSkiped: false,
                        nextActDefIds: [
                            {
                                aSync: false,
                                actDefId: "d_process_wp1_act11",
                                actDefName: "会签",
                                actDefPath: "hnhd_process_wp1,d_process_wp1_act11",
                                actInstId: null,
                                actType: "next",
                                parentProDefId: null,
                                participants: null,
                                proDefId: "hnhd_process_wp1",
                                proDirId: "accc5a28326d4e0cbc4780a4a30a565f",
                                sort: null,
                                transActName: ""
                            },
                            {
                                aSync: false,
                                actDefId: "end",
                                actDefName: "结束",
                                actDefPath: "hnhd_process_wp1,d_process_wp1_act11",
                                actInstId: null,
                                actType: "end",
                                parentProDefId: null,
                                participants: null,
                                proDefId: "hnhd_process_wp1",
                                proDirId: "accc5a28326d4e0cbc4780a4a30a565f",
                                sort: null,
                                transActName: ""
                            }
                        ],
                        proDirId: "accc5a28326d4e0cbc4780a4a30a565f",
                        skipReason: {},
                        wfmData: {
                            isShowCompleteDialog: true
                        }
                    },
                    msg: "",
                    status: "200",
                    wrapModel: true
                }
            })
        }, 1000)
    })
}

// 查询下一环节办理人/办理部门
export function queryHandlerList(data) {
    //console.log("查询下一环节办理人/办理部门", data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        isShowMultipleDepts: "false",
                        isShowReplace: false,
                        isShowReturnSelect: false,
                        resourceIds: [
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e0",
                                orgDeptName: "行领导",
                                orgId: "629f92c72cbc4c42afde90df4eadfeb1",
                                orgName: "胡行长",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e1",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1ababe",
                                orgName: "陶晶晶",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e2",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab1",
                                orgName: "张燕",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e3",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab2",
                                orgName: "王琪",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e4",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab9",
                                orgName: "刘枫",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e5",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab3",
                                orgName: "华雄",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e6",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab4",
                                orgName: "展飞",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e7",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab5",
                                orgName: "悟空",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e8",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab6",
                                orgName: "李丽",
                                orgType: "user",
                                orgTypeName: "用户"
                            },
                            {
                                orgDeptId: "39ba5041942c416691e9f2853d3781e9",
                                orgDeptName: "行领导",
                                orgId: "42fdecdad61f42f181fef3b31b1abab7",
                                orgName: "琼江",
                                orgType: "user",
                                orgTypeName: "用户"
                            }
                        ],
                        returnSelect: "false",
                        selectPersonType: "checkbox"
                    },
                    msg: "",
                    status: "200",
                    wrapModel: true
                }
            })
        }, 1000)
    })
}

// 提交
export function completeWorkitem(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: null,
                    status: "200"
                }
            })
        }, 1000)
    })
}

// 获取数据字典
export function queryKeyValueByTypes() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                {
                    data: {
                        model: {
                            DOC_PRIORITY: {
                                '001': {
                                    dictCode: "001",
                                    sortNum: 30,
                                    subDictMap: {},
                                    value: "一般"
                                },
                                '002': {
                                    dictCode: "002",
                                    sortNum: 60,
                                    subDictMap: {},
                                    value: "加急"
                                },
                                '003': {
                                    dictCode: "003",
                                    sortNum: 80,
                                    subDictMap: {},
                                    value: "特急"
                                }
                            },
                            DOC_SECURITY_LEVEL: {
                                '001': {
                                    dictCode: "001",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "商密A级"
                                },
                                '002': {
                                    dictCode: "002",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "商密B级"
                                },
                                '003': {
                                    dictCode: "003",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "商密C级"
                                },
                                '004': {
                                    dictCode: "004",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "秘密"
                                },
                                '005': {
                                    dictCode: "005",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "机密"
                                },
                                '006': {
                                    dictCode: "006",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "绝密"
                                },
                                '007': {
                                    dictCode: "007",
                                    sortNum: null,
                                    subDictMap: {},
                                    value: "内部"
                                }
                            },
                            FILE_TYPE: {
                                gwgg: {
                                    dictCode: "gwgg",
                                    sortNum: 3,
                                    subDictMap: {},
                                    value: "公文公告"
                                },
                                gzzd: {
                                    dictCode: "gzzd",
                                    sortNum: 1,
                                    subDictMap: {},
                                    value: "规章制度"
                                },
                                rcwj: {
                                    dictCode: "rcwj",
                                    sortNum: 4,
                                    subDictMap: {},
                                    value: "日常文件"
                                },
                                txwj: {
                                    dictCode: "txwj",
                                    sortNum: 2,
                                    subDictMap: {},
                                    value: "体系文件(规章制度)"
                                }
                            },
                            PRESERVATION_PERIOD: {
                                '10': {
                                    dictCode: "10",
                                    sortNum: 1,
                                    subDictMap: {},
                                    value: "定期10年"
                                },
                                '30': {
                                    dictCode: "30",
                                    sortNum: 2,
                                    subDictMap: {},
                                    value: "定期30年"
                                },
                                BLJ: {
                                    dictCode: "BLJ",
                                    sortNum: 4,
                                    subDictMap: {},
                                    value: "不立卷"
                                },
                                YJ: {
                                    dictCode: "YJ",
                                    sortNum: 3,
                                    subDictMap: {},
                                    value: "永久"
                                }
                            },
                            is_direct: {
                                fou: {
                                    dictCode: "fou",
                                    sortNum: 1,
                                    subDictMap: {},
                                    value: "否"
                                },
                                zfg: {
                                    dictCode: "zfg",
                                    sortNum: 2,
                                    subDictMap: {},
                                    value: "是"
                                }
                            },
                            send_method: {
                                BGSJH: {
                                    dictCode: "BGSJH",
                                    sortNum: 2,
                                    subDictMap: {},
                                    value: "办公室交换"
                                },
                                NBFS: {
                                    dictCode: "NBFS",
                                    sortNum: 1,
                                    subDictMap: {},
                                    value: "OA系统内部发送"
                                },
                                ZIS: {
                                    dictCode: "ZIS",
                                    sortNum: 3,
                                    subDictMap: {},
                                    value: "自送"
                                }
                            },
                            sys_file_position: {
                                DTJL: {
                                    dictCode: "DTJL",
                                    sortNum: 4,
                                    subDictMap: {},
                                    value: "大堂经理"
                                },
                                GRKHJL: {
                                    dictCode: "GRKHJL",
                                    sortNum: 9,
                                    subDictMap: {},
                                    value: "个人客户经理"
                                },
                                GRYWNQ: {
                                    dictCode: "GRYWNQ",
                                    sortNum: 10,
                                    subDictMap: {},
                                    value: "个人业务内勤"
                                },
                                GSKHJL: {
                                    dictCode: "GSKHJL",
                                    sortNum: 19,
                                    subDictMap: {},
                                    value: "公司客户经理"
                                },
                                GSYWNQ: {
                                    dictCode: "GSYWNQ",
                                    sortNum: 20,
                                    subDictMap: {},
                                    value: "公司业务内勤"
                                },
                                HTZHY: {
                                    dictCode: "HTZHY",
                                    sortNum: 7,
                                    subDictMap: {},
                                    value: "后台综合员"
                                },
                                QSFHY: {
                                    dictCode: "QSFHY",
                                    sortNum: 6,
                                    subDictMap: {},
                                    value: "清算复核员"
                                },
                                QSJBY: {
                                    dictCode: "QSJBY",
                                    sortNum: 5,
                                    subDictMap: {},
                                    value: "清算经办员"
                                },
                                SZJDY: {
                                    dictCode: "SZJDY",
                                    sortNum: 15,
                                    subDictMap: {},
                                    value: "事中监督员"
                                },
                                XJYWY: {
                                    dictCode: "XJYWY",
                                    sortNum: 8,
                                    subDictMap: {},
                                    value: "现金业务员"
                                },
                                ZHBGSZR: {
                                    dictCode: "ZHBGSZR",
                                    sortNum: 16,
                                    subDictMap: {},
                                    value: "支行办公室主任"
                                },
                                ZHFHZ: {
                                    dictCode: "ZHFHZ",
                                    sortNum: 3,
                                    subDictMap: {},
                                    value: "支行副行长"
                                },
                                ZHGRYWBJL: {
                                    dictCode: "ZHGRYWBJL",
                                    sortNum: 21,
                                    subDictMap: {},
                                    value: "支行个人业务部经理"
                                },
                                ZHGSYWBJL: {
                                    dictCode: "ZHGSYWBJL",
                                    sortNum: 18,
                                    subDictMap: {},
                                    value: "支行公司业务部经理"
                                },
                                ZHGY: {
                                    dictCode: "ZHGY",
                                    sortNum: 14,
                                    subDictMap: {},
                                    value: "综合柜员"
                                },
                                ZHHZ: {
                                    dictCode: "ZHHZ",
                                    sortNum: 2,
                                    subDictMap: {},
                                    value: "支行行长"
                                },
                                ZHHZZL: {
                                    dictCode: "ZHHZZL",
                                    sortNum: 11,
                                    subDictMap: {},
                                    value: "支行行长助理"
                                },
                                ZHYYSZR: {
                                    dictCode: "ZHYYSZR",
                                    sortNum: 12,
                                    subDictMap: {},
                                    value: "支行营业室主任"
                                },
                                ZHZHY: {
                                    dictCode: "ZHZHY",
                                    sortNum: 17,
                                    subDictMap: {},
                                    value: "支行综合员"
                                },
                                ZLJCY: {
                                    dictCode: "ZLJCY",
                                    sortNum: 13,
                                    subDictMap: {},
                                    value: "质量检查员"
                                },
                                ZW: {
                                    dictCode: "ZW",
                                    sortNum: 1,
                                    subDictMap: {},
                                    value: "暂无"
                                }
                            },
                            "APPLY_CHANGE_TYPE": {
                                "cbbm": {
                                    "dictCode": "cbbm",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "撤并部门"
                                },
                                "zsbm": {
                                    "dictCode": "zsbm",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "增设部门"
                                }
                            },
                            "ARCHIVE_YEAR": {
                                "2017": {
                                    "dictCode": "2017",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2017"
                                },
                                "2018": {
                                    "dictCode": "2018",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2018"
                                },
                                "2019": {
                                    "dictCode": "2019",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2019"
                                },
                                "2020": {
                                    "dictCode": "2020",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2020"
                                },
                                "2021": {
                                    "dictCode": "2021",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2021"
                                },
                                "2022": {
                                    "dictCode": "2022",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2022"
                                },
                                "2023": {
                                    "dictCode": "2023",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "2023"
                                }
                            },
                            "AUDIO_VISUAL_TYPE": {
                                "jp": {
                                    "dictCode": "jp",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "胶片"
                                },
                                "sm": {
                                    "dictCode": "sm",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "数码"
                                }
                            },
                            "DOC_TYPE": {
                                "0": {
                                    "dictCode": "0",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "拟采用"
                                },
                                "1": {
                                    "dictCode": "1",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "不采用"
                                }
                            },
                            "HOST_DEP": {
                                "bgs": {
                                    "dictCode": "bgs",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "办公室"
                                },
                                "bjhtclzx": {
                                    "dictCode": "bjhtclzx",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "北京后台处理中心"
                                },
                                "bwb": {
                                    "dictCode": "bwb",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "保卫部"
                                },
                                "dqgzb": {
                                    "dictCode": "dqgzb",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "党群工作部"
                                }
                            },
                            "OPEN_STATE": {
                                "close": {
                                    "dictCode": "close",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "不开放"
                                },
                                "open": {
                                    "dictCode": "open",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "开放"
                                }
                            },
                            "RESPON_PERSON": {
                                "bjyhshfh": {
                                    "dictCode": "bjyhshfh",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "北京银行上海分行"
                                },
                                "bjyhszfh": {
                                    "dictCode": "bjyhszfh",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "北京银行深圳分行"
                                },
                                "bjyhtjfh": {
                                    "dictCode": "bjyhtjfh",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "北京银行天津分行"
                                },
                                "bjyhxafh": {
                                    "dictCode": "bjyhxafh",
                                    "sortNum": null,
                                    "subDictMap": {
                                    },
                                    "value": "北京银行西安分行"
                                }
                            }
                        },
                        msg: "",
                        status: "200",
                        wrapModel: true
                    }
                }
            )
        }, 1000)
    })
}

// 用户兼职部门列表
export function loadUserDeptList(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                {
                    data: {
                        msg: "",
                        model: [
                            {
                                ou: "北京分行/零售业务部/财富管理与私人银行部",
                                usercode: "314028",
                                useruuid: "f2cbe272a4044b18b08fa6d8df61c690",
                                username: "邵栋伟"
                            },
                            {
                                ou: "上海银行/宁波分行/行长室",
                                usercode: "314028_jz01",
                                useruuid: "a3d8d6f3a4dd4c6585b93ca3c4263533",
                                username: "邵栋伟"
                            },
                        ],
                        wrapModel: true,
                        status: "200"
                    }
                }
            )
        }, 1000)
    })
}

// OA详情 表单和意见配置
export function getFromConfig(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        formId: "d715f3b862174c94b2096775f9f9ffad",
                        formMetaList: [
                            {
                                colCode: "fileTypeText",
                                colName: "文件类型",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "15706241be984e0697990cdb59d17149",
                                name: null,
                                sort: 1,
                                visiable: "Y"
                            },
                            {
                                colCode: "isDirectText",
                                colName: "是否直发文",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "7152ea89d3004c23bea6f74d1717525a",
                                name: null,
                                sort: 2,
                                visiable: "Y"
                            },
                            {
                                colCode: "sendMethodText",
                                colName: "报送方式",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "5ae1db7c88eb435eaddc43cc8c9fa39c",
                                name: null,
                                sort: 3,
                                visiable: "Y"
                            },
                            {
                                colCode: "drafterName",
                                colName: "拟稿人",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "9c89b3801b90445a97dd6a919c505bbf",
                                name: null,
                                sort: 4,
                                visiable: "Y"
                            },
                            {
                                colCode: "draftDate",
                                colName: "拟稿时间",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "9871bf419f9442dfb7d24bfc21f05df4",
                                name: null,
                                sort: 5,
                                visiable: "Y"
                            },
                            {
                                colCode: "telephone",
                                colName: "联系电话",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "5471e705c5944365bf4ae5e398754965",
                                name: null,
                                sort: 6,
                                visiable: "Y"
                            },
                            {
                                colCode: "draftDeptname",
                                colName: "拟稿部室",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "e2ca00623fdb490fac32e082369f771e",
                                name: null,
                                sort: 7,
                                visiable: "Y"
                            },
                            {
                                colCode: "wordNo",
                                colName: "发文编号",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "68a5deade66a4a279941ec63483bec7c",
                                name: null,
                                sort: 8,
                                visiable: "Y"
                            },
                            {
                                colCode: "priorityText",
                                colName: "公文缓急",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "407fd7b42d084276b3d2ee6ffc2d082f",
                                name: null,
                                sort: 9,
                                visiable: "Y"
                            },
                            {
                                colCode: "printNum",
                                colName: "打印份数",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "91c495a0476c4df7a07ea37cb4dd0ee6",
                                name: null,
                                sort: 10,
                                visiable: "Y"
                            },
                            {
                                colCode: "preservationPeriodText",
                                colName: "保管期限",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "bf528308ec594288917aff3e2c536155",
                                name: null,
                                sort: 11,
                                visiable: "Y"
                            },
                            {
                                colCode: "docNum",
                                colName: "文档页数",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "db3e699c8b5a49ff92b752e7b0c2a1ca",
                                name: null,
                                sort: 12,
                                visiable: "Y"
                            },
                            {
                                colCode: "title",
                                colName: "标题",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "853b18d7cc1d48818febb1384e75a56a",
                                name: null,
                                sort: 13,
                                visiable: "Y"
                            },
                            {
                                colCode: "mainSendDept",
                                colName: "主送单位",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "87e0af7a4d83421d9d0671d147c14dc9",
                                name: null,
                                sort: 14,
                                visiable: "Y"
                            },
                            {
                                colCode: "copySendDept",
                                colName: "抄送单位",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "c1ac6646a3d84305a6abc8b7732c75dd",
                                name: null,
                                sort: 15,
                                visiable: "Y"
                            },
                            {
                                colCode: "documentBasis",
                                colName: "办文依据",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "3508a0e699164d39ada9865933a2dac6",
                                name: null,
                                sort: 16,
                                visiable: "Y"
                            },
                            {
                                colCode: "sysFilePositionText",
                                colName: "体系文件适用岗位",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "0a44d0862a254707bebf7c023550499b",
                                name: null,
                                sort: 17,
                                visiable: "Y"
                            },
                            {
                                colCode: "remark",
                                colName: "备注",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "0491b177d95e472ebc333c39c7d8c279",
                                name: null,
                                sort: 18,
                                visiable: "Y"
                            },
                            {
                                colCode: "distributedUnit",
                                colName: "已分发单位",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "77c9dbbaa9554510bcfd0a7acd7addaf",
                                name: null,
                                sort: 19,
                                visiable: "Y"
                            },
                            {
                                colCode: "publishedUnit",
                                colName: "已发布单位",
                                formId: "d715f3b862174c94b2096775f9f9ffad",
                                formName: "oa_form_fwzh",
                                id: "611429852a804a0096153715965a090c",
                                name: null,
                                sort: 20,
                                visiable: "Y"
                            }
                        ],
                        noteMetaList: [
                            {
                                noteCode: "zbbsnhqyj",
                                noteName: "主办部室内会签意见",
                                sort: 0
                            },
                            {
                                noteCode: "zbbsjlshyj",
                                noteName: "主办部室经理审核意见",
                                sort: 0
                            },
                            {
                                noteCode: "zbzhsjlshyj",
                                noteName: "总部综合室经理审核意见",
                                sort: 0
                            },
                            {
                                noteCode: "txwjshyj",
                                noteName: "体系文件审核意见",
                                sort: 0
                            },
                            {
                                noteCode: "bgswscsyj",
                                noteName: "办公室文书初审意见",
                                sort: 0
                            },
                            {
                                noteCode: "bgszrshyj",
                                noteName: "办公室主任审核意见",
                                sort: 0
                            },
                            {
                                noteCode: "ngrjdyj",
                                noteName: "拟稿人校对意见",
                                sort: 0
                            },
                            {
                                noteCode: "bgsjdyj",
                                noteName: "办公室校对意见",
                                sort: 0
                            },
                            {
                                noteCode: "qtbshqyj",
                                noteName: "其他部室会签意见",
                                sort: 0
                            },
                            {
                                noteCode: "hldqfyj",
                                noteName: "行领导签发意见",
                                sort: 0
                            }
                        ]
                    },
                    msg: "",
                    status: "200",
                    wrapModel: true
                }
            })
        }, 1000)
    })
}

// OA详情 表单数据
export function getFormData(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    msg: "",
                    model: {
                        dataForm: {
                            attachName: "",
                            configCode: "fw_zh_process",
                            controljyFlag: "",
                            copySendDept: "天津分行",
                            createTime: "2021-07-06 18:16:05",
                            createUser: "c8f1ba6c7cf842409aba43206e9f7442",
                            distributedUnit: "",
                            docNum: null,
                            documentBasis: "收文测试流程tjn1",
                            draftDate: "2021-07-06 18:14:15",
                            draftDept: "775c477e6c0945d99b7083036a686949",
                            draftDeptCode: "001",
                            draftDeptname: "北京银行",
                            drafter: "c8f1ba6c7cf842409aba43206e9f7442",
                            drafterName: "管理员",
                            draftNtkoFlag: "Y",
                            endDate: null,
                            fileType: "gzzd",
                            id: "2228a925744f4d39949c7f574696cb08",
                            isDirect: "fou",
                            mainSendDept: "大理寺审夺",
                            preservationPeriod: "",
                            printNum: null,
                            priority: "002",
                            priorityRemark: "",
                            proInstId: "7c9d64514b294c47afa5478b8ab8be09",
                            publishedUnit: "",
                            secretLevel: null,
                            sendUserIds: "user:123456789",
                            sendMethod: "BGSJH",
                            sysFilePosition: '[{"dictCode":"GRYWNQ","value":"个人业务内勤"},{"dictCode":"GSKHJL","value":"公司客户经理"}]',
                            telephone: "17640214817",
                            title: "测试总行发文流程要点",
                            wordNo: "",
                            remark: "",
                            //remark:"文件名称：123（未盖章）.pdf\n用印事项：正式环境中，哪有那么多事情呢\n 用印枚数：4\n打印份数：2\n用印类型及页码：董事长手签:骑缝章;北京银行:骑缝章\n发往单位：大理寺审夺"
                        },
                        processTitle: "乱七八糟流程"
                    },
                    wrapModel: true,
                    status: "200"
                }
            })
        }, 1000)
    })
}

// OA详情 意见数据
export function getOpinionData(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    msg: "",
                    model: [
                        {
                            actDefId: "ng",
                            createDeptId: "310200001",
                            createDeptName: "办公室",
                            createDirectId: "310100003",
                            createDirectName: "总行",
                            createTime: "2021-04-01 00:00:00",
                            createUser: "df130c321e6f4196bdb338c17eb98b18",
                            createUserName: "邵栋伟",
                            formId: null,
                            id: "9e1afc4df900456f8f89fc24b95c93da",
                            isSubmit: "Y",
                            isSubmitAfter: "N",
                            noteContent: "圈阅。",
                            noteName: null,
                            proInstId: null,
                            type: "dbjl",
                            workItemId: null
                        },
                        {
                            actDefId: "ng",
                            createDeptId: "310200001",
                            createDeptName: "办公室",
                            createDirectId: "310100003",
                            createDirectName: "总行",
                            createTime: "2021-04-01 00:00:00",
                            createUser: "df130c321e6f4196bdb338c17eb98b18",
                            createUserName: "邵栋伟",
                            formId: null,
                            id: "9e1afc4df900456f8f89fc24b95c93da",
                            isSubmit: "Y",
                            isSubmitAfter: "N",
                            noteContent: "圈阅。",
                            noteName: null,
                            proInstId: null,
                            type: "dbjl",
                            workItemId: null
                        },
                        {
                            actDefId: "ng",
                            createDeptId: "310200001",
                            createDeptName: "办公室",
                            createDirectId: "310100003",
                            createDirectName: "总行",
                            createTime: "2021-04-01 00:00:00",
                            createUser: "df130c321e6f4196bdb338c17eb98b18",
                            createUserName: "邵栋伟",
                            formId: null,
                            id: "58358ca7f33e47cebfe37965ccbd167a",
                            isSubmit: "Y",
                            isSubmitAfter: "N",
                            noteContent: "已阅。",
                            noteName: null,
                            proInstId: null,
                            type: "bz",
                            workItemId: null
                        }
                    ],
                    wrapModel: true,
                    status: "200"
                }
            })
        }, 1000)
    })
}

// OA详情 可编辑意见
export function getOpinionConfig(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    success: true,
                    msg: "",
                    model: {
                        noteEdit: "zbzhsjlshyj"
                    },
                    wrapModel: true,
                    status: "200"
                }
            })
        }, 1000)
    })
}

// 流程追踪
export function listProcessTracking(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        allDataCount: 2,
                        curPageData: [
                            {
                                acceptTime: "2021-07-13 17:02:48",
                                actDefId: "bsng",
                                actInstId: "48347a36fb87486e9c1ad48fdd69ff40",
                                completeTime: "2021-07-13 17:02:50",
                                configId: null,
                                createTime: "2021-07-13 17:02:45",
                                creatorName: "管理员",
                                deptCode: "001",
                                deptName: "北京银行",
                                deptOu: "北京银行股份有限公司.北京银行",
                                deptUuid: "775c477e6c0945d99b7083036a686949",
                                description: "",
                                fullDeptCode: "root.001",
                                fullDeptId: "de4457db545b461bb359d3179adf50b4.775c477e6c0945d99b7083036a686949",
                                fullDeptName: "北京银行股份有限公司.北京银行",
                                id: "49ff735213eb413cb7d589006bac507b",
                                limitTime: null,
                                modelId: "ee6ed72092ee4c8dac08374aed591324",
                                name: "部室拟稿",
                                normalSignType: null,
                                normalSignWorkItemId: null,
                                oldResourceIds: null,
                                orgId: null,
                                orgType: "user",
                                originalSignWorkItemId: null,
                                pkgId: "fw_zh_pkg",
                                pkgVersion: 9,
                                preState: "open.running",
                                priority: 1,
                                proDefId: "fw_zh_process",
                                proDirId: null,
                                proInstDesc: "",
                                proInstId: "d4ba259f2917480085f64d17f0963cae",
                                proInstName: "总行发文流程",
                                resourceId: "c8f1ba6c7cf842409aba43206e9f7442",
                                state: "closed.completed",
                                type: "normal",
                                updateTime: "2021-07-13 17:02:50",
                                userName: "管理员"
                            },
                            {
                                acceptTime: "2021-07-13 17:49:42",
                                actDefId: "fw_zh_process_act1",
                                actInstId: "193ab3b5583f4474a4129fa8ccfca837",
                                completeTime: null,
                                configId: null,
                                createTime: "2021-07-13 17:02:51",
                                creatorName: "管理员",
                                deptCode: "001",
                                deptName: "北京银行",
                                deptOu: "北京银行股份有限公司.北京银行",
                                deptUuid: "775c477e6c0945d99b7083036a686949",
                                description: "",
                                fullDeptCode: "root.001",
                                fullDeptId: "de4457db545b461bb359d3179adf50b4.775c477e6c0945d99b7083036a686949",
                                fullDeptName: "北京银行股份有限公司.北京银行",
                                id: "713acce8810f4796877c44edd375b2e7",
                                limitTime: null,
                                modelId: "ee6ed72092ee4c8dac08374aed591324",
                                name: "收文转发文拟稿",
                                normalSignType: null,
                                normalSignWorkItemId: null,
                                oldResourceIds: null,
                                orgId: null,
                                orgType: "user",
                                originalSignWorkItemId: null,
                                pkgId: "fw_zh_pkg",
                                pkgVersion: 9,
                                preState: "open.not_running.not_started",
                                priority: 1,
                                proDefId: "fw_zh_process",
                                proDirId: null,
                                proInstDesc: "",
                                proInstId: "d4ba259f2917480085f64d17f0963cae",
                                proInstName: "总行发文流程",
                                resourceId: "c8f1ba6c7cf842409aba43206e9f7442",
                                state: "open.running",
                                type: "goto",
                                updateTime: "2021-07-13 17:49:42",
                                userName: "管理员"
                            }
                        ]
                    },
                    msg: "",
                    status: "200",
                    wrapModel: true
                }
            })
        }, 1000)
    })
}

// 附件预览
export function Preview(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        url: "https://www.gjtool.cn/pdfh5/git.pdf"
                    },
                    status: "200"
                }
            })
        }, 1000)
    })
}

// 更新流程接收状态
export function updateProcessState(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    "model": true,
                    "msg": "",
                    "status": "200",
                    "wrapModel": true
                }
            })
        }, 1000)
    })
}

// 用印申请单
export function sealDetail() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    "model": [{
                        '文件名称': "类型.pdf",
                        '用印事项': "章类",
                        '用印类型及页码': '北京银行股份有限公司：3,5,6',
                        '用印枚数': '3',
                        '打印份数': '2',
                        '发往单位': '北京银行'
                    }, {
                        '文件名称': "就实际用途进行分析.pdf",
                        '用印事项': "因事关重大，特此慎重批复，今研究决定，可以进行试点推广",
                        '用印类型及页码': '北京银行上海分行：3,5,6',
                        '用印枚数': '12',
                        '打印份数': '11',
                        '发往单位': '北京银行'
                    }
                    ],
                    "msg": "",
                    "status": "200",
                    "wrapModel": true
                }
            })
        }, 1000)
    })
}

// 是否可以直接提交
export function SubmitPermission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    "model": [

                    ],
                    "msg": "",
                    "status": "200",
                    "wrapModel": true
                }
            })
        })
    })
}

// 发送部门权限
export function getActivityExtendConfigByName(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        senddeptverify: 1,
                    },
                    status: '200',
                }
            })
        }, 1000)
    })
}

// 获取可发送部门
export function getSendDept(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        '部门1': '人员',
                        '部门2': '',
                        '部门3': '人员',
                        '部门4': '人员',
                    },
                    status: '200'
                }
            })
        }, 1000)
    })
}
// 获取可发送部门
export function getCollectedOpinion(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    model: {
                        noteList: [
                            {
                                note: '批准1'
                            },
                            {
                                note: "批准2"
                            }
                        ]
                    },
                    status: '200'
                }
            })
        }, 1000)
    })
}

// isSubProcess

export function isSubProcess(data) {
    return new Promise((resolve, reject) => {
        resolve({
            data: {
                model: {
                    subProcess: false
                },
                status: '200'
            }
        })
    })
}

export function recordEnterOaLog(data) {
    return new Promise((resolve, reject) => {
        resolve({
            data: {
                model: {
                    code: 0
                },
                status: '200'
            }
        })
    })
}

export function isBatchBusinessHandler(data) {
    return new Promise((resolve, reject) => {
        resolve({
            data: {
                model: {
                    code: 0
                },
                status: '200'
            }
        })
    })
}

export function getCurrentWorkItemType(data) {
    return new Promise((resolve, reject) => {
        resolve({
            data: {
                model: {
                    code: 0
                },
                status: '200'
            }
        })
    })
}