<template>
  <view v-if="date" class="count-down">
    <view :class="[`${theme}-theme`, `separator-${separator}`]">
      <!-- <block v-if="dynamic.day != '00'">
        <text class="dynamic-value">{{ dynamic.day }}</text>
        <text class="separator">{{ separatorText.day }}</text>
      </block> -->
      <block v-if="dynamic.day > 0">
        <text class="dynamic-value">{{ dynamic.day }}</text>
        <text class="separator">{{ separatorText.day }}</text>
      </block>
      <text class="dynamic-value" :style="{ backgroundColor: customBgColor }">{{ dynamic.hou }}</text>
      <text class="separator">{{ separatorText.hou }}</text>
      <text class="dynamic-value" :style="{ backgroundColor: customBgColor }">{{ dynamic.min }}</text>
      <text class="separator">{{ separatorText.min }}</text>
      <text class="dynamic-value" :style="{ backgroundColor: customBgColor }">{{ dynamic.sec }}</text>
      <text class="separator">{{ separatorText.sec }}</text>
    </view>
  </view>
</template>

<script>
  import { formatDate } from '@/utils/util';

  export default {
    props: {
      // 截止的时间
      date: {
        type: String,
        default: ''
      },
      // 分隔符, colon为英文冒号，zh为中文
      separator: {
        type: String,
        default: 'zh'
      },
      // 组件主题样式, text为纯文本，custom为带背景色
      theme: {
        type: String,
        default: 'text'
      },
      // custom样式的背景色
      customBgColor: {
        type: String,
        default: '#252525'
      }
    },
    data() {
      return {
        // 倒计时数据
        dynamic: {
          day: '0',
          hou: '00',
          min: '00',
          sec: '00'
        },
        // 分隔符文案
        separatorText: {
          day: '天',
          hou: '时',
          min: '分',
          sec: '秒'
        }
      };
    },
    created() {
      // 分隔符文案
      this.setSeparatorText();
      // 开始倒计时
      this.onTime();
    },
    methods: {
      // 分隔符文案
      setSeparatorText() {
        const sText = this.separatorText;
        if (this.separator === 'colon') {
          sText.day = ':'
          sText.hou = sText.min = ':'
          sText.sec = ''
        }
        this.separatorText = sText
      },

      // 开始倒计时
      onTime(deep = 0) {
        const app = this;
        const dynamic = {};

        // 获取当前时间，同时得到活动结束时间数组
        const newTime = new Date().getTime();
        // 对结束时间进行处理渲染到页面
        const endTime = new Date(formatDate(app.date)).getTime();

        // 如果活动未结束，对时间进行处理
        if (endTime - newTime <= 0) {
          return false;
        }

        const diffTime = (endTime - newTime) / 1000;
        // 获取时、分、秒
        const day = parseInt(diffTime / 86400),
          hou = parseInt((diffTime % 86400) / 3600),
          min = parseInt(((diffTime % 86400) % 3600) / 60),
          sec = parseInt(((diffTime % 86400) % 3600) % 60);
        dynamic.day = day;
        dynamic.hou = app.timeFormat(hou);
        dynamic.min = app.timeFormat(min);
        dynamic.sec = app.timeFormat(sec);

        // 渲染，然后每隔一秒执行一次倒计时函数
        app.dynamic = dynamic;
        // 判断倒计时是否结束
        const isEnd = app.isEnd();
        // 结束后执行回调函数
        if (isEnd) {
          deep > 0 && app.$emit('finish');
        }
        // 重复执行
        if (!isEnd) {
          setTimeout(() => {
            app.onTime(++deep);
          }, 100);
        }
      },

      // 判断倒计时是否结束
      isEnd() {
        const { dynamic } = this;
        return dynamic.day == '00' && dynamic.hou == '00' && dynamic.min == '00' && dynamic.sec == '00';
      },

      // 小于10的格式化函数
      timeFormat(value) {
        return value < 10 ? '0' + value : value;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .item {
    display: inline-block;
    width: 22px;
    margin-right: 5px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background-color: #1989fa;
    border-radius: 2px;
  }

  .separator {
    padding: 0 2rpx;
  }

  // 纯文本主题
  .text-theme {

    // 冒号分隔符
    .separator-colon .separator {
      padding: 0 5rpx;
    }

    .dynamic-value {
      background: none !important;
    }
  }

  // 背景主题
  .custom-theme {
    .dynamic-value {
      background: #252525;
      color: #fff;
      padding: 2rpx 8rpx;
      line-height: 40rpx;
      border-radius: 8rpx;
    }

    .separator {
      padding: 0 6rpx;
    }
  }
</style>
