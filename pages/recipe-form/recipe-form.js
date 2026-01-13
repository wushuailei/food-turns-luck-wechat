// 菜谱表单�?
import { request, showToast, showLoading, hideLoading } from "../../api/index";

Page({
    data: {
        recipeId: "",
        isEdit: false,
        formData: {
            name: "",
            description: "",
            cover_image_key: "",
            step_type: "custom",
            is_public: true,
        },
        steps: [""],
        links: [""],
        allTags: [],
        selectedTags: [],
        submitting: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.id) {
            // 编辑模式
            this.setData({
                recipeId: options.id,
                isEdit: true,
            });
            this.loadRecipeData();
        }
        this.loadTags();
    },

    /**
     * 加载菜谱数据（编辑模式）
     */
    async loadRecipeData() {
        showLoading("加载�?..");

        try {
            const res = await request({
                url: "/recipe/detail",
                method: "POST",
                data: {
                    id: this.data.recipeId,
                },
            });

            if (res.code === 200) {
                const recipe = res.data;

                // 解析步骤和链�?
                const steps = recipe.step_type === "custom"
                    ? JSON.parse(recipe.steps || "[]")
                    : [""];
                const links = recipe.step_type === "link"
                    ? JSON.parse(recipe.links || "[]")
                    : [""];

                this.setData({
                    formData: {
                        name: recipe.name,
                        description: recipe.description || "",
                        cover_image_key: recipe.cover_image_key || "",
                        step_type: recipe.step_type,
                        is_public: recipe.is_public === 1,
                    },
                    steps: steps.length > 0 ? steps : [""],
                    links: links.length > 0 ? links : [""],
                    selectedTags: recipe.tags || [],
                });
            } else {
                showToast({
                    title: res.message || "加载失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("加载菜谱数据失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            hideLoading();
        }
    },

    /**
     * 加载标签列表
     */
    async loadTags() {
        try {
            const res = await request({
                url: "/recipe/tags",
                method: "POST",
                data: {
                    with_count: false,
                },
            });

            if (res.code === 200) {
                this.setData({
                    allTags: res.data.tags || [],
                });
            }
        } catch (error) {
            console.error("加载标签失败:", error);
        }
    },

    /**
     * 表单字段变化
     */
    onNameChange(e) {
        this.setData({
            "formData.name": e.detail.value,
        });
    },

    onDescChange(e) {
        this.setData({
            "formData.description": e.detail.value,
        });
    },

    onStepTypeChange(e) {
        this.setData({
            "formData.step_type": e.detail.value,
        });
    },

    onPublicChange(e) {
        this.setData({
            "formData.is_public": e.detail.value,
        });
    },

    /**
     * 上传封面图片
     */
    uploadCover() {
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"],
            success: (res) => {
                // TODO: 实际项目中需要上传到服务器获�?key
                // 这里暂时使用本地路径
                this.setData({
                    "formData.cover_image_key": res.tempFilePaths[0],
                });
            },
        });
    },

    /**
     * 步骤管理
     */
    addStep() {
        this.setData({
            steps: [...this.data.steps, ""],
        });
    },

    deleteStep(e) {
        const index = e.currentTarget.dataset.index;
        const steps = this.data.steps.filter((_, i) => i !== index);
        this.setData({
            steps: steps.length > 0 ? steps : [""],
        });
    },

    onStepChange(e) {
        const index = e.currentTarget.dataset.index;
        const steps = [...this.data.steps];
        steps[index] = e.detail.value;
        this.setData({
            steps,
        });
    },

    /**
     * 链接管理
     */
    addLink() {
        this.setData({
            links: [...this.data.links, ""],
        });
    },

    deleteLink(e) {
        const index = e.currentTarget.dataset.index;
        const links = this.data.links.filter((_, i) => i !== index);
        this.setData({
            links: links.length > 0 ? links : [""],
        });
    },

    onLinkChange(e) {
        const index = e.currentTarget.dataset.index;
        const links = [...this.data.links];
        links[index] = e.detail.value;
        this.setData({
            links,
        });
    },

    /**
     * 标签选择
     */
    toggleTag(e) {
        const tag = e.currentTarget.dataset.tag;
        const selectedTags = [...this.data.selectedTags];
        const index = selectedTags.indexOf(tag);

        if (index > -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(tag);
        }

        this.setData({
            selectedTags,
        });
    },

    /**
     * 表单验证
     */
    validateForm() {
        if (!this.data.formData.name.trim()) {
            showToast({
                title: "请输入菜谱名�?,
                icon: "none",
            });
            return false;
        }

        if (!this.data.formData.step_type) {
            showToast({
                title: "请选择步骤类型",
                icon: "none",
            });
            return false;
        }

        return true;
    },

    /**
     * 提交表单
     */
    async onSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.setData({ submitting: true });
        showLoading(this.data.isEdit ? "保存�?.." : "创建�?..");

        try {
            // 准备提交数据
            const data = {
                name: this.data.formData.name.trim(),
                step_type: this.data.formData.step_type,
                is_public: this.data.formData.is_public ? 1 : 0,
            };

            // 可选字�?
            if (this.data.formData.description) {
                data.description = this.data.formData.description.trim();
            }

            if (this.data.formData.cover_image_key) {
                data.cover_image_key = this.data.formData.cover_image_key;
            }

            // 步骤或链�?
            if (this.data.formData.step_type === "custom") {
                const validSteps = this.data.steps.filter(s => s.trim());
                data.steps = JSON.stringify(validSteps);
            } else {
                const validLinks = this.data.links.filter(l => l.trim());
                data.links = JSON.stringify(validLinks);
            }

            // 标签
            if (this.data.selectedTags.length > 0) {
                data.tags = this.data.selectedTags;
            }

            // 编辑模式需�?ID
            if (this.data.isEdit) {
                data.id = this.data.recipeId;
            }

            const url = this.data.isEdit ? "/recipe/edit" : "/recipe/create";
            const res = await request({
                url,
                method: "POST",
                data,
                needAuth: true,
            });

            if (res.code === 200) {
                showToast({
                    title: this.data.isEdit ? "保存成功" : "创建成功",
                    icon: "success",
                });

                setTimeout(() => {
                    if (this.data.isEdit) {
                        wx.navigateBack();
                    } else {
                        // 创建成功后跳转到详情�?
                        wx.redirectTo({
                            url: `/pages/recipe-detail/recipe-detail?id=${res.data.id}`,
                        });
                    }
                }, 1500);
            } else {
                showToast({
                    title: res.message || "操作失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("提交失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            this.setData({ submitting: false });
            hideLoading();
        }
    },
});
