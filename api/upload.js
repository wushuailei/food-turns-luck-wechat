import { API_CONFIG } from "./config";

/**
 * 上传图片文件
 * @param {string} filePath - 本地文件路径
 * @returns {Promise} 返回上传后的文件 key
 */
export function uploadImage(filePath) {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync("token");
        const header = {};
        if (token) {
            header["Authorization"] = `Bearer ${token}`;
        }

        wx.uploadFile({
            url: `${API_CONFIG.baseUrl}/upload/image`,
            filePath: filePath,
            name: "file",
            header: header,
            success: (res) => {
                // wx.uploadFile 返回的 data 是字符串，需要 parse
                try {
                    const data = JSON.parse(res.data);
                    if (res.statusCode === 200 && data.code === 200) {
                        resolve(data.data);
                    } else {
                        reject(new Error(data.message || "上传失败"));
                    }
                } catch (e) {
                    reject(new Error("解析响应失败"));
                }
            },
            fail: (err) => {
                reject(err);
            },
        });
    });
}
