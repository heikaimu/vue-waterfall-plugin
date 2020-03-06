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
  :gridWidth="gridWidth"
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

### 参数
| Name             | Type    | Default   | Description           |
| ---------------- | ------- | --------- | --------------------- |
| list             | Array   | []        | 列表数据            |
| gutter           | Number  | 6         | 卡片之间的间隙 |
| width            | Number  | 200       | 卡片在PC上的宽度     |
| gridWidth        | Number  | -1        | 父容器的宽度，当为-1的时候宽度默认为浏览器窗口宽度，可自己设置固定值 |
| breakpoints      | Object  |breakpoints| 自定义行显示个数，主要用于对移动端的适配 |
| backgroundColor  | String  | #fff      | 背景颜色 |
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
