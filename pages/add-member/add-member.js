const {
    addGroupMember,
    searchUsers,
    showLoading,
    hideLoading,
    showToast,
} = require("../../api/index");

Page({
    data: {
        groupId: "",
        targetUserId: "", // 选中的用�?ID
        role: "member", // member | owner
        canManage: false,
        searchKeyword: "",
        searchResult: null, // 搜索到的用户
        searching: false,
    },

    onLoad(options) {
        const { groupId } = options;
        if (groupId) {
            this.setData({ groupId });
        } else {
            showToast({ title: "参数错误" });
            setTimeout(() => wx.navigateBack(), 1500);
        }
    },

    /**
     * 输入搜索关键�?
     */
    onSearchInput(e) {
        this.setData({
            searchKeyword: e.detail.value,
        });
    },

    /**
     * 搜索用户
     */
    async handleSearch() {
        const { searchKeyword } = this.data;
        if (!searchKeyword.trim()) {
            showToast({ title: "请输入用户ID或昵�? });
            return;
        }

        try {
            this.setData({ searching: true });

            // 调用预留的搜索接�?
            // 暂时模拟：如果输入的是特定的 ID 格式，则假装找到了用�?
            // 实际应该调用 searchUsers(searchKeyword)

            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 模拟搜索结果
            this.setData({
                searchResult: {
                    id: searchKeyword, // 暂时假设输入的即�?ID
                    nickname: `用户_${searchKeyword.slice(0, 6)}`,
                    avatar_key: "",
                },
                targetUserId: searchKeyword
            });

        } catch (error) {
            console.error("搜索用户失败:", error);
            showToast({ title: "搜索失败" });
        } finally {
            this.setData({ searching: false });
        }
    },

    /**
     * 清除搜索结果
     */
    handleClearSearch() {
        this.setData({
            searchKeyword: "",
            searchResult: null,
            targetUserId: "",
        });
    },

    /**
     * 角色变化
     */
    onRoleChange(e) {
        this.setData({
            role: e.detail.value,
        });
    },

    /**
     * 权限变化
     */
    onManageChange(e) {
        this.setData({
            canManage: e.detail.value,
        });
    },

    /**
     * 提交添加
     */
    async handleSubmit() {
        const { groupId, targetUserId, role, canManage } = this.data;

        if (!targetUserId) {
            showToast({ title: "请先搜索并选择用户" });
            return;
        }

        try {
            showLoading("添加�?..");
            const res = await addGroupMember({
                group_id: groupId,
                target_user_id: targetUserId,
                role,
                can_manage: canManage ? 1 : 0,
            });

            if (res.code === 200) {
                showToast({ title: "添加成功", icon: "success" });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            } else {
                showToast({ title: res.message || "添加失败" });
            }
        } catch (error) {
            console.error("添加成员失败:", error);
            showToast({ title: "添加失败，请重试" });
        } finally {
            hideLoading();
        }
    },
});
