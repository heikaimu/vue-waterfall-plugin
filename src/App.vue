<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-19 17:44:24
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-19 17:48:50
-->
<template>
  <div id="app">
    <example/>
  </div>
</template>

<script>
import Example from './example/Example.vue'

export default {
  name: 'App',
  components: {
    Example
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
