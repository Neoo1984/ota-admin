const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)',
    name: "@id",
    address: "@first",
    user: "@first",
    phone:"12344",
  }]
})
const product = Mock.mock({
  'items|30': [{
    details: "8口带加热",
    factoryName: "ali",
    hardVersion: "V2.0",
    productId: '@increment', //序号
    productKey: 3012008200414001, //编号
    productModel: 123456,  //型号
    productName: "换电柜",
    productType: "1"   //类型
  }]
})
module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/table/product/page',
    type: 'post',
    response: config => {
      const items = product.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/table/list/[A-Za-z0-9]',
    type: 'delete',
    response: config => {
      return {
        code: 20000,
        data: {
          msg:'删除成功',
        },

      }
    }
  }
]
