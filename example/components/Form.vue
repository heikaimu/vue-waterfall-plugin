<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-18 11:16:32
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 10:29:06
-->
<template>
  <el-form size="small" label-position="top">
    <el-form-item label="imgSelector">
      <el-input v-model="form.imgSelector" disabled />
    </el-form-item>
    <el-divider content-position="left">
      排版
    </el-divider>
    <el-form-item label="width">
      <el-input-number v-model="form.width" :min="0" :step="10" style="width: 100%" />
    </el-form-item>

    <el-form-item label="gutter">
      <el-input-number v-model="form.gutter" :min="0" :step="2" style="width: 100%" />
    </el-form-item>

    <el-form-item label="hasAroundGutter">
      <el-switch v-model="form.hasAroundGutter" />
    </el-form-item>

    <el-divider content-position="left">
      动画
    </el-divider>
    <el-form-item label="animationEffect">
      <el-select
        v-model="form.animationEffect"
        placeholder="请选择"
        style="width: 100%"
      >
        <el-option
          v-for="item in effectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="animationDuration">
      <el-input-number
        v-model="form.animationDuration"
        :min="0"
        :step="100"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="animationDelay">
      <el-input-number
        v-model="form.animationDelay"
        :min="0"
        :step="100"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="backgroundColor">
      <el-color-picker v-model="form.backgroundColor" />
    </el-form-item>
  </el-form>
</template>

<script>
const effectOptions = [
  {
    label: 'fadeIn',
    value: 'fadeIn',
  },
  {
    label: 'fadeInUp',
    value: 'animate__fadeInUp',
  },
  {
    label: 'fadeInDown',
    value: 'animate__fadeInDown',
  },
  {
    label: 'zoomIn',
    value: 'animate__zoomIn',
  },
]

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      effectOptions
    }
  }
}
</script>
