const {
    getGroupDetail,
    deleteGroup,
    removeGroupMember,
    leaveGroup,
    showLoading,
    hideLoading,
    showToast,
    getUserInfo,
} = require("../../api/index");

Page({
    data: {
        groupId: "",
        group: null,
        members: [],
        currentUserId: "",
        currentUserRole: "",
        canManage: false,
        isOwner: false,
        showDeleteDialog: false,
        showLeaveDialog: false,
        memberToRemove: null,
    },

    onLoad(options) {
        const { groupId } = options;
        if (!groupId) {
            showToast({ title: "缺少用户组ID" });
            setTimeout(() => wx.navigateBack(), 1500);
            return;
        }

        this.setData({ groupId });

        // 获取当前用户信息
        const userInfo = getUserInfo();
        if (userInfo) {
            this.setData({ currentUserId: userInfo.id });
        }

        this.loadGroupDetail();
    },

    onShow() {
        // 从其他页面返回时刷新
        if (this.data.groupId) {
            this.loadGroupDetail();
        }
    },

    /**
     * 加载用户组详�?
     */
    async loadGroupDetail() {
        try {
            showLoading("加载�?..");

            const res = await getGroupDetail(this.data.groupId);

            if (res.code === 200) {
                const { group, members } = res.data;

                // 查找当前用户在组中的角色
                const currentMember = members.find(m => m.user_id === this.data.currentUserId);
                const currentUserRole = currentMember?.role || "";
                const canManage = currentMember?.can_manage === 1 || currentUserRole === "owner";
                const isOwner = currentUserRole === "owner";

                this.setData({
                    group,
                    members,
                    currentUserRole,
                    canManage,
                    isOwner,
                });
            } else {
                showToast({ title: res.message || "加载失败" });
            }
        } catch (error) {
            console.error("加载用户组详情失�?", error);
            showToast({ title: "加载失败，请重试" });
        } finally {
            hideLoading();
        }
    },

    /**
     * 编辑用户�?
     */
    handleEdit() {
        wx.navigateTo({
            url: `/pages/group-form/group-form?mode=edit&groupId=${this.data.groupId}`,
        });
    },

    /**
     * 显示删除确认对话�?
     */
    handleShowDeleteDialog() {
        this.setData({ showDeleteDialog: true });
    },

    /**
     * 确认删除用户�?
     */
    async handleConfirmDelete() {
        try {
            showLoading("删除�?..");

            const res = await deleteGroup(this.data.groupId);

            if (res.code === 200) {
                showToast({ title: "删除成功", icon: "success" });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            } else {
                showToast({ title: res.message || "删除失败" });
            }
        } catch (error) {
            console.error("删除用户组失�?", error);
            showToast({ title: "删除失败，请重试" });
        } finally {
            hideLoading();
        }
    },

    /**
     * 添加成员
     */
    handleAddMember() {
        wx.navigateTo({
            url: `/pages/add-member/add-member?groupId=${this.data.groupId}`,
        });
    },

    /**
     * 移除成员
     */
    handleRemoveMember(e) {
        const { member } = e.currentTarget.dataset;

        wx.showModal({
            title: "确认移除",
            content: `确定要移除成�?${member.nickname}"吗？`,
            success: async (res) => {
                if (res.confirm) {
                    await this.removeMember(member.user_id);
                }
            },
        });
    },

    /**
     * 执行移除成员操作
     */
    async removeMember(targetUserId) {
        try {
            showLoading("移除�?..");

            const res = await removeGroupMember(this.data.groupId, targetUserId);

            if (res.code === 200) {
                showToast({ title: "移除成功", icon: "success" });
                this.loadGroupDetail();
            } else {
                showToast({ title: res.message || "移除失败" });
            }
        } catch (error) {
            console.error("移除成员失败:", error);
            showToast({ title: "移除失败，请重试" });
        } finally {
            hideLoading();
        }
    },

    /**
     * 更新成员权限
     */
    handleUpdatePermissions(e) {
        const { member } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/update-member/update-member?groupId=${this.data.groupId}&userId=${member.user_id}`,
        });
    },

    /**
     * 显示退出确认对话框
     */
    handleShowLeaveDialog() {
        this.setData({ showLeaveDialog: true });
    },

    /**
     * 确认退出用户组
     */
    async handleConfirmLeave() {
        try {
            showLoading("退出中...");

            const res = await leaveGroup(this.data.groupId);

            if (res.code === 200) {
                showToast({ title: "已退出用户组", icon: "success" });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            } else {
                showToast({ title: res.message || "退出失�? });
            }
        } catch (error) {
            console.error("退出用户组失败:", error);
            showToast({ title: "退出失败，请重�? });
        } finally {
            hideLoading();
        }
    },
});
