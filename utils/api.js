// API 配置
export const API_CONFIG = {
    // 请根据实际情况修改 API 基础地址
    baseUrl: "http://127.0.0.1:8787",
    timeout: 10000,
};

/**
 * 发起 API 请求
 */
export function request(options) {
    const { url, method = "POST", data, header = {}, needAuth = false } = options;

    return new Promise((resolve, reject) => {
        // 构建请求头
        const requestHeader = {
            "content-type": "application/json",
            ...header,
        };

        // 如果需要认证，添加 token
        if (needAuth) {
            const token = wx.getStorageSync("token");
            if (token) {
                requestHeader["Authorization"] = `Bearer ${token}`;
            }
        }

        wx.request({
            url: `${API_CONFIG.baseUrl}${url}`,
            method,
            data,
            header: requestHeader,
            timeout: API_CONFIG.timeout,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(new Error(`请求失败: ${res.statusCode}`));
                }
            },
            fail: (err) => {
                reject(err);
            },
        });
    });
}

/**
 * 显示 Toast 提示
 */
export function showToast(options) {
    const { title, icon = "none", duration = 2000 } = options;
    wx.showToast({
        title,
        icon,
        duration,
    });
}

/**
 * 显示加载中
 */
export function showLoading(title = "加载中...") {
    wx.showLoading({
        title,
        mask: true,
    });
}

/**
 * 隐藏加载中
 */
export function hideLoading() {
    wx.hideLoading();
}

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
    const token = wx.getStorageSync("token");
    return !!token;
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
    return wx.getStorageSync("userInfo");
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    wx.removeStorageSync("token");
    wx.removeStorageSync("userInfo");
}
