<template>
  <div class="main-container">
    <div class="main-content">
      <!-- 滚动加载 -->
      <div
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <Waterfall
          ref="waterfall"
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
          :animationEffect="effect"
          :animationDuration="`${duration}s`"
          :animationDelay="`${delay}s`"
          backgroundColor="rgb(73, 74, 95)"
        >
          <template
            slot="item"
            slot-scope="props"
          >
            <div class="card">
              <div
                class="cover"
                :style="initCardStyle(props)"
                @click="handleClick(props.data)"
              >
                <img
                  :src="props.data.src"
                  alt
                  @load="$refs.waterfall.refresh"
                >
              </div>

              <div class="name">
                <p>height:{{ `${Math.floor(props.data.itemWidth/props.data.width*props.data.height)}px` }}</p>
              </div>
              <div class="menus">
                <p
                  data-title="编辑"
                  @click="handleEdit(props.data)"
                />
                <p
                  data-title="删除"
                  @click="handleDelete(props.data)"
                />
              </div>
            </div>
          </template>
        </Waterfall>
      </div>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
    <div
      class="slide-menu"
      :style="{flex: `0 0 ${slideWidth}px`, width: `${slideWidth}px`}"
    >
      <div
        class="operations"
        :style="{width: `${slideWidth}px`}"
      >
        <div class="item">
          <p class="title">进入效果</p>
          <el-select
            v-model="effect"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in effectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="item">
          <p class="title">动画时间</p>
          <el-input-number
            v-model="duration"
            :min="0"
            style="width:100%"
          />
        </div>
        <div class="item">
          <p class="title">延迟时间</p>
          <el-input-number
            v-model="delay"
            :min="0"
            style="width:100%"
          />
        </div>
        <div class="item">
          <p class="title">设置初始高度颜色</p>
          <el-switch
            v-model="isSetInitStyle"
            @change="changeState"
          />
        </div>
        <div class="item">
          <el-button
            v-if="slideWidth===200"
            style="width:100%"
            @click="shrinkWrapper(400)"
          >缩小窗口</el-button>
          <el-button
            v-else
            style="width:100%"
            @click="shrinkWrapper(200)"
          >恢复窗口</el-button>
        </div>
        <div class="github">
          <a
            class="Header-link"
            href="https://github.com/heikaimu/vue-waterfall-plugin"
            data-hotkey="g d"
            aria-label="Homepage "
            data-ga-click="Header, go to dashboard, icon:logo"
          >
            <svg
              height="32"
              viewBox="0 0 16 16"
              version="1.1"
              width="32"
              aria-hidden="true"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
            /></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Waterfall from 'vue-waterfall-plugin';
import { WaterfallNuxt } from '../plugin/waterfall';
export default {
  name: 'App',
  components: {
    WaterfallNuxt
  },
  data() {
    return {
      images: [
        {
          src: require(`../assets/1.jpg`),
          width: 400,
          height: 400
        },
        {
          src: require(`../assets/2.jpg`),
          width: 500,
          height: 701
        },
        {
          src: require(`../assets/3.jpg`),
          width: 500,
          height: 673
        },
        {
          src: require(`../assets/4.jpg`),
          width: 600,
          height: 845
        },
        {
          src: require(`../assets/5.jpg`),
          width: 600,
          height: 799
        },
        {
          src: require(`../assets/6.jpg`),
          width: 597,
          height: 593
        },
        {
          src: require(`../assets/7.jpg`),
          width: 650,
          height: 912
        },
        {
          src: require(`../assets/8.jpg`),
          width: 500,
          height: 1411
        },
        {
          src: require(`../assets/9.jpg`),
          width: 620,
          height: 835
        },
        {
          src: require(`../assets/10.jpg`),
          width: 658,
          height: 940
        },
        {
          src: require(`../assets/11.jpg`),
          width: 658,
          height: 658
        },
        {
          src: require(`../assets/12.jpg`),
          width: 658,
          height: 688
        },
        {
          src: require(`../assets/13.jpg`),
          width: 658,
          height: 862
        },
        {
          src: require(`../assets/14.jpg`),
          width: 658,
          height: 877
        },
        {
          src: require(`../assets/15.jpg`),
          width: 468,
          height: 662
        }
      ],
      colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
      list: [],
      loading: false,
      effect: 'fadeIn',
      duration: 1,
      delay: 0.3,
      isSetInitStyle: true,
      effectOptions: [
        {
          label: 'fadeIn',
          value: 'fadeIn'
        },
        {
          label: 'fadeInUp',
          value: 'fadeInUp'
        },
        {
          label: 'fadeInDown',
          value: 'fadeInDown'
        },
        {
          label: 'zoomIn',
          value: 'zoomIn'
        }
      ],
      isOpen: false,
      slideWidth: 200,
      boxWidth: 'auto'
    };
  },
  computed: {
    noMore() {
      return this.list.length >= 200;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  mounted() {
    this.isSetInitStyle = window.localStorage.getItem('isSetInitStyle')
      ? JSON.parse(window.localStorage.getItem('isSetInitStyle'))
      : false;

    this.list = this.images.map((item, index) => {
      return {
        ...item,
        blankColor: this.colors[index % this.colors.length]
      };
    });
  },
  methods: {
    async load() {
      this.loading = true;
      await this.addNewList();
      this.loading = false;
    },
    addNewList() {
      return new Promise((resolve) => {
        const list = this.images.map((item, index) => {
          return {
            ...item,
            blankColor: this.colors[index % this.colors.length]
          };
        });
        this.list.push(...list);
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    },
    // 初始化卡片样式
    initCardStyle(props) {
      if (this.isSetInitStyle) {
        return {
          width: `${props.data.itemWidth - 20}px`,
          height: `${((props.data.itemWidth - 20) / props.data.width) *
            props.data.height}px`,
          backgroundColor: props.data.blankColor
        };
      }
    },
    // 初始化开关
    changeState(val) {
      window.localStorage.setItem('isSetInitStyle', val);
      if (val) {
        this.$message.success('已开启高度设置，请刷新页面查看效果');
      } else {
        this.$message.warning('已关闭高度设置，请刷新页面查看效果');
      }
    },
    /**
     * 图片点击
     */
    handleClick(item) {
      this.$message.info(JSON.stringify(item));
    },
    /**
     * 编辑
     */
    handleEdit() {
      this.$message.success('编辑');
    },
    /**
     * 删除
     */
    handleDelete() {
      this.$message.error('删除');
    },
    /**
     * 打开关闭侧边栏
     */
    shrinkWrapper(val) {
      this.slideWidth = val;
      this.$nextTick(() => {
        this.$refs.waterfall.refresh();
      });
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-container {
  display: flex;
  .main-content {
    flex: 1;
    background: #66677c;
    height: 100vh;
    overflow: auto;
  }
  .slide-menu {
    flex: 0 0 200px;
    width: 200px;
    .operations {
      position: fixed;
      right: 0;
      width: 200px;
      top: 0;
      bottom: 0;
      background-color: #333;
      box-sizing: border-box;
      padding: 20px;
      .item {
        margin-bottom: 20px;
        .title {
          padding-bottom: 10px;
          text-align: left;
          color: #fff;
        }
      }
      .github {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
      }
    }
  }
}
.card {
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
  top: 0;
  &:hover {
    top: -3px;
  }
  .cover {
    margin: 10px 10px 0 10px;
    img {
      display: block;
      width: 100%;
    }
  }
  .name {
    background: #fff;
    color: #666;
    font-weight: 600;
    padding: 10px 20px;
    font-size: 14px;
  }
  .menus {
    padding: 10px;
    border-top: 1px solid #e7e7e7;
    text-align: right;
    p {
      position: relative;
      display: inline-block;
      padding: 4px 10px;
      text-decoration: none;
      text-align: center;
      cursor: pointer;
      user-select: none;
      color: white;
      font-size: 12px;
      margin-left: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        border-radius: 4px;
        transition: box-shadow 0.5s ease, transform 0.2s ease;
        will-change: transform;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
          rotateY(var(--ry, 0)) translateZ(var(--tz, -12px));
      }

      &:hover::before {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      &::after {
        position: relative;
        display: inline-block;
        content: attr(data-title);
        transition: transform 0.2s ease;
        font-weight: bold;
        letter-spacing: 0.01em;
        will-change: transform;
        transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
          rotateY(var(--ry, 0));
      }
    }
  }
}
</style>
