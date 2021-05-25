<template>
  <div class="balanceSuccess">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="$router.go(-2)"
    >
      <template #left>
        <van-icon name="cross" size="18" />
      </template>
    </van-nav-bar>
    <div class="icon"></div>
    <p class="desc" v-html="desc"></p>
  </div>
</template>
<script>
export default {
  name:'BalanceSuccess',
  data(){
    return{
      title:'提现',
      desc:'',
      dataArr:[
        {
          title:'提现',
          desc:'提现申请已提交，速派将在5~7个工作日内处理，<br/>如有问题请联系客服电话，400-1100-243'
        },
        {
          title:'充值',
          desc:'您的资料已提交，请耐心等待速派后台确认。 <br/>如有问题请联系客服电话400-1100-243。',
        },
        {
          title:'退款',
          desc:'提现申请已提交，速派将在20个工作日内处理。 <br/>如有问题，请联系客服电话400-1100-243。',
        }
      ],
      type:0,
    }
  },
  created() {
    this.type=Number(this.$route.query.type);
    this.init();
  },
  methods: {
    init(){
      this.title=this.dataArr[this.type].title;
      this.desc=this.dataArr[this.type].desc;
    }
  },
}
</script>
<style lang="scss" scoped>
.balanceSuccess{
@import '~@/style/_base.scss';
  min-height: 100vh;
  background-color: #fff;
  padding-top: 46px;
  .icon{
    display: block;
    width: 46px;
    height: 50px;
    margin: 95px auto 50px;
    @include bg('~@/assets/center/icon-success.png');
  }
  .desc{
    padding: 0 15px;
    font-size: 14px;
    color: #666;
    text-align: center;
    line-height: 24px;
  }
}
</style>