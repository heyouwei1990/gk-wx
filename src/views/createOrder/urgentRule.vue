<template>
  <div class="urgentRule">
    <van-nav-bar
      title="规则说明"
      left-arrow
      fixed
      :z-index="10"
      @click-left="$router.go(-1)"
    />
    <article>
      <h3>急单模式</h3>

      1. 服务介绍：适用于自由平台发单需求，开启该模式后即可享受工单加急服务；<br>

      2. 加急服务内容：<br>

      ① 发单后2小时内响应;<br>

      ②若对接不成功，速派承诺全额退款；<br>

      3. 服务费用：39.9元；<br>

      4. 生效时间：购买后即生效，仅用于本单使用；<br>

      5. 在使用过程中有任何疑问，请拨打客服电话<br>
    </article>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  }
}
</script>
<style lang="scss">
.urgentRule{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  article{
    padding: 10px 15px;
    font-size: 14px;
    color: #333;
    line-height: 24px;
  }
  h3{
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}
</style>