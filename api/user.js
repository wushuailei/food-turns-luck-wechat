import { request } from "./request";

/**
 * 搜索用户
 * @param {string} keyword - 搜索关键词(用户ID或昵称)
 * @returns {Promise} 返回用户列表
 */
export function searchUsers(keyword) {
    // 预留接口,待后端提供搜索接口后实现
    return request({
        url: "/user/search",
        method: "POST",
        data: { keyword },
    });
}

/**
 * 获取收藏列表
 */
export function getFavoritesList(data) {
    return request({
        url: "/user/favorites/list",
        method: "POST",
        data,
    });
}

/**
 * 添加收藏
 */
export function addFavorite(recipeId) {
    return request({
        url: "/user/favorites/add",
        method: "POST",
        data: { recipe_id: recipeId },
    });
}

/**
 * 移除收藏
 */
export function removeFavorite(recipeId) {
    return request({
        url: "/user/favorites/remove",
        method: "POST",
        data: { recipe_id: recipeId },
    });
}
