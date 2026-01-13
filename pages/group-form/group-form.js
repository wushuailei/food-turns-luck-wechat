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
        fileList: [], // 用于图片上传组件（如果有�?
    },

    onLoad(options) {
        const { mode, groupId } = options;
        this.setData({
            mode: mode || "create",
            groupId: groupId || "",
        });

        // 设置标题
        wx.setNavigationBarTitle({
            title: mode === "edit" ? "编辑用户�? : "创建用户�?,
        });

        if (mode === "edit" && groupId) {
            this.loadGroupData(groupId);
        }
    },

    /**
     * 加载用户组数据（编辑模式�?
     */
    async loadGroupData(groupId) {
        try {
            showLoading("加载�?..");
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
            console.error("加载用户组失�?", error);
            showToast({ title: "加载失败" });
        } finally {
            hideLoading();
        }
    },

    /**
     * 输入框变�?
     */
    onInputChange(e) {
        const { key } = e.currentTarget.dataset;
        const { value } = e.detail;
        this.setData({
            [`formData.${key}`]: value,
        });
    },

    /**
     * 组类型变�?
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

                showLoading("上传�?..");
                // 调用预留的上传接�?
                try {
                    // 暂时直接使用本地路径模拟，实际应上传获取 key
                    // const key = await uploadImage(filePath);
                    const key = filePath; // 模拟：直接使用路�?

                    this.setData({
                        "formData.avatar_key": key
                    });
                    showToast({ title: "上传成功(模拟)", icon: "success" });
                } catch (error) {
                    // 如果上传接口未实现，暂时使用本地路径
                    this.setData({
                        "formData.avatar_key": filePath
                    });
                    showToast({ title: "已选择图片(未上�?", icon: "none" });
                }
            }
        } catch (error) {
            console.error("选择图片失败:", error);
        } finally {
            hideLoading();
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
            showLoading("提交�?..");
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
