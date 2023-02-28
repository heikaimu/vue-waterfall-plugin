<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-09 10:29:50
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2023-02-28 16:40:08
-->
<template>
  <div class="lazy__box">
    <div class="lazy__resource">
      <img ref="lazyRef" class="lazy__img" alt />
    </div>
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
  height: 0;
  padding-bottom: 100%;
  overflow: hidden;
  position: relative;
}

.lazy__resource {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.lazy__img {
  display: block;
}

.lazy__img[lazy="loading"] {
  padding: 5em 0;
  width: 48px;
  width: 48px;
}

.lazy__img[lazy="loaded"] {
  width: 100%;
  height: 100%;
}

.lazy__img[lazy="error"] {
  padding: 5em 0;
  width: 48px;
  height: auto;
}
</style>
