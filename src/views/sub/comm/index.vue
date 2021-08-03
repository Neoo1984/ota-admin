<template>
    <el-form :inline="true" class="demo-form-inline" size="medium">
      <el-form-item label="设备编码">
        <el-input v-model="item.deviceName" disabled />
      </el-form-item>

      <el-form-item label="设备类型">
        <el-input  v-model="item.deviceType" disabled/>
      </el-form-item>

      <el-form-item label="厂家名称">
        <el-input v-model="item.factoryName" disabled/>
      </el-form-item>

      <el-form-item label="产品型号">
        <el-input v-model="item.productModel" disabled/>
      </el-form-item>

      <el-form-item label="硬件版本">
        <el-input v-model="item.hardVersion" disabled/>
      </el-form-item>

    </el-form>
</template>

<script>
import {renderSubType} from "@/utils";

export default {
  name: 'Comm',
  props:{
    item: {
      type: Object,
      required: true
    },
  },
  created() {
    this.item.deviceType = renderSubType(this.item.deviceType)
  },

}
</script>

<style scoped>
.demo-form-inline{
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

</style>
