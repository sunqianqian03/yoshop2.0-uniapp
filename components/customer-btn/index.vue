<template>
  <view v-if="isShow">
    <button class="btn-normal" :open-type="setting.provider == 'mpwxkf' ? 'contact' : ''">
      <slot></slot>
    </button>
  </view>
</template>

<script>
  import SettingKeyEnum from '@/common/enum/setting/Key'
  import SettingModel from '@/common/model/Setting'

  export default {
    props: {},
    data() {
      return {
        isShow: false,
        setting: {}
      }
    },
    async created() {
      // 是否显示在线客服按钮
      this.isShow = await SettingModel.isShowCustomerBtn()
      // 商城客服设置
      this.setting = await SettingModel.item(SettingKeyEnum.CUSTOMER.value, true)
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>

</style>