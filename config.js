/**
 * 小程序配置文件
 */
var host = "https://www.xiaoyunsite.com/api"
var staticHost = "https://www.xiaoyunsite.com/"
var config = {

  // 下面的地址配合云端 Server 工作
  host,
  staticHost,
  statistics: `${host}/statistics`,
  // 登录地址，用于建立会话
  loginUrl: `${host}/login`,
  checkSession: `${host}/checkSession`,
  //文件夹
  creatFolder: `${host}/folders`,

  getFolder: function (id) {
    return `${host}/folders/${id}`;

  },

  // 测试的信道服务接口
  tunnelUrl: `https://${host}/tunnel`,

  // 生成支付订单的接口
  paymentUrl: `https://${host}/payment`,

  // 发送模板消息接口
  templateMessageUrl: `https://${host}/templateMessage`,

  // 上传文件接口
  uploadFileUrl: function (id) {
    return `${host}/folders/${id}/photos`
  },

  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`
};

module.exports = config
