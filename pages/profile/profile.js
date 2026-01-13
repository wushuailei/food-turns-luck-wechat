// 我的页面
import { getUserInfo, clearLoginInfo, showToast } from "../../api/index";

Page({
    data: {
        userInfo: null,
        menuList: [
            {
                icon: "📝",
                title: "我的菜谱",
                url: "/pages/my-recipes/my-recipes",
            },
            {
                icon: "�?,
                title: "我的收藏",
                url: "/pages/my-favorites/my-favorites",
            },
            {
                icon: "👥",
                title: "我的用户�?,
                url: "/pages/my-groups/my-groups",
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

        this.loadUserInfo();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.loadUserInfo();
    },

    /**
     * 加载用户信息
     */
    loadUserInfo() {
        const userInfo = getUserInfo();
        this.setData({
            userInfo,
        });
    },

    /**
     * 菜单项点�?     */
    onMenuItemClick(e) {
        const url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url,
            fail: () => {
                showToast({
                    title: "功能开发中",
                    icon: "none",
                });
            },
        });
    },

    /**
     * 退出登�?     */
    onLogout() {
        wx.showModal({
            title: "提示",
            content: "确定要退出登录吗�?,
            success: (res) => {
                if (res.confirm) {
                    // 清除登录信息
                    clearLoginInfo();

                    // 显示提示
                    showToast({
                        title: "已退出登�?,
                        icon: "success",
                    });

                    // 跳转到登录页
                    setTimeout(() => {
                        wx.reLaunch({
                            url: "/pages/login/login",
                        });
                    }, 1500);
                }
            },
        });
    },
});
