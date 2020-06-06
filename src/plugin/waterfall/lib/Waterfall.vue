<template>
  <div
    ref="grid"
    class="waterfull-grid"
    :style="containerStyle"
  >
    <div
      v-for="(i,index) in list"
      ref="gridItem"
      :key="index"
      class="waterfull-item"
      :style="{width: `${itemWidth}px`}"
    >
      <div class="waterfull-item-box">
        <slot
          name="item"
          :data="{
            ...i,
            itemWidth: itemWidth
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from './utils/debounce';
import throttle from './utils/throttle';
import { hasClass, addClass, prefixStyle } from './utils/dom';
const transform = prefixStyle('transform');
export default {
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
    // 移动端配置
    breakpoints: {
      type: Object,
      default: () => ({
        1200: {
          // 当屏幕宽度小于等于1200
          rowPerView: 3
        },
        800: {
          // 当屏幕宽度小于等于800
          rowPerView: 2
        },
        500: {
          // 当屏幕宽度小于等于500
          rowPerView: 1
        }
      })
    },
    // 动画效果
    animationEffect: {
      type: String,
      default: 'fadeIn'
    },
    animationDuration: {
      type: String,
      default: '1s'
    },
    animationDelay: {
      type: String,
      default: '.3s'
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      containerWidth: -1,
      itemsPosX: [], // x轴偏移集合
      itemsPosY: [] // y轴偏移集合
    };
  },
  computed: {
    // 小容器宽度
    itemWidth() {
      // 如果大容器还没有计算出宽度则返回0
      if (this.containerWidth === -1) {
        return 0;
      } else {
        // 尺寸从小->大排序
        const sizeArr = Object.keys(this.breakpoints)
          .map(size => Number(size))
          .sort((a, b) => a - b);

        for (let i = 0; i < sizeArr.length; i++) {
          const size = sizeArr[i];
          if (this.containerWidth !== 0 && this.containerWidth <= size) {
            // 如果当前窗口宽度小于数组元素，则应该按照该元素的行显示个数显示
            return Math.floor(
              (this.containerWidth - this.gutter) /
                this.breakpoints[size].rowPerView -
                this.gutter
            );
          }
        }

        // 如果没有在配置尺寸范围内则按照pc排版
        return this.width;
      }
    },
    // 行个数
    rowCount() {
      if (this.containerWidth === -1) {
        return 0;
      } else {
        return Math.floor(
          (this.containerWidth - this.gutter) / (this.itemWidth + this.gutter)
        );
      }
    },
    // 为了居中的偏移X
    shiftX() {
      const contentWidth =
        this.rowCount * (this.itemWidth + this.gutter) + this.gutter;
      return (this.containerWidth - contentWidth) / 2;
    },
    // 大容器的高度
    containerHeight() {
      return this.itemsPosY
        .slice(0)
        .sort((a, b) => a - b)
        .pop();
    },
    // 大容器的样式
    containerStyle() {
      return {
        height: `${this.containerHeight}px`,
        background: this.backgroundColor
      };
    }
  },
  watch: {
    list: {
      handler: function(val) {
        this.containerWidth = this.$refs.grid.clientWidth;
        this.$nextTick(() => {
          this.calcPos();
        });
      }
    }
  },
  mounted() {
    window.onresize = debounce(this.resize, 100);
  },
  methods: {
    // 计算每个小容器的定位
    calcPos() {
      this.itemsPosX = [];
      this.itemsPosY = [];

      // 如果当前item不存在则返回
      const itemsNodeList = this.$refs.gridItem;
      if (!itemsNodeList) {
        return;
      }

      // 根据行个数，初始化X,Y偏移集合
      for (let i = 0; i < this.rowCount; i++) {
        this.itemsPosX.push(
          this.shiftX + this.gutter * (i + 1) + this.itemWidth * i
        );
        this.itemsPosY.push(this.gutter);
      }
      itemsNodeList.forEach(item => {
        // 第一步，设置好每个块的位置，但是不显示出来
        const minPosY = this.itemsPosY
          .slice(0)
          .sort((a, b) => a - b)
          .shift();
        const index = this.itemsPosY.indexOf(minPosY);
        const posX = this.itemsPosX[index];
        const posY = minPosY;

        item.style.visibility = 'hidden';
        item.style[transform] = 'translate3d(' + posX + 'px,' + posY + 'px, 0)';
        this.itemsPosY[index] +=
          item.getBoundingClientRect().height + this.gutter;

        // 第二部，给每个小块加如果显示特效并且显示出来
        const content = item.firstChild;
        if (!hasClass(content, 'animated')) {
          content.style['animation-duration'] = this.animationDuration;
          content.style['-webkit-animation-duration'] = this.animationDuration;
          content.style['animation-delay'] = this.animationDelay;
          content.style['-webkit-animation-delay'] = this.animationDelay;
          content.style.visibility = 'visible';

          addClass(content, 'animated');
          addClass(content, this.animationEffect);
        }
      });
    },
    // 变化窗口
    resize() {
      this.containerWidth = this.$refs.grid.clientWidth;
      this.$nextTick(() => {
        this.calcPos();
      });
    },
    // 刷新位置
    refresh: throttle(function() {
      this.containerWidth = this.$refs.grid.clientWidth;
      this.$nextTick(() => {
        this.calcPos();
      });
    }, 300)
  }
};
</script>

<style lang="scss" scoped>
.waterfull-grid {
  margin: 0 auto;
  position: relative;
  transition: 0.3s ease-in-out;
}
.waterfull-item {
  position: absolute;
  left: 0;
  right: 0;
  transition: 0.3s;
}
.waterfull-item-box {
  width: 100%;
  height: 100%;
  // visibility: hidden;
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}
</style>
