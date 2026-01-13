# Tab Bar Icons - Placeholder

由于图片生成服务暂时不可用,请手动添加以下图标文件到 `assets/icons/` 目录:

## 需要的图标文件:

1. **home.png** - 首页图标 (灰色 #666666)
2. **home-active.png** - 首页图标激活态 (蓝色 #0052D9)
3. **order.png** - 订单图标 (灰色 #666666)
4. **order-active.png** - 订单图标激活态 (蓝色 #0052D9)
5. **profile.png** - 我的图标 (灰色 #666666)
6. **profile-active.png** - 我的图标激活态 (蓝色 #0052D9)

## 图标规格:

- 尺寸: 81x81 像素 (微信小程序推荐尺寸)
- 格式: PNG
- 背景: 透明
- 风格: 简约线条图标

## 临时解决方案:

在开发测试阶段,可以暂时注释掉 `app.json` 中的 `iconPath` 和 `selectedIconPath` 字段,小程序会使用默认图标。
