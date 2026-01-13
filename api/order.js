import { request } from "./request";

/**
 * 创建订单
 */
export function createOrder(data) {
    return request({
        url: "/order/create",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 编辑订单状态
 */
export function editOrder(data) {
    return request({
        url: "/order/edit",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 获取订单列表
 */
export function getOrderList(data) {
    return request({
        url: "/order/list",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
    return request({
        url: "/order/detail",
        method: "POST",
        data: { id },
        needAuth: true,
    });
}

/**
 * 创建订单评价
 */
export function createOrderReview(data) {
    return request({
        url: "/order/review/create",
        method: "POST",
        data,
        needAuth: true,
    });
}
