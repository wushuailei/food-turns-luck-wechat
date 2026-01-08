# 登录页面说明

## 概述

这是一个使用 tdesign-miniprogram UI 库构建的微信小程序登录页面，具有现代化的设计和流畅的动画效果。

## 功能特性

### 1. 微信一键登录
- 使用微信官方的 `wx.login()` API 获取登录凭证
- 自动调用后端 `/auth/login` 接口完成登录
- 支持自动登录状态检测

### 2. 精美的 UI 设计
- **渐变背景**：紫色到蓝色的渐变背景（#667eea → #764ba2）
- **浮动装饰**：三个浮动的圆形装饰元素，增加视觉动感
- **流畅动画**：
  - Logo 缩放进入动画
  - 标题和副标题淡入下滑动画
  - 登录卡片上滑动画
  - 底部文字淡入动画
- **现代卡片设计**：带阴影和圆角的白色卡片
- **响应式按钮**：带有渐变背景和阴影效果的登录按钮

### 3. 完善的交互反馈
- 加载状态显示（使用 tdesign 的 loading 组件）
- 成功/失败提示（使用微信原生 toast）
- 按钮点击动画效果

## 文件结构

```
pages/login/
├── login.wxml      # 页面结构
├── login.wxss      # 页面样式
├── login.ts        # 页面逻辑
└── login.json      # 页面配置
```

## 使用的组件

### tdesign-miniprogram 组件
- `t-icon`: 用于显示微信图标
- `t-loading`: 用于显示加载动画

### 微信原生 API
- `wx.login()`: 获取微信登录凭证
- `wx.showToast()`: 显示提示信息
- `wx.setStorageSync()`: 保存 token 和用户信息
- `wx.getStorageSync()`: 读取登录状态

## 配置说明

### 1. API 地址配置

在 `utils/api.ts` 文件中修改 API 基础地址：

```typescript
export const API_CONFIG = {
  baseUrl: 'https://your-api-domain.com',  // 修改为你的实际 API 地址
  timeout: 10000,
};
```

### 2. Logo 图片

默认 logo 图片位置：`/assets/logo.png`

如需更换，请替换该文件或在 `login.wxml` 中修改图片路径。

## API 接口说明

### 登录接口

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "code": "string"  // 微信登录凭证
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "nickname": "用户昵称",
      "avatar_key": "头像key"
    }
  }
}
```

## 登录流程

1. 页面加载时检查本地是否有 token
2. 如果已登录，直接跳转到首页
3. 用户点击"微信一键登录"按钮
4. 调用 `wx.login()` 获取微信登录凭证（code）
5. 将 code 发送到后端 `/auth/login` 接口
6. 后端验证成功后返回 token 和用户信息
7. 保存 token 和用户信息到本地存储
8. 显示登录成功提示
9. 跳转到首页

## 工具函数

在 `utils/api.ts` 中提供了以下工具函数：

- `request()`: 统一的 API 请求函数
- `showToast()`: 显示提示信息
- `showLoading()`: 显示加载中
- `hideLoading()`: 隐藏加载中
- `isLoggedIn()`: 检查是否已登录
- `getUserInfo()`: 获取用户信息
- `clearLoginInfo()`: 清除登录信息

## 样式定制

### 修改主题色

在 `login.wxss` 中修改以下变量：

```css
/* 背景渐变色 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 按钮渐变色 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 修改动画效果

所有动画都使用 CSS `@keyframes` 定义，可以在 `login.wxss` 中找到并修改：

- `float`: 浮动动画
- `scaleIn`: 缩放进入动画
- `fadeInDown`: 淡入下滑动画
- `slideUp`: 上滑动画
- `fadeIn`: 淡入动画

## 注意事项

1. **微信开发者工具配置**
   - 需要在微信公众平台配置小程序的 AppID 和 AppSecret
   - 需要配置服务器域名白名单

2. **权限说明**
   - 登录功能需要用户授权获取基本信息
   - 首次登录会弹出授权提示

3. **跳转逻辑**
   - 默认跳转到 `/pages/index/index`
   - 如果首页是 tabBar 页面，使用 `wx.switchTab()`
   - 如果不是 tabBar 页面，使用 `wx.redirectTo()`

## 后续优化建议

1. 添加隐私政策和用户协议页面
2. 支持手机号快捷登录
3. 添加第三方登录方式（如 QQ、微博等）
4. 优化错误处理和重试机制
5. 添加登录埋点统计
