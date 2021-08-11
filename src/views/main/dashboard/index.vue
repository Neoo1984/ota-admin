<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎,<span :class="{adminName : userRole === '1',userName: userRole !== '1'}">{{userName}}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'userName',
      'userRole'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.adminName {
  color: #E6A23C;
  font-weight: bold;
}

.userName {
  color: #5cb6ff;
  font-weight: bold;
}
</style>
