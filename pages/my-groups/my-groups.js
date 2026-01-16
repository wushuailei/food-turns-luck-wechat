Page({
    data: {
        groups: [],
        loading: false,
        isEmpty: false,
    },

    onLoad() {
        this.loadGroups();
    },

    onShow() {
        // 从其他页面返回时刷新列表
        this.loadGroups();
    },

    onPullDownRefresh() {
        this.loadGroups();
    },

    /**
     * 加载用户组列表?
     */
    async loadGroups() {
        const { getMyGroups, showLoading, hideLoading, showToast } = require("../../api/index");

        try {
            this.setData({ loading: true });
            showLoading("加载中..");

            const res = await getMyGroups();

            if (res.code === 200) {
                const groups = res.data.list || [];
                this.setData({
                    groups,
                    isEmpty: groups.length === 0,
                });
            } else {
                showToast({ title: res.message || "加载失败" });
            }
        } catch (error) {
            console.error("加载用户组失败?", error);
            showToast({ title: "加载失败，请重试" });
        } finally {
            this.setData({ loading: false });
            hideLoading();
            wx.stopPullDownRefresh();
        }
    },

    /**
     * 跳转到创建用户组页面
     */
    handleCreateGroup() {
        wx.navigateTo({
            url: "/pages/group-form/group-form?mode=create",
        });
    },

    /**
     * 跳转到用户组详情页面
     */
    handleGroupTap(e) {
        const { groupId } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/group-detail/group-detail?groupId=${groupId}`,
        });
    },

    /**
     * 获取组类型的显示文本
     */
    getGroupTypeText(type) {
        const typeMap = {
            family: "家庭",
            partner: "伙伴",
        };
        return typeMap[type] || type;
    },

    /**
     * 获取角色的显示文本
     */
    getRoleText(role) {
        const roleMap = {
            owner: "创建者",
            member: "成员",
        };
        return roleMap[role] || role;
    },
});
