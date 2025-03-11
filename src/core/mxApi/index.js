import { queryString } from '../utils';
import Store from '../../store/index'
import { api } from "../../core/api/index";
function MXApi(callbacks) {
    var deviceReady = false;
    var taskQueue = [];
    document.addEventListener('deviceready', function deviceReadyHandler() {
        deviceReady = true;
        taskQueue.forEach(function (task) {
            applyApi.apply(null, task);
        })
        callbacks.ready && callbacks.ready();
        document.removeEventListener('deviceready', deviceReadyHandler, false);
    }, false)

    function applyApi(namespace, api, args) {
        if (window[namespace] && window[namespace][api]) {
            callbacks.beforeApply && callbacks.beforeApply(namespace, api, args);
            window[namespace][api].apply(null, args);
        } else if (!deviceReady) {
            taskQueue.push([namespace, api, args]);
        } else {
            callbacks.error && callbacks.error(['该终端没有', namespace, '.', api, '方法!'].join(''), namespace, api);
            throw new Error(['该终端没有', namespace, '.', api, '方法!'].join(''));
        }
    }
    return applyApi;
}

const applyApi = MXApi({
    ready: function () {
        // console.log('device ready!!');
    },
    error: function (err) {
        // console.log(err);
    },
    beforeApply: function (namespace, api, args) {
    }
});

const makeApi = namespace => (api, ...args) => applyApi(namespace, api, args);
const MXCommon = makeApi('MXCommon');
const MXWebui = makeApi('MXWebui');
const MXContacts = makeApi('MXContacts');

export const hideWebViewTitle = () => MXWebui('hideWebViewTitle');
export const showOptionMenu = () => MXWebui('showOptionMenu');
export const closeWindow = () => MXWebui('closeWindow');
export const setCustomHeaderMenu = (...args) => MXWebui('setCustomHeaderMenu', ...args);
export const getCurrentUser = callback => new Promise((resolve, reject) => {
    MXCommon('getCurrentUser', resolve);
});
export const getEncryptString = () => new Promise((resolve, reject) => {
    MXCommon('getEncryptString', resolve);
});
export const openUrlPage = (url) => new Promise((resolve, reject) => {
    MXCommon('openUrlPage', url, resolve(url));
});
export const MXSelectUsers = () => new Promise((resolve, reject) => {
    MXContacts('selectUsers', function (result) {
        resolve(result);
    }, {
        enableSelectDept: false,
        canSelectSelf: true
    });
});
export const openNoPermissionPage = (params) => new Promise((resolve, reject) => {
    MXCommon('openNoPermissionPage', {
        name: params.name,
        phoneNumb: params.phoneNumb || "",
        guidePage: params.guidePage || "",
        onSuccess: () => {
            params.onSuccess && params.onSuccess();
            resolve();
        }
    });
});
export const ajax = params => new Promise((resolve, reject) => {
    const token = Store.state.jwt; // 从 Vuex 中获取 jwt
    params = Object.assign({}, params, {
        url: `${params.url}`,
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        async: true,
        success: function (data, status, xhr) {
            console.log("success:", status);
            resolve({ data: JSON.parse(data), status });
        },
        error: function (data, status, xhr) {
            //Unauthorized
            if (status === "Unauthorized" && !(params.url.indexOf('/mob/userDeptService/getNewAccessToken') > 0)) {
                if (Store.state.refreshToken) {
                    // 尝试使用Refresh Token获取新的Access Token
                    return api.getNewAccessToken({
                        refreshToken: Store.state.refreshToken
                    }).then(res => {
                        if (res.data.model.code === -1) {
                            alert('OA会话过期，请重新进入。');
                            reject({ data, status });
                        } else {
                            console.log("9999", res);
                            Store.commit('setJwt', res.data.model.data);
                            // 重新发起原请求
                            return ajax(params).then(resolve).catch(reject); // 递归调用自身，使用新的token重新发送请求
                        }
                    }).catch(err => {
                        console.log("err", err);
                        // Refresh Token也过期，提示用户重新登录
                        alert('OA会话过期，请重新进入。');
                        reject({ data, status });
                    });
                } else {
                    // 没有Refresh Token，提示用户重新登录
                    alert('OA会话过期，请重新进入。');
                    reject({ data, status });
                }
            } else {
                reject({ data, status });
            }
        }
    });
    MXCommon('ajax', params);
});

export const ajaxGet = (url, query) => {
    url = query ? `${url}?${queryString.stringify(query)}` : url;
    const params = {
        type: 'GET',
        url,
    };
    return ajax(params);
};

export const ajaxPost = (url, data) => {
    return ajax({
        type: 'POST',
        url,
        data,
    });
};

export const ajaxPut = (url, data) => {
    return ajax({
        type: 'PUT',
        url,
        data
    });
};

export const ajaxDelete = (url, id) => {
    return ajax({
        type: 'DELETE',
        url: `${url}/${id}`
    });
};







