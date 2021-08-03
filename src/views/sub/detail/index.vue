<template>
  <div class="navbar">
      <el-aside style="width: 180px;height:100%;">
        <el-scrollbar style="height: 100%">
          <el-menu
            style="height: 100%"
            :default-active="index"
            :collapse="isCollapse"
            @select="clickItem"
            router
          >
            <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
          </el-menu>
        </el-scrollbar>
      </el-aside>

  </div>

</template>

<script>

import SidebarItem from '@/layout/components/Sidebar/SidebarItem'

export default {
  name: 'Detail',
  components: { SidebarItem },
  data() {
    return {
      tabPosition: 'left',
      tabName: '1',
      title: '返回设备列表',
      isCollapse: false,
      index: '/info/index',
      routes: this.$router.options.routes
    }
  },
  created() {
    sessionStorage.setItem('menu_state', '2')
    let menu = sessionStorage.getItem('sub_menu')
    this.index = menu !== null ? menu : '/info/index'

  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {

    clickItem(index) {
      this.index = index
      sessionStorage.setItem('sub_menu', index)
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.pageHeader {
  justify-content: left;
  align-items: center;
  height: 50px;
  padding: 0 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.el-aside {
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
}

.el-main {
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 180px;
}


</style>
