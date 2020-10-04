# Vue 瀑布流组件

### 这是一款超轻量级的瀑布流组件，无需预设高度，支持PC和移动端。

[在线演示地址](https://heikaimu.github.io/vue-waterfall-plugin/dist/index.html#/)

[演示代码地址](https://github.com/heikaimu/vue-waterfall-plugin/blob/master/src/views/MyExample.vue)

### 安装
```
npm i vue-waterfall-plugin -S
```

### 使用
```
import Waterfall from "vue-waterfall-plugin";
<Waterfall 
  :list="list" 
  :gutter="10" 
  :width="240" 
  :breakpoints="{
    1200: { //当屏幕宽度小于等于1200
      rowPerView: 4,
    },
    800: { //当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: { //当屏幕宽度小于等于500
      rowPerView: 2,
    }
  }"
  animationEffect="fadeInUp" // 这里默认是fadeIn，其余的效果需要自己引入animation.css之后才能使用，也可以自己写animation
  backgroundColor="rgb(73, 74, 95)" 
  ref="waterfall"
  >
  <template slot="item" slot-scope="props">
    <div class="card">
      <img :src="props.data.src" alt="" @load="$refs.waterfall.refresh()">
      ...
    </div>
  </template>
</Waterfall>
```

### 版本更新v1.07
移除参数：~~gridWidth~~
新增参数：animationEffect、animationDuration、animationDelay 动画效果参数
新增返回字段：scope.data.itemWidth（当返回的数据中带有图片的宽高尺寸的时候，可以通过该字段值来预先设置卡片的高度，打到更好的数据视觉效果，详细使用可以看案例代码）

### 参数
| Name             | Type    | Default   | Description           |
| ---------------- | ------- | --------- | --------------------- |
| list             | Array   | []        | 列表数据            |
| gutter           | Number  | 6         | 卡片之间的间隙 |
| width            | Number  | 200       | 卡片在PC上的宽度     |
| breakpoints      | Object  |breakpoints| 自定义行显示个数，主要用于对移动端的适配 |
| backgroundColor  | String  | #fff      | 背景颜色 |
| animationEffect  | String  | fadeIn    | 进入动画，默认只有fadeIn，支持引入使用animation.css的动画效果 |
| animationDuration| String  | 1s        | 动画时间 |
| animationDelay   | String  | 0.3s      | 动画延迟 |
```
breakpoints: {
  1200: { //当屏幕宽度小于等于1200
    rowPerView: 4,
  },
  800: { //当屏幕宽度小于等于800
    rowPerView: 3,
  },
  500: { //当屏幕宽度小于等于500
    rowPerView: 2,
  }
}
```

### SSR(服务端渲染支持)
支持基于 Nuxt 的服务端渲染（SSR），目的是为了更好的 SEO。

原理为在服务端借助拿到的模板与数据渲染出子元素，等到客户端再计算布局。

要支持 Nuxt 的 SSR，需要将 Waterfall 作为一个插件（plugin）：

```javascript
// plugins/vue-waterfall.js

import Vue from 'vue'
import Waterfall from '~/vendors/waterfall/Waterfall';

// 注入到 Vue 中作为全局组件
Vue.component('Waterfall', Waterfall)

```

并在 `nuxt.config.js` 中注册，此时可以设置 `ssr` 为 true：

````javascript
// nuxt.config.js

export default {
  	plugins: [
      // ...
      {src: '~/plugins/vue-waterfall.js', ssr: true}
    ]
}
````

之后可以在组件中使用：

```vue
// your/component.vue
<template>
	<Waterfall :list="list" />
</template>

<script>
  export default{
    asyncData(){
      const data = requestData()
      // 这样在 SSR 阶段就能渲染列表数据，但是布局计算是在客户端完成的。
      // 目的是为了 SEO 优化。
      return {
        list: data
      }
    },
    data(){
      return {
        list: []
      }
    }
  }
</script>
```
