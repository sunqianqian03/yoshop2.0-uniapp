import { urlDecode } from '@/utils/util'

export default {
  data() {
    return {}
  },
  methods: {

    /**
     * link对象点击事件
     * 支持tabBar页面
     */
    onLink(linkObj) {
      if (!linkObj) return false
      // 跳转到指定页面
      if (linkObj.type === 'PAGE') {
        this.$navTo(linkObj.param.path, linkObj.param.query)
      }
      // 跳转到自定义路径
      if (linkObj.type === 'CUSTOM') {
        this.$navTo(linkObj.param.path, urlDecode(linkObj.param.queryStr))
      }
      // 跳转到微信小程序
      // #ifdef MP-WEIXIN
      if (linkObj.type === 'MP-WEIXIN') {
        uni.navigateToMiniProgram({
          appId: linkObj.param.appId,
          path: linkObj.param.path
        })
      }
      // #endif
      // 跳转到H5外部链接
      if (linkObj.type === 'URL') {
        // #ifdef H5
        window.open(linkObj.param.url)
        // #endif
        // #ifdef APP-PLUS
        plus.runtime.openWeb(linkObj.param.url)
        // #endif
        // #ifdef MP
        uni.setClipboardData({
          data: linkObj.param.url,
          success: () => this.$toast('链接已复制'),
          fail: ({ errMsg }) => this.$toast('复制失败 ' + errMsg)
        })
        // #endif
      }
      return true
    }
  },

}