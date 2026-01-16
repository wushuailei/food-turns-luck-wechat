// 我的页面
import { getUserInfo, clearLoginInfo } from "../../api/index";

Page({
    data: {
        userInfo: null,
        menuList: [
            {
                icon: "",
                title: "我的菜谱",
                url: "/pages/my-recipes/my-recipes",
            },
            {
                icon: "",
                title: "我的收藏",
                url: "/pages/my-favorites/my-favorites",
            },
            {
                icon: "",
                title: "我的用户组",
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
     * 加载用户信息
     */
    async loadUserInfo() {
        const userInfo = await getUserInfo();
        this.setData({
            userInfo,
        });
    },

    /**
     * 菜单项点击
     */
    onMenuItemClick(e) {
        const { url } = e.currentTarget.dataset;
        wx.navigateTo({
            url,
        });
    },

    /**
     * 退出登录
     */
    onLogout() {
        wx.showModal({
            title: "提示",
            content: "确定要退出登录吗？",
            success: (res) => {
                if (res.confirm) {
                    clearLoginInfo();
                    wx.showToast({
                        title: "退出成功",
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