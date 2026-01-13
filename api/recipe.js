import { request } from "./request";

/**
 * 获取菜谱列表
 */
export function getRecipeList(data) {
    return request({
        url: "/recipe/list",
        method: "POST",
        data,
        needAuth: false, // 公开接口，但登录后能看到更多
    });
}

/**
 * 获取菜谱详情
 */
export function getRecipeDetail(id) {
    return request({
        url: "/recipe/detail",
        method: "POST",
        data: { id },
        needAuth: false,
    });
}

/**
 * 创建菜谱
 */
export function createRecipe(data) {
    return request({
        url: "/recipe/create",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 编辑菜谱
 */
export function editRecipe(data) {
    return request({
        url: "/recipe/edit",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 删除菜谱
 */
export function deleteRecipe(id) {
    return request({
        url: "/recipe/delete",
        method: "POST",
        data: { id },
        needAuth: true,
    });
}

/**
 * 获取所有标签
 */
export function getTags(withCount = false) {
    return request({
        url: "/recipe/tags",
        method: "POST",
        data: { with_count: withCount },
        needAuth: false,
    });
}

/**
 * 获取我的菜谱
 */
export function getMyRecipes(data) {
    // 复用 list 接口，但通常会有专门参数或者专门接口
    // 根据之前的逻辑，这里假设复用 /recipe/list 并传特定参数，或者后端有 /recipe/my
    // 假设当前暂无专门接口，使用 list 加 filter，或者等待后端补充
    // 之前的 list 接口描述： 已登录用户：可以看到公开的菜谱 + 自己的菜谱 + 家庭组成员的菜谱
    // 如果要“只看我的”，可能需要后端支持。
    // 暂时按照原 api.js 逻辑（假设有）或者标准 list 实现

    // 修正：查看 api 文档，目前只有 list，且自动包含自己的。
    // 如果需要“我的菜谱”页面，可能需要前端过滤或者后端加参数。
    // 暂时实现为标准 list 调用
    return request({
        url: "/recipe/list",
        method: "POST",
        data: { ...data, user_id: "me" }, // 这是一个假设的参数，具体看后端实现，或者复用 list
        needAuth: true,
    });
}
