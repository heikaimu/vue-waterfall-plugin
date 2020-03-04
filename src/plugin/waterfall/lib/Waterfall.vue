<template>
  <div
    ref="grid"
    class="grid"
    :style="style"
  >
    <div
      v-for="(i,index) in list"
      ref="gridItem"
      :key="index"
      class="grid-item"
      :style="{width: `${itemWidth}px`}"
    >
      <slot
        name="item"
        :data="i"
      />
    </div>
  </div>
</template>

<script>
import windowSize from './mixins/window_size.js';
import debounce from './utils/debounce';
import throttle from './utils/throttle';
export default {
  name: 'Waterfall',
  mixins: [windowSize],
  props: {
    // 列表
    list: {
      type: Array,
      default: () => []
    },
    // 间隙
    gutter: {
      type: Number,
      default: 6
    },
    // 单个宽度
    width: {
      type: Number,
      default: 200
    },
    // 容器宽度
    gridWidth: {
      type: Number,
      default: -1
    },
    // 是否剧中显示
    center: {
      type: Boolean,
      default: true
    },
    // 移动端配置
    breakpoints: {
      type: Object,
      default: () => ({
        1200: { // 当屏幕宽度小于等于1200
          rowPerView: 3
        },
        800: { // 当屏幕宽度小于等于800
          rowPerView: 2
        },
        500: { // 当屏幕宽度小于等于500
          rowPerView: 1
        }
      })
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      itemsGutter: [], // y轴偏移集合
      itemsPosX: [] // x轴便宜集合
    };
  },
  computed: {
    // 容器实际宽度
    gridResponsiveWidth() {
      if (this.gridWidth < 0) {
        return this.windowWidth;
      } else {
        return Math.min(this.windowWidth, this.gridWidth);
      }
    },
    // 容器高度
    height() {
      return this.itemsGutter.slice(0).sort((a, b) => { return a - b; }).pop();
    },
    // 容器样式
    style() {
      return {
        height: `${this.height}px`,
        background: this.backgroundColor
      };
    },
    // 每一个小块的内容宽
    itemWidth() {
      const { width, breakpoints, gutter } = this;
      // 尺寸从小->大排序
      const sizeArr = Object.keys(this.breakpoints).map(size => Number(size)).sort((a, b) => a - b);

      for (let i = 0; i < sizeArr.length; i++) {
        const size = sizeArr[i];
        if (this.windowWidth !== 0 && this.windowWidth <= size) {
          // 如果当前窗口宽度小于改数组元素，则应该按照该元素的行显示个数显示
          return Math.floor((this.windowWidth - gutter) / breakpoints[size].rowPerView - gutter);
        }
      }
      // 如果没有在配置尺寸范围内则按照pc排版
      return width;
    },
    // 每一个小块的实际宽（加上间隙gutter）
    gridItemWidth() {
      return this.itemWidth + this.gutter;
    },
    // 每一行的个数
    rowCount() {
      return Math.max(Math.floor(this.gridResponsiveWidth / this.gridItemWidth), 1);
    },
    // 每个小块的偏移量
    rowShift() {
      if (this.center) {
        const contentWidth = this.rowCount * this.gridItemWidth;
        const rowShift = contentWidth < this.gridResponsiveWidth
          ? (this.gridResponsiveWidth - contentWidth) / 2
          : (this.gridResponsiveWidth % this.gridItemWidth) / 2;
        return Math.floor(rowShift);
      }
      return 0;
    }
  },
  watch: {
    /**
     * 监听父亲容器的宽度变化
     */
    gridWidth() {
      this.calculatePosition(true);
    }
  },
  mounted() {
    window.onresize = debounce(() => this.calculatePosition(true), 300);
    setTimeout(() => {
      this.calculatePosition();
    }, 50);
  },
  methods: {
    /**
     * 刷新
     */
    refresh: throttle(function() {
      this.calculatePosition(true);
    }, 300),
    /**
     * 计算布局
     */
    calculatePosition(again = false) {
      // 更新下窗口宽度，解决突然出现滚动条导致宽度不准确的bug
      this.getWindowSize();

      this.itemsGutter = [];
      this.itemsPosX = [];
      let doneCount = 0;
      const { gutter, itemsGutter, itemsPosX } = this;
      const itemsNodeList = this.$refs.gridItem;
      if (itemsNodeList) {
        for (let i = 0; i < this.rowCount; i++) {
          itemsGutter.push(gutter);
          itemsPosX.push(i * this.gridItemWidth + this.rowShift + this.gutter / 2);
        }

        itemsNodeList.forEach(item => {
          const minGutterValue = itemsGutter.slice(0).sort((a, b) => { return a - b; }).shift();
          const gutterIndex = itemsGutter.indexOf(minGutterValue);
          const posX = itemsPosX[gutterIndex];
          const posY = minGutterValue;
          // 先设置位置，当前是透明度为0的状态
          item.style.transform = 'translate(' + posX + 'px,' + posY + 'px)';
          setTimeout(() => {
            // 加上时间慢慢的显示出小块
            item.style.transition = '0.3s ease-in-out';
            item.style.opacity = 1;

            // 全部完成之后再重制一下位置，解决错位的bug
            doneCount += 1;
            if (again && doneCount === itemsNodeList.length) {
              setTimeout(() => {
                this.calculatePosition(false);
              }, 400);
            }
          }, 30);
          itemsGutter[gutterIndex] += item.getBoundingClientRect().height + gutter;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.grid {
	margin: 0 auto;
	position: relative;
	transition: 0.3s ease-in-out;
}
.grid-item {
	position: absolute;
	left: 0;
	right: 0;
	opacity: 0;
}
</style>
