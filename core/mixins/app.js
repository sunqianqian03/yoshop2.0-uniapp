import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '@/store/index'
import platform from '@/core/platform'

// 字符串驼峰转中划线
const formatToLine = value => {
  return value.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 主题样式 (因小程序端不支持styleObject语法，所以需要转换成字符串)
const appTheme2Str = appTheme => {
  let str = ''
  for (const index in appTheme) {
    const name = formatToLine(index)
    str += `--${name}:${appTheme[index]};`
  }
  return str
}

export default {
  data() {
    return {
      platform
    }
  },
  computed: {
    ...mapGetters(['appTheme']),
    appThemeStyle() {
      const appTheme = store.getters.appTheme
      return appTheme2Str(appTheme)
    }
  }

}
