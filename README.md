# Vue 瀑布流组件

### 这是一款超轻量级的瀑布流组件，无需预设高度，支持PC和移动端。支持图片加载后重新调整顺序。

[在线演示地址](https://heikaimu.github.io/waterfall-example/dist/#/)
[例子的代码](https://github.com/heikaimu/waterfall-example)

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
  :phoneCol="2" 
  backgroundColor="rgb(73, 74, 95)" 
  @handleClick="handleClick" 
  ref="waterfall"
  >
  <template slot="item" slot-scope="props">
    <div class="card">
      <img :src="props.data.src" alt="" @load="$refs.waterfall.refresh()">
    </div>
  </template>
</Waterfall>
```

### 参数
| Name             | Type    | Default | Description           |
| ---------------- | ------- | ------- | --------------------- |
| list             | Array   | []      | 列表数据            |
| gutter           | Number  | 6       | 卡片之间的间隙 |
| width            | Number  | 200     | 卡片在PC上的宽度     |
| phoneCol         | Number  | 2       | 当屏幕尺寸低于1200的时候生效。此时width作废。列数由phoneCol决定               |
| backgroundColor  | String  | #fff    | 背景颜色 |

### 方法
| Name             | Description           |
| ---------------- | --------------------- |
| handleClick      | 点击事件            |
