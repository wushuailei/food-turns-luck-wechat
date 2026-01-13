import { request } from "./request";

/**
 * 创建用户组
 */
export function createGroup(data) {
    return request({
        url: "/group/create",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 编辑用户组信息
 */
export function editGroup(data) {
    return request({
        url: "/group/edit",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 删除用户组
 */
export function deleteGroup(groupId) {
    return request({
        url: "/group/delete",
        method: "POST",
        data: { group_id: groupId },
        needAuth: true,
    });
}

/**
 * 获取我的用户组列表
 */
export function getMyGroups() {
    return request({
        url: "/group/my-groups",
        method: "POST",
        needAuth: true,
    });
}

/**
 * 获取用户组详情
 */
export function getGroupDetail(groupId) {
    return request({
        url: "/group/detail",
        method: "POST",
        data: { group_id: groupId },
        needAuth: true,
    });
}

/**
 * 添加成员到用户组
 */
export function addGroupMember(data) {
    return request({
        url: "/group/members/add",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 从用户组移除成员
 */
export function removeGroupMember(groupId, targetUserId) {
    return request({
        url: "/group/members/remove",
        method: "POST",
        data: { group_id: groupId, target_user_id: targetUserId },
        needAuth: true,
    });
}

/**
 * 更新成员权限
 */
export function updateMemberPermissions(data) {
    return request({
        url: "/group/members/update",
        method: "POST",
        data,
        needAuth: true,
    });
}

/**
 * 退出用户组
 */
export function leaveGroup(groupId) {
    return request({
        url: "/group/leave",
        method: "POST",
        data: { group_id: groupId },
        needAuth: true,
    });
}
