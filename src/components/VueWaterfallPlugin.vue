<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-19 17:48:04
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-22 15:28:43
-->
<template>
  <div
    id="waterfallWrapper"
    class="waterfall__list"
    ref="waterfallWrapper"
    :style="{
      height: `${waterfallWrapperHeight}px`,
      backgroundColor: backgroundColor,
    }"
  >
    <div
      class="waterfall__item"
      v-for="(item, index) in list"
      ref="waterfallItem"
      :key="index"
      :style="{
        width: `${itemWidth}px`,
      }"
    >
      <div>
        <slot
          name="item"
          :item="item"
          :itemWidth="itemWidth"
          :url="getURL(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getItemWidth } from "../lib/utils/itemWidth";
import { getMin, getMax } from "../lib/utils/number";
import { debounce } from "../lib/utils/debounce";
import { getValue } from "../lib/utils/getValue";
import { imageLoaded } from "../lib/utils/images";
import { hasClass, addClass, prefixStyle } from "../lib/utils/dom";

const transform = prefixStyle("transform");

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    imgSelector: {
      type: String,
      default: "src",
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
    animationEffect: {
      type: String,
      default: "fadeIn",
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
      default: "#fff",
    },
  },

  data() {
    return {
      // 容器宽度
      waterfallWrapperWidth: 0,
      // 容器高度
      waterfallWrapperHeight: 0,
      // 容器偏移
      waterfallOffsetX: 0,
      // 卡片宽度
      itemWidth: 0,
      // 行数量
      rowCount: 0,
      // X集合
      posX: [],
      // Y集合
      posY: [],
      // 尺寸变化监视器
      wrapperObserver: null,
      // 当前宽度
      currentWidth: 0,
    };
  },

  computed: {
    params() {
      return {
        width: this.width,
        gutter: this.gutter,
        hasAroundGutter: this.hasAroundGutter
      }
    }
  },

  watch: {
    "list.length"() {
      this.loadImages();
    },
    params: {
      deep: true,
      handler: function() {
        this.loadImages();
      }
    }
  },

  mounted() {
    this.addWrapperSizeListener();
  },
  update() {
    this.renderItems();
  },

  beforeDestroy() {
    this.removeWrapperSizeListener();
  },

  methods: {
    // 渲染卡片
    renderItems: debounce(function () {
      this.setWaterfallWrapperWidth();
      this.$nextTick(() => {
        this.setItemWidth();
        this.$nextTick(() => {
          this.setRowCount();
          this.$nextTick(() => {
            this.setWaterfallOffsetX();
            this.$nextTick(() => {
              this.setPosX();
              this.$nextTick(() => {
                this.setListPos();
              });
            });
          });
        });
      });
    }, 300),

    // 容器宽度
    setWaterfallWrapperWidth() {
      const wrapperEle = this.$refs.waterfallWrapper;
      this.waterfallWrapperWidth = wrapperEle ? wrapperEle.getBoundingClientRect().width : 0;
    },

    // 卡片宽度
    setItemWidth() {
      this.itemWidth = getItemWidth({
        breakpoints: this.breakpoints,
        wrapperWidth: this.waterfallWrapperWidth,
        gutter: this.gutter,
        hasAroundGutter: this.hasAroundGutter,
        initWidth: this.width,
      });
    },

    // 列数
    setRowCount() {
      if (this.hasAroundGutter) {
        this.rowCount = Math.floor(
          (this.waterfallWrapperWidth - this.gutter) /
            (this.itemWidth + this.gutter)
        );
      } else {
        this.rowCount = Math.floor(
          (this.waterfallWrapperWidth + this.gutter) /
            (this.itemWidth + this.gutter)
        );
      }
    },

    // 容器偏移
    setWaterfallOffsetX() {
      let contextWidth = 0;
      if (this.hasAroundGutter) {
        contextWidth =
          this.rowCount * (this.itemWidth + this.gutter) + this.gutter;
      } else {
        contextWidth =
          this.rowCount * (this.itemWidth + this.gutter) - this.gutter;
      }

      this.waterfallOffsetX = (this.waterfallWrapperWidth - contextWidth) / 2;
    },

    // 设置X集合
    setPosX() {
      this.posX = [];
      this.posY = [];
      for (let i = 0; i < this.rowCount; i++) {
        let x = 0;
        if (this.hasAroundGutter) {
          x =
            this.gutter * (i + 1) + this.itemWidth * i + this.waterfallOffsetX;
        } else {
          x = this.gutter * i + this.itemWidth * i + this.waterfallOffsetX;
        }
        this.posX.push(x);
        this.posY.push(this.hasAroundGutter ? this.gutter : 0);
      }
    },

    // 计算卡片位置
    setListPos() {
      const eleList = this.$refs.waterfallItem || [];
      for (let i = 0; i < eleList.length; i++) {
        const item = eleList[i];

        const minPosY = getMin(this.posY);
        const minPosYIndex = this.posY.indexOf(minPosY);
        const currentPosX = this.posX[minPosYIndex];

        // set position
        item.style.visibility = "hidden";
        item.style[transform] =
          "translate3d(" + currentPosX + "px," + minPosY + "px, 0)";

        // update group height by current item element
        const { height } = item.getBoundingClientRect();
        this.posY[minPosYIndex] += height + this.gutter;

        // add animation
        this.addAnimation(item);
      }

      // set wrapper height
      const maxHeight = this.list.length > 0 ? getMax(this.posY) : 0;
      this.waterfallWrapperHeight = this.hasAroundGutter
        ? maxHeight
        : maxHeight - this.gutter;
    },

    addAnimation(item) {
      const content = item.firstChild;
      if (!hasClass(content, "animated")) {
        const durationSec = `${this.animationDuration / 1000}s`;
        const delaySec = `${this.animationDelay / 1000}s`;
        content.style["animation-duration"] = durationSec;
        content.style["-webkit-animation-duration"] = durationSec;
        content.style["animation-delay"] = delaySec;
        content.style["-webkit-animation-delay"] = delaySec;
        content.style.visibility = "visible";
        addClass(content, "animated");
        addClass(content, this.animationEffect);
      }
    },

    // getURL
    getURL(item) {
      return getValue(item, this.imgSelector)[0];
    },

    // load images
    loadImages() {
      const images = this.list.map((item) => {
        const url = this.getURL(item);
        return url;
      });

      // when a image loaded, render items again
      imageLoaded(images, () => {
        this.renderItems();
      });
    },

    // add observer
    addWrapperSizeListener() {
      const dom = document.getElementById("waterfallWrapper");
      this.wrapperObserver = new ResizeObserver((entries) => {
        const newWidth = ((entries[0] || {}).contentRect || {}).width || 0;
        if (newWidth === this.currentWidth) {
          return;
        }

        this.currentWidth = newWidth;
        // console.log("render by resize");
        this.renderItems();
      });
      this.wrapperObserver.observe(dom);
    },

    // remove observe
    removeWrapperSizeListener() {
      const dom = document.getElementById("waterfallWrapper");
      this.wrapperObserver.unobserve(dom);
    },
  },
};
</script>

<style scoped>
.waterfall__list {
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: v-bind(backgroundColor);
}
.waterfall__item {
  position: absolute;
  left: 0;
  top: 0;
  visibility: hidden;
}
.waterfall__item img {
  width: 100%;
}

/* animation */
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