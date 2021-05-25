<template>
  <div class="evaluatePage">
    <van-nav-bar
      title="评价"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="comment-item overall-item">
        <span class="label">总体评价：</span>
        <van-radio-group class="overall" v-model="form.FwpjGrade" direction="horizontal">
          <van-radio name="好">好</van-radio>
          <van-radio name="一般">一般</van-radio>
          <van-radio name="差">差</van-radio>
        </van-radio-group>
      </div>
      <div class="comment-item">
        <span class="label">响应速度：</span>
        <van-rate v-model="form.XysdNum" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.XysdNum | formatEvaluate}}</span>
      </div>
      <div class="comment-item">
        <span class="label">技术能力：</span>
        <van-rate v-model="form.JlnlNum" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.JlnlNum | formatEvaluate}}</span>
      </div>
      <div class="comment-item">
        <span class="label">服务态度：</span>
        <van-rate v-model="form.FwyyNum" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.FwyyNum | formatEvaluate}}</span>
      </div>
      <div class="question-item">
        <span class="label">1、S2S工程师提供的服务报告内容是否属实？</span>
        <div class="radio-wrap">
          <van-radio-group v-model="form.Q1" direction="horizontal">
            <van-radio name="是" >是</van-radio>
            <van-radio name="否" >否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="question-item">
        <span class="label">2、此次任务派发的问题是否得到解决？</span>
        <div class="radio-wrap">
          <van-radio-group v-model="form.Q2" direction="horizontal">
            <van-radio name="是" >是</van-radio>
            <van-radio name="否" >否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="question-item">
        <textarea class="comment-desc" v-model="form.ConmendContent" placeholder="请留下您的文字评价，我们将根据您的评价，持续改善我们的服务"></textarea>
      </div>
      <button class="btn-primary" @click="submit">提交</button>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {SubmitJobServiceCommend} from '@/common/api.js'
export default {
  name:'Evaluate',
  data(){
    return{
      form:{
        FwpjGrade:'',
        XysdNum:0,
        JlnlNum:0,
        FwyyNum:0,
        Q1:'',
        Q2:'',
        ConmendContent:''
      },
      jobNo:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  filters:{
    
    formatEvaluate(value){
      let str='';
      switch (value) {
        case 1:
          str='很差';
          break;
        case 2:
          str='较差';
          break;
        case 3:
          str='一般';
          break;
        case 4:
          str='满意';
          break;
        case 5:
          str='很满意';
          break;
      }
      return str;
    }
  },
  created() {
    this.jobNo=this.$route.query.jobNo;
  },
  methods: {
    submit(){
      if(this.form.FwpjGrade===''){
          this.$toast('请选择总体评价！');
          return;
      }
      if(!this.form.XysdNum){
          this.$toast('请评价响应速度！');
          return;
      }
      if(!this.form.JlnlNum){
          this.$toast('请评价技能水平！');
          return;
      }
      if(!this.form.FwyyNum){
          this.$toast('请评价服务态度！');
          return;
      }
      if(this.form.Q1===''){
          this.$toast('请选择报告是否真实！');
          return;
      }
      if(this.form.Q2===''){
          this.$toast('请选择是否已解决问题！');
          return;
      }
      let params={
        ...this.form,
        UserCode:this.userData.UserCode,
        JobNo:this.jobNo,
      }
      SubmitJobServiceCommend(params).then(r=>{
        this.$toast(r.Message);
        if(r.Result==1){
          this.$router.go(-1);
        }
      })
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.evaluatePage{
  padding-top: 56px;
  background-color: #fff;
  .comment-item{
    font-size: 14px;
    line-height: 24px;
    display: flex;
    align-items: center;
    padding: 6px 15px;
    &.overall-item{
      .label{
        color: #333;
      }
    }
    .label{
      color: #666;
    }
    .evaluate-text{
      font-size: 12px;
      color: #999;
    }
    .overall{
      .van-radio{
        display: block;
        
      }
      .van-radio__icon{
        display: none;
      }
      .van-radio__icon--checked+.van-radio__label{
        color: #fff;
        background-color: $primary;
        border-color: $primary;
      }
      .van-radio__label{
        display: block;
        color: #333;
        margin-left: 0;
        line-height: 18px;
        width: 50px;
        padding: 0 10px;
        @include radius(20px);
        background-color: #fff;
        height: 20px;
        font-size: 12px;
        text-align: center;
        border: 1px solid #e5e5e5;
      }
    }
  }
  .question-item{
    padding: 6px 15px;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 10px;
    .label{
      display: block;
      color: #666;
      margin-bottom: 4px;
    }
    .radio-wrap{
      padding-left: 24px;
    }
    .van-radio__icon{
      font-size: 16px;
    }
    .van-radio__icon--checked{
      .van-icon-success{
        border: 1px solid $primary;
        padding: 2px;
        background-clip: content-box;
        background-color: $primary;
        &:before{
          visibility: hidden;
        }
      }
    }
    
    .van-radio__label{
      color: #999;
    }
  }
  .comment-desc{
    font-size: 14px;
    color: #666;
    line-height: 20px;
    border: 1px solid #e5e5e5;
    width: 100%;
    height: 100px;
    padding: 6px 10px;
  }
  .btn-primary{
    font-size: 16px;
    width: 160px;
    display: block;
    margin: 30px auto;
    height: 40px;
    line-height: 40px;
  }
}
</style>