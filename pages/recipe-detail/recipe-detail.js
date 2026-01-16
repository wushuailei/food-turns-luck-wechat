// 菜谱详情
import { showToast, showLoading, hideLoading, getUserInfo, getRecipeDetail, getFavoritesList, addFavorite, removeFavorite, deleteRecipe } from "../../api/index";

Page({
    data: {
        recipeId: "",
        recipe: null,
        isFavorited: false,
        isOwner: false,
        loading: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.id) {
            this.setData({
                recipeId: options.id,
            });
            this.loadRecipeDetail();
        } else {
            showToast({
                title: "缺少菜谱ID",
                icon: "none",
            });
            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
        }
    },

    /**
     * 加载菜谱详情
     */
    async loadRecipeDetail() {
        showLoading("加载中..");

        try {
            const res = await getRecipeDetail(this.data.recipeId);

            if (res.code === 200) {
                // 检查是否是作者
                const userInfo = getUserInfo();
                const isOwner = userInfo && res.data.user_id === userInfo.id;

                this.setData({
                    recipe: res.data,
                    isOwner,
                    loading: false,
                });

                // 检查收藏状态
                this.checkFavoriteStatus();
            } else {
                showToast({
                    title: res.message || "加载失败",
                    icon: "none",
                });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }
        } catch (error) {
            console.error("加载菜谱详情失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
        } finally {
            hideLoading();
        }
    },

    /**
     * 检查收藏状态
     */
    async checkFavoriteStatus() {
        try {
            const res = await getFavoritesList({
                page: 1,
                pageSize: 100,
            });

            if (res.code === 200) {
                const favorited = res.data.list.some(
                    (item) => item.recipe_id === this.data.recipeId
                );
                this.setData({
                    isFavorited: favorited,
                });
            }
        } catch (error) {
            console.error("检查收藏状态失败:", error);
        }
    },

    /**
     * 收藏/取消收藏
     */
    async toggleFavorite() {
        const url = this.data.isFavorited ? "/user/favorites/remove" : "/user/favorites/add";

        try {
            const apiFunc = this.data.isFavorited ? removeFavorite : addFavorite;
            const res = await apiFunc(this.data.recipeId);

            if (res.code === 200) {
                this.setData({
                    isFavorited: !this.data.isFavorited,
                });
                showToast({
                    title: this.data.isFavorited ? "收藏成功" : "取消收藏",
                    icon: "success",
                });
            } else {
                showToast({
                    title: res.message || "操作失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("收藏操作失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        }
    },

    /**
     * 编辑菜谱
     */
    editRecipe() {
        wx.navigateTo({
            url: `/pages/recipe-form/recipe-form?id=${this.data.recipeId}`,
        });
    },

    /**
     * 删除菜谱
     */
    deleteRecipe() {
        wx.showModal({
            title: "确认删除",
            content: "删除后无法恢复，确定要删除这个菜谱吗?",
            success: async (res) => {
                if (res.confirm) {
                    await this.performDelete();
                }
            },
        });
    },

    /**
     * 执行删除操作
     */
    async performDelete() {
        showLoading("删除中..");

        try {
            const res = await deleteRecipe(this.data.recipeId);

            if (res.code === 200) {
                showToast({
                    title: "删除成功",
                    icon: "success",
                });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            } else {
                showToast({
                    title: res.message || "删除失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("删除菜谱失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            hideLoading();
        }
    },

    /**
     * 解析步骤
     */
    parseSteps(stepsStr) {
        try {
            return JSON.parse(stepsStr || "[]");
        } catch (error) {
            return [];
        }
    },

    /**
     * 解析链接
     */
    parseLinks(linksStr) {
        try {
            return JSON.parse(linksStr || "[]");
        } catch (error) {
            return [];
        }
    },
});
