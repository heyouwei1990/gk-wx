<template>
  <div class="biddingPage">
    <van-nav-bar
      title="投标"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div class="form-item">
      <div class="label">报价</div>
      <input class="input" type="number">
      <p class="desc">注：扣除6%的税点之后，您实际可得金额为<i class="price">￥0.00</i>，企业用户需向工控速派开具增值税专用发票。如有疑问，请联系客服。</p>
    </div>
    <div class="form-item">
      <div class="label">解决方案</div>
      <textarea class="textarea" placeholder="您认为的故障点和解决方案"></textarea>
    </div>
    <div class="form-item">
      <div class="label">补仓文档</div>
      <van-uploader 
        :after-read="afterRead" 
        :before-read="beforeRead"
        :max-size="3*1024*1024"
        :max-count="3"
      >
        <i class="icon-file"></i>
      </van-uploader>
      <p class="desc">注：最多可添加三个附件，每个附件不超过3MB，格式为：jpg/gif/png/rar/doc/pdf。</p>
    </div>
    <button class="btn-primary">提交</button>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {FileUpload} from '@/common/api.js'
export default {
  name:'Bidding',
  data(){
    return{
      form:{

      }
    }
  },
  methods: {
    beforeRead(file) {
      var limit=['jpg','png','gif','rar','doc','pdf'];
      let arr=file.name.split('.');
      var index=limit.indexOf(arr[arr.length-1]);
      if(index==-1){
        this.$toast('上传文件格式不正确！');
        return false;
      }
      return true;
    },
    afterRead(file){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(r=>{
        if(r.Result==1){
          this.form.Logo=r.Data[0].imgUrl;
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.biddingPage{
  min-height: 100vh;
  background-color: #fff;
  padding-top: 46px;
  .form-item{
    padding: 0 15px;
    margin-bottom: 15px;
    .label{
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 40px;
      height: 40px;
    }
    .input{
      width: 100%;
      border: 1px solid #e5e5e5;
      color: #333;
      font-size: 14px;
      height: 44px;
      padding: 10px;
      line-height: 22px;
    }
    .textarea{
      width: 100%;
      border: 1px solid #e5e5e5;
      color: #333;
      font-size: 14px;
      height: 100px;
      padding: 10px;
      line-height: 22px;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .price{
      color: $primary;
    }
    .icon-file{
      width: 80px;
      height: 80px;
      border: 1px solid #e5e5e5;
      display: block;
      position: relative;
      &:after,&:before{
        content:'';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
        background-color: #e5e5e5;
      }
      &:before{
        width: 50px;
        height: 2px;
      }
      &:after{
        width: 2px;
        height: 50px;
      }
    }
  }
  .btn-primary{
    display: block;
    width: 160px;
    margin: 40px auto;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
}
</style>