// 首页 - 菜谱列表
import { showToast, showLoading, hideLoading, getTags, getRecipeList } from "../../api/index";

Page({
    data: {
        // 菜谱列表
        recipeList: [],
        // 分页信息
        page: 1,
        pageSize: 10,
        total: 0,
        hasMore: true,
        // 搜索和筛选
        searchKeyword: "",
        selectedTag: "",
        tags: [],
        // 排序
        orderBy: "created_at", // view_count, like_count, created_at
        order: "DESC",
        // 加载状态
        loading: false,
        refreshing: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

        this.loadTags();
        this.loadRecipes(true);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({
            page: 1,
            refreshing: true,
        });
        this.loadRecipes(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (this.data.hasMore && !this.data.loading) {
            this.setData({
                page: this.data.page + 1,
            });
            this.loadRecipes(false);
        }
    },

    /**
     * 加载标签列表
     */
    async loadTags() {
        try {
            const res = await getTags(false);

            if (res.code === 200) {
                this.setData({
                    tags: res.data.tags || [],
                });
            }
        } catch (error) {
            console.error("加载标签失败:", error);
        }
    },

    /**
     * 加载菜谱列表
     */
    async loadRecipes(reset = false) {
        if (this.data.loading) return;

        this.setData({ loading: true });

        if (!this.data.refreshing) {
            showLoading("加载中..");
        }

        try {
            const requestData = {
                page: this.data.page,
                pageSize: this.data.pageSize,
                order_by: this.data.orderBy,
                order: this.data.order,
            };

            // 添加搜索关键词
            if (this.data.searchKeyword) {
                requestData.name = this.data.searchKeyword;
            }

            const res = await getRecipeList(requestData);

            if (res.code === 200) {
                const newList = res.data.list || [];
                const recipeList = reset ? newList : [...this.data.recipeList, ...newList];

                this.setData({
                    recipeList,
                    total: res.data.total,
                    hasMore: recipeList.length < res.data.total,
                });
            } else {
                showToast({
                    title: res.message || "加载失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("加载菜谱列表失败:", error);
            showToast({
                title: "网络请求失败",
                icon: "none",
            });
        } finally {
            this.setData({ loading: false, refreshing: false });
            hideLoading();
            wx.stopPullDownRefresh();
        }
    },

    /**
     * 搜索框输入
     */
    onSearchInput(e) {
        this.setData({
            searchKeyword: e.detail.value,
        });
    },

    /**
     * 搜索
     */
    onSearch() {
        this.setData({
            page: 1,
        });
        this.loadRecipes(true);
    },

    /**
     * 标签筛选
     */
    onTagSelect(e) {
        const tag = e.currentTarget.dataset.tag;
        this.setData({
            selectedTag: this.data.selectedTag === tag ? "" : tag,
            page: 1,
        });
        this.loadRecipes(true);
    },

    /**
     * 排序切换
     */
    onSortChange(e) {
        const sortType = e.currentTarget.dataset.sort;
        this.setData({
            orderBy: sortType,
            page: 1,
        });
        this.loadRecipes(true);
    },

    /**
     * 跳转到菜谱详情
     */
    goToRecipeDetail(e) {
        const recipeId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`,
        });
    },
    /**
     * 跳转到菜谱详情   
     */
    goToRecipeDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-detail/recipe-detail?id=${id}`,
        });
    },
});
