// 订单页面
import { request, showToast, showLoading, hideLoading } from "../../api/index";

Page({
    data: {
        // 订单列表
        orderList: [],
        // 分页信息
        page: 1,
        pageSize: 10,
        total: 0,
        hasMore: true,
        // 状态筛�?
        statusTabs: [
            { label: "全部", value: "" },
            { label: "待完�?, value: "pending" },
            { label: "已完�?, value: "completed" },
            { label: "超时", value: "timeout" },
        ],
        currentStatus: "",
        // 加载状�?
        loading: false,
        refreshing: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

        this.loadOrders(true);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 每次显示页面时刷新订单列�?
        this.setData({ page: 1 });
        this.loadOrders(true);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({
            page: 1,
            refreshing: true,
        });
        this.loadOrders(true);
    },

    /**
     * 页面上拉触底事件的处理函�?
     */
    onReachBottom() {
        if (this.data.hasMore && !this.data.loading) {
            this.setData({
                page: this.data.page + 1,
            });
            this.loadOrders(false);
        }
    },

    /**
     * 加载订单列表
     */
    async loadOrders(reset = false) {
        if (this.data.loading) return;

        this.setData({ loading: true });

        if (!this.data.refreshing) {
            showLoading("加载�?..");
        }

        try {
            const requestData = {
                page: this.data.page,
                pageSize: this.data.pageSize,
                order_by: "created_at",
                order: "DESC",
            };

            // 添加状态筛�?
            if (this.data.currentStatus) {
                requestData.status = this.data.currentStatus;
            }

            const res = await request({
                url: "/order/list",
                method: "POST",
                data: requestData,
                needAuth: true,
            });

            if (res.code === 200) {
                const newList = res.data.list || [];
                const orderList = reset ? newList : [...this.data.orderList, ...newList];

                this.setData({
                    orderList,
                    total: res.data.total,
                    hasMore: orderList.length < res.data.total,
                });
            } else {
                showToast({
                    title: res.message || "加载失败",
                    icon: "none",
                });
            }
        } catch (error) {
            console.error("加载订单列表失败:", error);
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
     * 状态筛选切�?
     */
    onStatusChange(e) {
        const status = e.currentTarget.dataset.status;
        this.setData({
            currentStatus: status,
            page: 1,
        });
        this.loadOrders(true);
    },

    /**
     * 获取状态文�?
     */
    getStatusText(status) {
        const statusMap = {
            pending: "待完�?,
            completed: "已完�?,
            timeout: "超时",
        };
        return statusMap[status] || status;
    },

    /**
     * 获取状态样式类
     */
    getStatusClass(status) {
        return `status-${status}`;
    },

    /**
     * 跳转到订单详�?
     */
    goToOrderDetail(e) {
        const orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/order-detail/order-detail?id=${orderId}`,
        });
    },

    /**
     * 格式化时�?
     */
    formatTime(timeStr) {
        if (!timeStr) return "";
        const date = new Date(timeStr.replace(/-/g, "/"));
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${month}�?{day}�?${hour}:${minute < 10 ? "0" + minute : minute}`;
    },
});
