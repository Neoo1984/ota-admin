import {queryProductModelList} from "@/api/operation";

export function getProduct(listQuery,listProductModel,hard) {
  listProductModel = [
    {
      label: '全部',
      value: undefined
    }
  ]
  if (listQuery.factoryName !== undefined && listQuery.deviceType !== undefined) {
    const product = {
      factoryName: listQuery.factoryName,
      productType: listQuery.deviceType
    }
    queryProductModelList(product).then(res => {
      if (res.data.success && res.data.data.length !== 0) {
        if (res.data.data.infoList.length !== 0) {
          var productData = res.data.data.infoList
          productData.forEach((item, index) => {
            if (item.hardVersions.length !== 0) {
              hard.push(item.hardVersions)
            }
            listProductModel.push({value: item.productModel, label: item.productModel})
          })
        }
      }
    })
  }else {
    this.$notify({
      title: '警告',
      message: '请先选择设备类型和厂商！',
      type: 'warning',
      duration: 2000
    });
  }
}

