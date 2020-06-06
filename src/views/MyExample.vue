<template>
  <div class="main-container">
    <div class="main-content">
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
      <div class="add-more">
        <button
          class="button"
          @click="addNewList"
        >Add More</button>
      </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import Waterfall from 'vue-waterfall-plugin';
// import Waterfall from '../plugin/waterfall';
export default {
  name: 'App',
  components: {
    Waterfall
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
  mounted() {
    this.isSetInitStyle = window.localStorage.getItem('isSetInitStyle') ? JSON.parse(window.localStorage.getItem('isSetInitStyle')) : false;

    this.list = this.images.map((item, index) => {
      return {
        ...item,
        blankColor: this.colors[index % this.colors.length]
      };
    });
  },
  methods: {
    addNewList() {
      const list = this.images.map((item, index) => {
        return {
          ...item,
          blankColor: this.colors[index % this.colors.length]
        };
      });
      this.list.push(...list);
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
.container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  .slider-wrapper {
    height: 100%;
    background-color: #111;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    p {
      font-size: 30px;
      color: #fff;
    }
    span {
      display: block;
      width: 40px;
      height: 40px;
      position: absolute;
      right: -40px;
      top: 0;
      z-index: 999999;
      background-color: red;
    }
  }
}
.main-container {
  display: flex;
  .main-content {
    flex: 1;
    background: #66677c;
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
    }
  }
}
.add-more {
  padding: 20px;
  .button {
    display: block;
    width: 180px;
    height: 40px;
    border-radius: 3px;
    background: #f2f2f2;
    border: none;
    outline: none;
    color: #666;
    font-weight: 900;
    margin: 0 auto;
    cursor: pointer;
  }
}
</style>
