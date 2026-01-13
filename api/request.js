import { API_CONFIG } from "./config";
import { silentLogin, redirectToLogin } from "./auth";

// 显示 Toast 提示
export function showToast(options) {
    const { title, icon = "none", duration = 2000 } = options;
    wx.showToast({ title, icon, duration });
}

// 显示加载中
export function showLoading(title = "加载中...") {
    wx.showLoading({ title, mask: true });
}

// 隐藏加载中
export function hideLoading() {
    wx.hideLoading();
}

/**
 * 执行 HTTP 请求
 */
function executeRequest(url, method, data, header) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${API_CONFIG.baseUrl}${url}`,
            method,
            data,
            header,
            timeout: API_CONFIG.timeout,
            success: (res) => resolve(res),
            fail: reject,
        });
    });
}

/**
 * 处理 401 错误（token 过期）
 */
async function handle401Error(options) {
    console.log("Token 过期，尝试重新登录...");

    try {
        await silentLogin();
        // 重新登录成功，重试原请求
        return await request(options);
    } catch (error) {
        redirectToLogin("登录已过期，请重新登录");
        throw new Error("登录已过期");
    }
}

/**
 * 发起 API 请求
 */
export async function request(options) {
    const { url, method = "POST", data, header = {}, needAuth = false } = options;

    // 如果需要认证，先确保已登录
    // 注意：如果是登录请求本身，或者是静默登录中调用的请求，这里会有循环引用问题
    // 所以 auth.js 中的登录相关请求不应该设 needAuth=true，或者特殊处理

    // 由于 auth.js 依赖 request.js，而 request.js 又通过 handle401Error 间接依赖 auth.js (silentLogin)
    // 为了解决循环依赖，ensureLoggedIn 的逻辑我们不放在这里直接调用，
    // 而是假设调用方（各个业务 API）在需要时会处理，或者我们简单地检查 token 存在性

    // 构建请求头
    const requestHeader = {
        "content-type": "application/json",
        ...header,
    };

    // 添加 token
    if (needAuth) {
        const token = wx.getStorageSync("token");
        if (token) {
            requestHeader["Authorization"] = `Bearer ${token}`;
        } else {
            // 如果需要认证但没有 token，尝试静默登录
            try {
                console.log("无 Token，尝试静默登录...");
                await silentLogin();
                const newToken = wx.getStorageSync("token");
                if (newToken) {
                    requestHeader["Authorization"] = `Bearer ${newToken}`;
                } else {
                    throw new Error("静默登录失败");
                }
            } catch (e) {
                // 登录失败，继续请求可能会报 401，或者直接抛出
                console.warn("自动登录失败:", e);
            }
        }
    }

    // 发起请求
    try {
        const res = await executeRequest(url, method, data, requestHeader);

        // 处理响应
        if (res.statusCode === 401 && needAuth) {
            // Token 过期，重新登录并重试
            return await handle401Error(options);
        }

        if (res.statusCode === 200) {
            return res.data;
        }

        throw new Error(`请求失败: ${res.statusCode}`);
    } catch (error) {
        throw error;
    }
}
