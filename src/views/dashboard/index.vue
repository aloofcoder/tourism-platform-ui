<template>
  <div class="app-container">
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      value: new Date(),
      list: [],
      keys: [
        'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
      ]
    }
  },
  created() {
  },
  computed: {
  }
}
</script>
<style>
  .el-calendar-day {
    min-height: 85px;
    height: auto !important;
  }
  .el-divider--horizontal {
    margin-top: 10px !important;
  }
</style>
