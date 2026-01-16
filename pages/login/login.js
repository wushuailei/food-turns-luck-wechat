import { request, showToast, isLoggedIn } from "../../api/index";

Page({
    data: {
        isLoading: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        // 检查是否已登录
        if (isLoggedIn()) {
            // 已登录，跳转到首?
            this.navigateToHome();
        }
    },

    /**
     * 处理获取用户信息
     */
    handleGetUserInfo(e) {
        console.log("获取用户信息:", e);

        if (e.detail.errMsg === "getUserInfo:ok") {
            // 用户同意授权，开始登录
            this.login();
        } else {
            // 用户拒绝授权
            showToast({
                title: "需要授权才能登录",
                icon: "none",
            });
        }
    },

    /**
     * 执行登录
     */
    login() {
        this.setData({ isLoading: true });

        // 1. 调用微信登录获取 code
        wx.login({
            success: (res) => {
                if (res.code) {
                    // 2. code 发送到后端
                    this.sendCodeToBackend(res.code);
                } else {
                    this.handleLoginError("获取登录凭证失败");
                }
            },
            fail: () => {
                this.handleLoginError("微信登录失败");
            },
        });
    },

    /**
     * 发送code 到后端
     */
    async sendCodeToBackend(code) {
        try {
            const data = await request({
                url: "/auth/login",
                method: "POST",
                data: { code },
            });

            if (data.code === 200 && data.data.token) {
                // 登录成功
                this.handleLoginSuccess(data.data);
            } else {
                this.handleLoginError(data.message || "登录失败");
            }
        } catch (error) {
            console.error("请求失败:", error);
            this.handleLoginError("网络请求失败，请检查网络连?");
        } finally {
            this.setData({ isLoading: false });
        }
    },

    /**
     * 处理登录成功
     */
    handleLoginSuccess(data) {
        // 保存 token 和用户信息（同步保存，确保立即生效）
        wx.setStorageSync("token", data.token);
        wx.setStorageSync("userInfo", data.user);

        // 更新全局用户信息
        const app = getApp();
        if (app) {
            app.globalData.userInfo = data.user;
        }

        // 显示成功提示
        showToast({
            title: "登录成功",
            icon: "success",
            duration: 1000,
        });

        // 短暂延迟后跳转，确保 storage 已完全写?
        setTimeout(() => {
            this.navigateToHome();
        }, 1000);
    },

    /**
     * 处理登录失败
     */
    handleLoginError(message) {
        this.setData({ isLoading: false });

        showToast({
            title: message,
            icon: "error",
            duration: 2000,
        });
    },

    /**
     * 跳转到首?
     */
    navigateToHome() {
        wx.switchTab({
            url: "/pages/index/index",
        });
    },
});
