<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-14 10:20:21
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2023-02-28 16:35:25
-->
<template>
  <div class="h-screen flex overflow-hidden">

    <!-- 子列表 -->
    <DialogList :visible.sync="dialogVisible" :options="options" />


    <!-- 左侧列表 -->
    <div class="flex-auto overflow-y-auto">
      <WaterfallList :options="options" @cardClick="dialogVisible = true" />
    </div>

    <!-- 右侧配置 -->
    <div class="h-full flex flex-col justify-between">
      <div class="p-4 border-b border-b-gray-100 shadow-md">
        <span v-if="isOpen" @click="handleToggleController(false)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else @click="handleToggleController(true)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </div>

      <div class="p-4 flex-auto overflow-y-auto">
        <ControllerForm v-if="isOpen" :form="options" />
      </div>

      <Github />
    </div>
  </div>
</template>

<script>
import Github from './Github.vue'
import ControllerForm from './Form.vue'
import DialogList from './DialogList.vue'
import WaterfallList from './WaterfallList.vue'
import loading from '../assets/loading.png'
import error from '../assets/error.png'

export default {
  components: {
    WaterfallList,
    Github,
    ControllerForm,
    DialogList
  },

  data() {
    return {
      options: {
        // 唯一key值
        rowKey: 'id',
        // 卡片之间的间隙
        gutter: 10,
        // 是否有周围的gutter
        hasAroundGutter: true,
        // 卡片在PC上的宽度
        width: 320,
        // 自定义行显示个数，主要用于对移动端的适配
        breakpoints: {
          1200: {
            // 当屏幕宽度小于等于1200
            rowPerView: 4,
          },
          800: {
            // 当屏幕宽度小于等于800
            rowPerView: 3,
          },
          500: {
            // 当屏幕宽度小于等于500
            rowPerView: 2,
          },
        },
        // 动画效果
        animationEffect: 'animate__fadeInUp',
        // 动画时间
        animationDuration: 1000,
        // 动画延迟
        animationDelay: 300,
        // 背景色
        backgroundColor: '#2C2E3A',
        // imgSelector
        imgSelector: 'src.original',
        // 加载配置
        loadProps: {
          loading,
          error,
        },
        // 是否懒加载
        lazyload: true,
      },
      isOpen: true,
      previewVisible: false,
      previewTitle: '',
      previewURL: '',
      page: 1,
      pageSize: 100,
      loadLoading: false,
      dialogVisible: false
    }
  },

  mounted() {
    this.$alert('点击卡片可以弹出子组件弹窗', '提示', {
      confirmButtonText: '确定'
    });
  },

  methods: {
    handleToggleController(flag) {
      this.isOpen = flag
    }
  }
}
</script>
