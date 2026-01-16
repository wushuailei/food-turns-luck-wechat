const {
    createGroup,
    editGroup,
    getGroupDetail,
    uploadImage,
    showLoading,
    hideLoading,
    showToast,
} = require("../../api/index");

Page({
    data: {
        mode: "create", // create | edit
        groupId: "",
        formData: {
            name: "",
            avatar_key: "",
            group_type: "family", // family | partner
        },
        fileList: [], // 用于图片上传组件（如果有）
    },

    onLoad(options) {
        const { mode, groupId } = options;
        this.setData({
            mode: mode || "create",
            groupId: groupId || "",
        });

        // 设置标题
        wx.setNavigationBarTitle({
            title: mode === "edit" ? "编辑用户组" : "创建用户组",
        });

        if (mode === "edit" && groupId) {
            this.loadGroupData(groupId);
        }
    },

    /**
     * 加载用户组数据（编辑模式）
     */
    async loadGroupData(groupId) {
        try {
            showLoading("加载中..");
            const res = await getGroupDetail(groupId);
            if (res.code === 200) {
                const { group } = res.data;
                this.setData({
                    formData: {
                        name: group.name,
                        avatar_key: group.avatar_key,
                        group_type: group.group_type,
                    },
                });
            } else {
                showToast({ title: res.message || "加载失败" });
                setTimeout(() => wx.navigateBack(), 1500);
            }
        } catch (error) {
            console.error("加载用户组失败:", error);
            showToast({ title: "加载失败" });
        } finally {
            hideLoading();
        }
    },

    /**
     * 输入框变化
     */
    onInputChange(e) {
        const { key } = e.currentTarget.dataset;
        const { value } = e.detail;
        this.setData({
            [`formData.${key}`]: value,
        });
    },

    /**
     * 组类型变化
     */
    onTypeChange(e) {
        this.setData({
            "formData.group_type": e.detail.value,
        });
    },

    /**
     * 选择头像
     */
    async handleChooseAvatar() {
        try {
            const res = await wx.chooseMedia({
                count: 1,
                mediaType: ["image"],
                sourceType: ["album", "camera"],
            });

            if (res.tempFiles.length > 0) {
                const filePath = res.tempFiles[0].tempFilePath;

                showLoading("上传中..");
                try {
                    // 上传到服务器获取 key
                    const uploadResult = await uploadImage(filePath);
                    this.setData({
                        "formData.avatar_key": uploadResult.image_key
                    });
                    showToast({ title: "上传成功", icon: "success" });
                } catch (error) {
                    console.error("上传失败:", error);
                    showToast({ title: error.message || "上传失败", icon: "none" });
                } finally {
                    hideLoading();
                }
            }
        } catch (error) {
            console.error("选择图片失败:", error);
        }
    },

    /**
     * 提交表单
     */
    async handleSubmit() {
        const { name, group_type, avatar_key } = this.data.formData;

        if (!name.trim()) {
            showToast({ title: "请输入用户组名称" });
            return;
        }

        try {
            showLoading("提交中..");
            const apiFunc = this.data.mode === "create" ? createGroup : editGroup;
            const payload = {
                name,
                group_type,
                avatar_key,
            };

            if (this.data.mode === "edit") {
                payload.group_id = this.data.groupId;
            }

            const res = await apiFunc(payload);

            if (res.code === 200) {
                showToast({ title: this.data.mode === "create" ? "创建成功" : "更新成功", icon: "success" });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            } else {
                showToast({ title: res.message || "操作失败" });
            }
        } catch (error) {
            console.error("提交失败:", error);
            showToast({ title: "提交失败，请重试" });
        } finally {
            hideLoading();
        }
    },
});
