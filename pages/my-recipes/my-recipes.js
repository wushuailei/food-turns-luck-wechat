// 我的菜谱
import { request, showToast, showLoading, hideLoading, getUserInfo, getRecipeList, deleteRecipe } from "../../api/index";

Page({
    data: {
        recipes: [],
        loading: true,
        page: 1,
        pageSize: 20,
        hasMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.loadMyRecipes();
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true,
        });
        this.loadMyRecipes(true);
    },

    /**
     * 上拉加载更多
     */
    onReachBottom() {
        if (this.data.hasMore && !this.data.loading) {
            this.setData({
                page: this.data.page + 1,
            });
            this.loadMyRecipes(false);
        }
    },

    /**
     * 加载我的菜谱
     */
    async loadMyRecipes(refresh = false) {
        if (refresh) {
            this.setData({ loading: true });
        }

        try {
            const userInfo = getUserInfo();
            if (!userInfo) {
                showToast({
                    title: "请先登录",
                    icon: "none",
                });
                return;
            }

            const res = await getRecipeList({
                page: this.data.page,
                pageSize: this.data.pageSize,
                order_by: "created_at",
                order: "DESC",
            });

            if (res.code === 200) {
                // 过滤出自己的菜谱
                const myRecipes = res.data.list.filter(
                    (recipe) => recipe.user_id === userInfo.id
                );

                this.setData({
                    recipes: refresh ? myRecipes : [...this.data.recipes, ...myRecipes],
                    hasMore: res.data.page < res.data.totalPages,
                    loading: false,
                });
            } else {
                showToast({
                    title: res.message || "加载失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("加载菜谱失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            this.setData({ loading: false });
            wx.stopPullDownRefresh();
        }
    },

    /**
     * 跳转到详情页
     */
    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-detail/recipe-detail?id=${id}`,
        });
    },

    /**
     * 创建菜谱
     */
    createRecipe() {
        wx.navigateTo({
            url: "/pages/recipe-form/recipe-form",
        });
    },

    /**
     * 编辑菜谱
     */
    editRecipe(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-form/recipe-form?id=${id}`,
        });
    },

    /**
     * 删除菜谱
     */
    deleteRecipe(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: "确认删除",
            content: "删除后无法恢复，确定要删除这个菜谱吗?",
            success: async (res) => {
                if (res.confirm) {
                    await this.performDelete(id);
                }
            },
        });
    },

    /**
     * 执行删除操作
     */
    async performDelete(id) {
        showLoading("删除中..");

        try {
            const res = await deleteRecipe(id);

            if (res.code === 200) {
                showToast({
                    title: "删除成功",
                    icon: "success",
                });

                // 从列表中移除
                const recipes = this.data.recipes.filter(r => r.id !== id);
                this.setData({ recipes });
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
});
