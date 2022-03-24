<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-14 10:20:21
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 13:31:37
-->
<template>
  <div ref="waterfallWrapper" class="waterfall-list" :style="wrapperStyle">
    <div
      v-for="(item, index) in list"
      :key="getKey(item, index)"
      class="waterfall-item"
    >
      <div class="waterfall-card">
        <slot name="item" :item="item" :index="index" :url="getRenderURL(item)" />
      </div>
    </div>
  </div>
</template>

<script>
import Lazy from '../utils/Lazy'
import { debounce, getValue } from '../utils/util'
import { getItemWidth } from '../utils/itemWidth'
import { addClass, hasClass, prefixStyle } from '../utils/dom'

const transform = prefixStyle('transform')
const duration = prefixStyle('animation-duration')
const delay = prefixStyle('animation-delay')
const transition = prefixStyle('transition')
const fillMode = prefixStyle('animation-fill-mode')

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    imgSelector: {
      type: String,
      default: 'src',
    },
    width: {
      type: Number,
      default: 200,
    },
    breakpoints: {
      type: Object,
      default: () => ({
        1200: {
          // when wrapper width < 1200
          rowPerView: 3,
        },
        800: {
          // when wrapper width < 800
          rowPerView: 2,
        },
        500: {
          // when wrapper width < 500
          rowPerView: 1,
        },
      }),
    },
    gutter: {
      type: Number,
      default: 10,
    },
    hasAroundGutter: {
      type: Boolean,
      default: true,
    },
    animationPrefix: {
      type: String,
      default: 'animate__animated',
    },
    animationEffect: {
      type: String,
      default: 'fadeIn',
    },
    animationDuration: {
      type: Number,
      default: 1000,
    },
    animationDelay: {
      type: Number,
      default: 300,
    },
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    lazyload: {
      type: Boolean,
      default: true,
    },
    loadProps: {
      type: Object,
      default: () => { },
    },
    delay: {
      type: Number,
      default: 300,
    },
  },

  data() {
    return {
      wrapperWidth: 0,
      wrapperHeight: 0,
      posY: []
    }
  },

  provide() {
    return {
      lazy: new Lazy(this.lazyload, this.loadProps),
      imgLoaded: this.renderer
    }
  },

  computed: {
    colWidth() {
      return getItemWidth({
        wrapperWidth: this.wrapperWidth,
        breakpoints: this.breakpoints,
        gutter: this.gutter,
        hasAroundGutter: this.hasAroundGutter,
        initWidth: this.width,
      })
    },

    cols() {
      const offset = this.hasAroundGutter ? -this.gutter : this.gutter
      return Math.floor((this.wrapperWidth + offset) / (this.colWidth + this.gutter))
    },

    offsetX() {
      const offset = this.hasAroundGutter ? this.gutter : -this.gutter
      const contextWidth = this.cols * (this.colWidth + this.gutter) + offset
      return (this.wrapperWidth - contextWidth) / 2
    },

    wrapperStyle() {
      return {
        height: `${this.wrapperHeight}px`,
        backgroundColor: this.backgroundColor
      }
    }
  },

  watch: {
    wrapperWidth() {
      this.renderer();
    },

    list: {
      handler: function() {
        this.$nextTick(() => {
          this.renderer()
        })
      },
      deep: true
    }
  },

  mounted() {
    this.addWrapperSizeListener();
  },

  beforeDestroy() {
    this.removeWrapperSizeListener();
  },

  methods: {

    renderer: debounce(function() {
      this.layoutHandle();
    }, 300),

    layoutHandle() {
      // 初始化y集合
      this.initY()

      // 获取节点
      const items = document.querySelectorAll('.waterfall-item')
      if (items.length === 0) return false

      // 遍历节点
      for (let i = 0; i < items.length; i++) {
        const curItem = items[i]

        // curItem.addEventListener('transitionend', handle, false)
        // function handle() {
        //   console.log('css事件过渡效果完成')
        // }

        // 最小的y值
        const minY = Math.min.apply(null, this.posY)
        // 最小y的下标
        const minYIndex = this.posY.indexOf(minY)
        // 当前下标对应的x
        const curX = this.getX(minYIndex)

        // 设置x,y,width
        const style = curItem.style

        // 设置偏移
        if (transform) style[transform] = `translate3d(${curX}px,${minY}px, 0)`
        style.width = `${this.colWidth}px`

        // 更新当前index的y值
        const { height } = curItem.getBoundingClientRect()
        this.posY[minYIndex] += height + this.gutter

        // 添加入场动画
        this.addAnimation(curItem, () => {
          if (transition) style[transition] = '.3s'
        })
      }

      this.wrapperHeight = Math.max.apply(null, this.posY)
    },
    
    // add observer
    addWrapperSizeListener() {
      const dom = this.$refs.waterfallWrapper;
      if (!dom) {
        return;
      }
      
      this.wrapperObserver = new ResizeObserver((entries) => {
        const { width } = ((entries[0] || {}).contentRect || {});
        this.wrapperWidth = width;
      });
      this.wrapperObserver.observe(dom);
    },

    // remove observe
    removeWrapperSizeListener() {
      const dom = this.$refs.waterfallWrapper;
      if (!dom) {
        return;
      }

      this.wrapperObserver.unobserve(dom);
    },

    // 获取对应y下标的x的值
    getX (index) {
      const count = this.hasAroundGutter ? index + 1 : index
      return this.gutter * count + this.colWidth * index + this.offsetX
    },

    // 初始y
    initY() {
      this.posY = new Array(this.cols).fill(this.hasAroundGutter ? this.gutter : 0)
    },

    // 根据选择器获取图片地址
    getRenderURL(item) {
      return getValue(item, this.imgSelector)[0]
    },

    // 获取唯一值
    getKey(item, index) {
      return item[this.rowKey] || index
    },

    // 添加动画
    addAnimation(item, callback) {
      const content = item.firstChild
      if (content && !hasClass(content, this.animationPrefix)) {
        const durationSec = `${this.animationDuration / 1000}s`
        const delaySec = `${this.animationDelay / 1000}s`
        const style = content.style
        style.visibility = 'visible'
        if (duration)
          style[duration] = durationSec

        if (delay)
          style[delay] = delaySec

        if (fillMode)
          style[fillMode] = 'both'

        addClass(content, this.animationPrefix)
        addClass(content, this.animationEffect)

        if (callback) {
          setTimeout(() => {
            callback()
          }, this.animationDuration + this.animationDelay);
        }
      }
    }
  }
}
</script>

<style scoped>
.waterfall-list {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.waterfall-item {
  position: absolute;
  left: 0;
  top: 0;
  /* transition: .3s; */
  /* 初始位置设置到屏幕以外，避免懒加载失败 */
  transform: translate3d(0, 3000px, 0);
  visibility: hidden;
}

/* 初始的入场效果 */
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
