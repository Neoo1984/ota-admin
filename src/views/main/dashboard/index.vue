<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎,<img class="icon_super" :src="icon_super" v-if="userRole === '1'" alt="super"><span
      :class="{adminName : userRole === '1',userName: userRole !== '1'}"
    >{{ userName }}</span></div>
    <div class="draw">
      <img class="draw_pic" :src="page_draw1" alt="首页">
      <img class="draw_pic" :src="page_draw2" alt="首页">
      <img class="draw_pic" :src="page_draw3" alt="首页">
      <img class="draw_pic" :src="page_draw4" alt="首页">
    </div>


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
  },
  data() {
    return {
      icon_super: require('@/assets/state/super.svg'),
      page_draw1: require('@/assets/state/homesvg.svg'),
      page_draw2: require('@/assets/state/homesvg2.svg'),
      page_draw3: require('@/assets/state/homesvg3.svg'),
      page_draw4: require('@/assets/state/homesvg4.svg')
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    /* myEcharts() {
       const echarts = require('echarts/lib/echarts')
       // 基于准备好的dom，初始化echarts实例
       let myChart = echarts.init(document.getElementById('main'))

       // 指定图表的配置项和数据
       this.option = {
         tooltip: {
           trigger: 'axis',
           axisPointer: {            // Use axis to trigger tooltip
             type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
           }
         },
         legend: {
           data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
         },
         grid: {
           left: '3%',
           right: '4%',
           bottom: '3%',
           containLabel: true
         },
         xAxis: {
           type: 'value'
         },
         yAxis: {
           type: 'category',
           data: this.factory
         },
         series: [
           {
             name: 'Direct',
             type: 'bar',
             stack: 'total',
             label: {
               show: true
             },
             emphasis: {
               focus: 'series'
             },
             data: [320, 302, 301, 334, 390, 330, 320]
           },
           {
             name: 'Mail Ad',
             type: 'bar',
             stack: 'total',
             label: {
               show: true
             },
             emphasis: {
               focus: 'series'
             },
             data: [120, 132, 101, 134, 90, 230, 210]
           },
           {
             name: 'Affiliate Ad',
             type: 'bar',
             stack: 'total',
             label: {
               show: true
             },
             emphasis: {
               focus: 'series'
             },
             data: [220, 182, 191, 234, 290, 330, 310]
           },
           {
             name: 'Video Ad',
             type: 'bar',
             stack: 'total',
             label: {
               show: true
             },
             emphasis: {
               focus: 'series'
             },
             data: [150, 212, 201, 154, 190, 330, 410]
           },
           {
             name: 'Search Engine',
             type: 'bar',
             stack: 'total',
             label: {
               show: true
             },
             emphasis: {
               focus: 'series'
             },
             data: [820, 832, 901, 934, 1290, 1330, 1320]
           }
         ]
       }

       // 使用刚指定的配置项和数据显示图表。
       myChart.setOption(this.option)
     },*/

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
    display: flex;
    align-items: center;
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

.icon_super {
  width: 32px;
  height: 32px;
  max-height: 100%;
  margin-left: 16px;
}

.draw {
  display: flex;
  margin-top: 60px;
  height: 500px;
  padding-left: 60px;
  .draw_pic {
    width: 23%;
    height: 80%;
  }
}
</style>
