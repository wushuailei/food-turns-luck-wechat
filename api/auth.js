import { API_CONFIG } from "./config";

/**
 * 调用微信登录获取 code
 */
function getWxLoginCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (res) => {
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(new Error("获取登录凭证失败"));
                }
            },
            fail: reject,
        });
    });
}

/**
 * 发送登录请求到后端
 * 注意：这里不使用 ../request.js 中的 request，避免循环依赖
 */
function sendLoginRequest(code) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${API_CONFIG.baseUrl}/auth/login`,
            method: "POST",
            data: { code },
            header: { "content-type": "application/json" },
            success: (response) => {
                if (response.statusCode === 200 && response.data.code === 200) {
                    resolve(response.data.data);
                } else {
                    reject(new Error(response.data.message || "登录失败"));
                }
            },
            fail: reject,
        });
    });
}

/**
 * 保存登录信息
 */
function saveLoginInfo(token, user) {
    wx.setStorageSync("token", token);
    wx.setStorageSync("userInfo", user);

    const app = getApp();
    if (app) {
        app.globalData.userInfo = user;
    }
}

/**
 * 执行静默登录
 */
export async function silentLogin() {
    try {
        // 1. 获取微信登录 code
        const code = await getWxLoginCode();

        // 2. 发送到后端换取 token
        const { token, user } = await sendLoginRequest(code);

        // 3. 保存登录信息
        saveLoginInfo(token, user);

        console.log("静默登录成功");
        return token;
    } catch (error) {
        console.error("静默登录失败:", error);
        throw error;
    }
}

/**
 * 跳转到登录页并提示
 */
export function redirectToLogin(message = "需要登录") {
    wx.showToast({
        title: message,
        icon: "none",
        duration: 2000,
    });

    setTimeout(() => {
        wx.reLaunch({
            url: "/pages/login/login",
        });
    }, 2000);
}

/**
 * 确保已登录（没有 token 时自动登录）
 */
export async function ensureLoggedIn() {
    let token = wx.getStorageSync("token");

    if (!token) {
        console.log("未登录，执行静默登录...");
        try {
            token = await silentLogin();
        } catch (error) {
            redirectToLogin("登录失败，请重新登录");
            throw new Error("需要登录");
        }
    }

    return token;
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
