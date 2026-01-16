// 我的收藏
import { request, showToast, showLoading, hideLoading, getFavoritesList, removeFavorite } from "../../api/index";

Page({
    data: {
        favorites: [],
        loading: true,
        page: 1,
        pageSize: 20,
        hasMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.loadFavorites();
    },

    /**
     * 页面显示时刷新列表
     */
    onShow() {
        // 从详情页返回时刷新列表
        if (this.data.favorites.length > 0) {
            this.setData({ page: 1 });
            this.loadFavorites(true);
        }
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true,
        });
        this.loadFavorites(true);
    },

    /**
     * 上拉加载更多
     */
    onReachBottom() {
        if (this.data.hasMore && !this.data.loading) {
            this.setData({
                page: this.data.page + 1,
            });
            this.loadFavorites(false);
        }
    },

    /**
     * 加载收藏列表
     */
    async loadFavorites(refresh = false) {
        if (refresh) {
            this.setData({ loading: true });
        }

        try {
            const res = await getFavoritesList({
                page: this.data.page,
                pageSize: this.data.pageSize,
            });

            if (res.code === 200) {
                this.setData({
                    favorites: refresh ? res.data.list : [...this.data.favorites, ...res.data.list],
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
            console.error("加载收藏列表失败:", error);
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
     * 取消收藏
     */
    removeFavorite(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: "确认取消收藏",
            content: "确定要取消收藏这个菜谱吗?",
            success: async (res) => {
                if (res.confirm) {
                    await this.performRemove(id);
                }
            },
        });
    },

    /**
     * 执行取消收藏操作
     */
    async performRemove(recipeId) {
        showLoading("处理中..");

        try {
            const res = await removeFavorite(recipeId);

            if (res.code === 200) {
                showToast({
                    title: "取消收藏成功",
                    icon: "success",
                });

                // 从列表中移除
                const favorites = this.data.favorites.filter(f => f.recipe_id !== recipeId);
                this.setData({ favorites });
            } else {
                showToast({
                    title: res.message || "操作失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("取消收藏失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            hideLoading();
        }
    },

    /**
     * 跳转到首页
     */
    goToHome() {
        wx.switchTab({
            url: "/pages/index/index",
        });
    },
});
