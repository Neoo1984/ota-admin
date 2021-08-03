/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 * 邮箱
 */
export const isEmail = (rule, value, callback) => {
  const email =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
  if (!value){
    callback(new Error('请输入邮箱'))
  }else if (!email.test(value)){
    callback(new Error('请输入正确的邮箱'));
  }else {
    callback()
  }
}
/**
 * 密码
 */
export const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}
/**
 * 手机号
 */
export const validatePhone = (rule, value, callback) => {
  const phone = /^1[345789]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phone.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback()
  }
}
/**
 * 上传文件
 */
export const validateFile = (rule, value, callback) => {
  if (!this.$refs.upload.fileList.length) {
    callback(new Error('请选择要上传的文件'));
  } else if (this.$refs.uploadMaterialFile.uploadFiles.length > 1) {
    callback(new Error('每次上传只支持一个文件'));
  } else {
    const regx = new RegExp("(.xlsx)$|(.doc)$|(.docx)$|(.xls)$");
    /**这里有个坑，单文件上传，第一次上传错误格式接着上传第二次格式，列表中数组值有两个*/
    if (!regx.test(this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length - 1].name)) {
      callback(new Error('文件格式只支持xlsx、doc、docx、xls'));
    }
    callback();
  }

}
