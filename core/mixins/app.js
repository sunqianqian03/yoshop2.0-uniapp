import { computed } from 'vue'
import { useStore, mapGetters } from 'vuex'
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
    appTheme: () => store.getters.appTheme,
    appThemeStyle: () => appTheme2Str(store.getters.appTheme)
  },
  mounted() {
    // #ifdef H5
    // 微信公众号端隐藏 navigationBar  (解决双标题栏问题)
    if (this.platform === 'WXOFFICIAL') {
      this.hideNavigationBar()
    }
    // #endif
  },
  methods: {
    // #ifdef H5
    // 隐藏 navigationBar
    hideNavigationBar() {
      this.$nextTick(() => {
        const navTitleDom = document.getElementsByTagName('uni-page-head')
        if (navTitleDom.length) {
          navTitleDom[0].style.display = 'none'
          document.body.style.setProperty('--window-top', '0px');
        }
      })
    }
    // #endif
  }
}