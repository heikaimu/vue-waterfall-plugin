<template>
  <div class="grid" :style="{background: backgroundColor}" ref="grid">
    <div class="grid-item" v-for="(i,index) in list" ref="gridItem" :style="{width: `${itemWidth}px`}" :key="index" @click="handleClick(i)">
      <slot name="item" :data="i" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'waterfall',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    gutter: {
      type: Number,
      default: 6
    },
    width: {
      type: Number,
      default: 200
    },
    phoneCol: {
      type: Number,
      default: 2
    },
    backgroundColor: {
      type: String,
      default: "#fff"
    }
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
      itemsGutter: [],
      itemsPosX: [],
      canRun: true
    }
  },
  computed: {
    itemWidth() {
      const { screenWidth, gutter, width, phoneCol } = this;
      if (screenWidth >= 1200) {
        return width;
      } else {
        return (screenWidth - (phoneCol + 1) * gutter) / phoneCol;
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth;
      // 节流
      if(this.canRun){
        this.canRun = false;
        setTimeout(() => {
          this.calculatePosition()
          this.canRun = true;
        }, 300);
      }
    }
  },
  updated() {
    this.calculatePosition();
  },
  methods: {
    refresh() {
      this.screenWidth = document.documentElement.clientWidth;
      this.calculatePosition();
    },
    calculatePosition() {
      this.itemsGutter = [];
      this.itemsPosX = [];
      const { gutter, itemsGutter, itemsPosX } = this;
      const containerEle = this.$refs.grid;
      const itemsNodeList = this.$refs.gridItem;
      containerEle.style.width = "";

      if (itemsNodeList) {
        const gridWidth = containerEle.getBoundingClientRect().width;
        // console.log(gridWidth)
        const gridItemWidth = this.itemWidth + gutter;
        const cols = Math.max(Math.floor((gridWidth - gutter) / gridItemWidth), 1);
        containerEle.style.width = `${cols * gridItemWidth + gutter}px`;

        for ( let i = 0; i < cols; i++ ) {
          itemsGutter.push(gutter);
          itemsPosX.push(i * gridItemWidth + gutter);
        }

        itemsNodeList.forEach(item => {
          const minGutterValue = itemsGutter.slice(0).sort((a, b) => {return a - b}).shift();
          const gutterIndex = itemsGutter.indexOf(minGutterValue);
          const posX = itemsPosX[gutterIndex];
          const posY = minGutterValue;

          item.style.transform = "translate(" + posX + "px," + posY + "px)";
          setTimeout(() => {
            item.style.transition = "0.3s ease-in-out";
            item.style.opacity = 1;
          }, 50);

          itemsGutter[gutterIndex] += item.getBoundingClientRect().height + gutter;
        })

        const containerHeight = itemsGutter.slice(0).sort((a, b) => {return a - b}).pop();
        containerEle.style.height = `${containerHeight}px` 
      }
    },
    handleClick(item) {
      this.$emit("handleClick", item);
    }
  }
}
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