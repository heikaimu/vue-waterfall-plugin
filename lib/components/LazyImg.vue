<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-09 10:29:50
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 13:26:25
-->
<template>
  <div class="lazy__box">
    <img ref="lazyRef" class="lazy__img" alt />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },

  inject: ['lazy', 'imgLoaded'],

  mounted() {
    this.render()
  },

  beforeDestroy() {
    this.unRender()
  },

  methods: {
    render() {
      const el = this.$refs.lazyRef
      if (!el)
        return

      this.lazy.mount(el, this.url, () => {
        this.imgLoaded()
      })
    },

    unRender() {
      const el = this.$refs.lazyRef
      if (!el)
        return

      this.lazy.unmount(el)
    }
  }
}
</script>

<style scoped>
.lazy__box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.lazy__img {
  display: block;
}

.lazy__img[lazy="loading"] {
  padding: 5em 0;
  width: 48px;
}

.lazy__img[lazy="loaded"] {
  width: 100%;
}

.lazy__img[lazy="error"] {
  padding: 5em 0;
  width: 48px;
}
</style>
