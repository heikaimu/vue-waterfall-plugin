<!--
 * @Date: 2023-02-28 09:47:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2023-02-28 16:40:36
 * @FilePath: /vue2-waterfall/example/components/WaterfallList.vue
-->
<template>
  <div style="width:100%">
    <Waterfall :list="list" :row-key="options.rowKey" :gutter="options.gutter"
      :has-around-gutter="options.hasAroundGutter" :width="options.width" :breakpoints="options.breakpoints"
      :img-selector="options.imgSelector" :background-color="options.backgroundColor"
      :animation-effect="options.animationEffect" :animation-duration="options.animationDuration"
      :animation-delay="options.animationDelay" :lazyload="options.lazyload" :load-props="options.loadProps">
      <template #item="{ item, url, index }">
        <div @click="handleClick(item)"
          class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
          <div class="overflow-hidden">
            <LazyImg :url="url" class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105" />
          </div>
          <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
            <h2 class="pb-4 text-gray-50 group-hover:text-yellow-300">
              {{ item.name }}
            </h2>
            <div class="pt-3 flex justify-between items-center border-t border-t-gray-600 border-opacity-50">
              <div class="text-gray-50">
                $ {{ item.price }}
              </div>
              <div>
                <button
                  class="px-3 h-7 rounded-full bg-red-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-red-600"
                  @click.stop="handleDelete(item, index)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>
    <div class="flex justify-center py-10 bg-gray-900">
      <button
        class="px-5 py-2 rounded-full bg-gray-700 text-md text-white cursor-pointer hover:bg-gray-800 transition-all duration-300"
        @click="handleLoadMore">加载更多</button>
    </div>
  </div>
</template>

<script>
import { LazyImg, Waterfall } from '../../lib/index'
// import { LazyImg, Waterfall } from 'vue-waterfall-plugin'
// import 'vue-waterfall-plugin/dist/style.css'
import { getList } from '../api'

export default {
  components: {
    LazyImg,
    Waterfall
  },
  props: {
    pageSize: {
      type: Number,
      default: 100
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      page: 1,
    }
  },
  mounted() {
    this.handleLoadMore()
  },
  methods: {
    handleLoadMore() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getList({
        page: this.page,
        pageSize: this.pageSize,
      }).then((res) => {
        this.list.push(...res)
        this.page += 1
        loading.close()
      })
    },
    handleDelete(item, index) {
      this.list.splice(index, 1)
    },
    handleClick(item) {
      this.$emit('cardClick', item)
    }
  }
}
</script>
