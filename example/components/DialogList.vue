<!--
 * @Date: 2023-02-28 09:38:32
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2023-02-28 16:53:10
 * @FilePath: /vue2-waterfall/example/components/DialogList.vue
-->
<template>
  <el-drawer size="50%" :withHeader="false" :visible.sync="drawer" @opened="opened">
    <WaterfallList :pageSize="20" :options="options"/>
  </el-drawer>
</template>

<script>
import WaterfallList from './WaterfallList.vue'
export default {
  components: {
    WaterfallList
  },
  props: {
    visible: {
      type: Boolean
    },
    options: {
      type: Object
    }
  },
  computed: {
    drawer: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    opened() {

    }
  }
}
</script>
