<template>
  <el-row align="middle">
    <el-page-header class="pageHeader" :title="title" @back="goBack" content="设备详情"/>
    <el-scrollbar style="height: 100%">
      <el-container>
        <el-aside width="180px">
          <detail/>
        </el-aside>
        <el-main>
            <router-view :key="key"/>
            <el-tooltip  v-if="key !== '/info/index'" class="item" effect="dark" content="查看换电柜基本信息" placement="left-start">
              <div @click="drawer = true" class="right">
                <i class="el-icon-d-arrow-left arrow"></i>
              </div>
            </el-tooltip>

            <el-drawer
              title="换电柜基本信息"
              :visible.sync="drawer"
              :direction="direction"
              :before-close="handleClose"
            >
              <comm :item="infoQuery"></comm>
            </el-drawer>


        </el-main>

      </el-container>
    </el-scrollbar>
  </el-row>

</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/layout/components/'
import ResizeMixin from '@/layout/mixin/ResizeHandler'
import Detail from '@/views/sub/detail'
import Comm from '@/views/sub/comm'
import '@/styles/mixin.scss';
import '@/styles/variables.scss';
export default {
  name: 'SubLayout',
  components: {
    Detail,
    Navbar,
    Sidebar,
    AppMain,
    Comm
  },
  data() {
    return {
      title: '返回设备列表',
      direction:'rtl',
      infoQuery:{
        deviceName : '无数据',
        factoryName : '无数据',
        hardVersion : '无数据',
        productModel : '无数据',
        deviceType : '无数据',
      },
      drawer:false
    }
  },
  mixins: [ResizeMixin],
  computed: {
    key() {
      return this.$route.path
    }
  },
  created() {
    this.saveInfo()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    goBack() {
      sessionStorage.setItem('menu_state', '1')
      sessionStorage.removeItem('sub_menu')
      let path = sessionStorage.getItem('path')
      this.$router.push({ path: path })
    },
    handleClose(done) {
      done()
    },
    saveInfo(){
      if (this.$route.query !== null && Object.keys(this.$route.query).length !== 0) {
        sessionStorage.setItem('infoQuery',JSON.stringify(this.$route.query))
        this.infoQuery = JSON.parse(sessionStorage.getItem('infoQuery'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.main {

}

.pageHeader {
  justify-content: left;
  align-items: center;
  height: 50px;
  padding: 0 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  background-color: #fff;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  position: fixed;
}

.el-scrollbar__wrap {
  overflow-y: auto;
}

.el-main{
  margin-top: 50px;
}

</style>
