import platform from '@/core/platform'
import ClientEnum from '@/common/enum/Client'
import { PayMethodEnum } from '@/common/enum/payment'

/**
 * 发起支付请求 (用于H5)
 * @param {Object} option 参数
 */
const paymentAsH5 = option => {
  const options = { formHtml: '', ...option }
  // 跳转到支付宝支付页
  return new Promise((resolve, reject) => {
    // console.log(options.formHtml)
    if (options.formHtml) {
      const div = document.createElement('div')
      div.innerHTML = options.formHtml
      document.body.appendChild(div)
      document.forms[0].submit()
    }
  })
}

/**
 * 发起支付请求 (用于APP)
 * @param {Object} option 参数
 */
const paymentAsApp = options => {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'alipay',
      orderInfo: options.orderInfo,
      success(res) {
        // isRequireQuery 是否需要主动查单
        // outTradeNo 交易订单号
        const option = {
          isRequireQuery: true,
          outTradeNo: options.out_trade_no,
          method: 'alipay'
        }
        resolve({ res, option })
      },
      fail: res => reject(res)
    })
  })
}

// 获取支付完成后跳转的url
// #ifdef H5
const returnUrl = () => {
  return window.location.href
}
// #endif

/**
 * 统一下单API
 */
export const payment = (option) => {
  const events = {
    [ClientEnum.H5.value]: paymentAsH5,
    [ClientEnum.APP.value]: paymentAsApp
  }
  return events[platform](option)
}

/**
 * 统一下单API需要的扩展数据
 */
export const extraAsUnify = () => {
  const extra = {}
  // #ifdef H5
  extra.returnUrl = returnUrl()
  // #endif
  return extra
}

// H5端支付宝支付下单时的数据
// 用于从支付宝支付页返回到收银台页面后拿到下单数据
// #ifdef H5
export const performance = () => {
  const query = getCurrentQuery()
  if (query.method && query.method === 'alipay.trade.wap.pay.return') {
    return { method: PayMethodEnum.ALIPAY.value, outTradeNo: query.out_trade_no }
  }
  return null
}

const getCurrentQuery = () => {
  const pages = getCurrentPages()
  return pages[pages.length - 1].$route.query
}
// #endif
