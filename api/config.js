// API 配置
export const API_CONFIG = {
    // 请根据实际情况修改 API 基础地址
    baseUrl: "http://127.0.0.1:8787",
    timeout: 10000,
};

/**
 * 获取图片 URL
 * @param {string} imageKey - 图片 key (如 images/user_123/1705000000-random.jpg)
 * @returns {string} 完整的图片 URL
 */
export function getImageUrl(imageKey) {
    if (!imageKey) return "";

    // 如果是本地临时路径,直接返回
    if (imageKey.startsWith("http://tmp/") || imageKey.startsWith("wxfile://")) {
        return imageKey;
    }

    // 获取 token
    const token = wx.getStorageSync("token");

    // 构建完整的图片 URL,通过 URL 参数传递 token
    const baseUrl = `${API_CONFIG.baseUrl}/common/image`;

    // 如果有 token,添加到 URL 参数中
    if (token) {
        return `${baseUrl}?token=${encodeURIComponent(token)}&image_key=${encodeURIComponent(imageKey)}`;
    }

    return baseUrl;
}
