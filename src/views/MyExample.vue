<template>
  <div class="container">
    <div
      class="slider-wrapper"
      :style="{ flex: `0 0 ${slideWidth}px`, width: `${slideWidth}px` }"
    >
      <!-- <p>侧边栏</p> -->
      <span @click="toggleSilder">点我</span>
    </div>
    <div class="main-container">
      <div
        class="main-content"
        :style="{ width: gridWidth===-1?'100%':`${gridWidth}px` }"
      >
        <Waterfall
          ref="waterfall"
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
          @handleClick="handleClick"
        >
          <template
            slot="item"
            slot-scope="props"
          >
            <div class="card">
              <div
                class="cover"
                @click="handleClick(props.data)"
              >
                <img
                  :src="props.data.src"
                  alt=""
                  @load="$refs.waterfall.refresh()"
                >
              </div>

              <div class="name">
                <p>{{ props.data.name }}</p>
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
        <div class="menu-wrapper">
          <button
            class="menu"
            @click="addNewList"
          >Add More</button>
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
      list: [],
      isOpen: false,
      slideWidth: 0,
      gridWidth: -1
    };
  },
  mounted() {
    this.list = this.createList(0);
  },
  methods: {
    addNewList() {
      this.list.push(...this.createList(this.list.length));
    },
    createList(startNum) {
      const list = [];
      for (let i = 0; i < 15; i++) {
        list.push({
          src: require(`../assets/${i + 1}.jpg`),
          name: `Image${startNum + i + 1}`
        });
      }
      return list;
    },
    /**
     * 图片点击
     */
    handleClick() {
      alert('图片点击');
    },
    /**
     * 编辑
     */
    handleEdit() {
      alert('编辑');
    },
    /**
     * 删除
     */
    handleDelete() {
      alert('删除');
    },
    /**
     * 打开关闭侧边栏
     */
    toggleSilder() {
      if (this.isOpen) {
        this.isOpen = false;
        this.slideWidth = 0;
        this.gridWidth = -1;
      } else {
        this.isOpen = true;
        this.slideWidth = 200;
        this.gridWidth = this.$el.clientWidth - 220;
      }
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
  flex: 1;
  height: 100%;
  overflow-y: auto;
  .main-content {
    margin: 0 auto;
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
        padding: 10px 10px 0 10px;
        line-height: 0;
        img {
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
    .menu-wrapper {
      padding: 20px;
      .menu {
        display: block;
        width: 180px;
        height: 40px;
        border-radius: 3px;
        background: #fff;
        border: none;
        outline: none;
        color: #666;
        margin: 0 auto;
        cursor: pointer;
      }
    }
  }
}
</style>
