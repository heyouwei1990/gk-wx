<template>
  <div class="addAccount">
    <van-nav-bar
      title="新增账号"
      fixed
      @click-left="$router.go(-1)"
    >
      <template #left>
        <van-icon name="cross" size="18" />
      </template>
    </van-nav-bar>
    <div class="form-item">
      <div class="label">账号类型：</div>
      <div class="picker" @click="showType=true">
        <span class="placeholder" v-if="!accountTypeName">选择账号类型</span>
        {{accountTypeName}}
      </div>
    </div>
    <div class="form-item" v-if="userData">
      <div class="label">用户名：</div>
      <input class="input" :value="userData.LoginName" type="text" readonly>
    </div>
    <div class="form-item">
      <div class="label">账号：</div>
      <input class="input" type="text" v-model="account" :placeholder="accountTypeId==1?'输入银行账号':'输入账号'">
    </div>
    <template v-if="accountTypeId==1">
      <div class="form-item">
        <div class="label">开户银行：</div>
        <div class="picker" @click="$router.push('/searchBank')">
          <span class="placeholder" v-if="!bankName">选择开户银行</span>
          {{bankName}}
        </div>
      </div>
    </template>
    <div class="form-item">
      <van-checkbox v-model="isDefault" shape="square" icon-size="16px">设置为默认账号</van-checkbox>
    </div>
    <button class="btn-primary" @click="sunmit">提交</button>
    <van-popup v-model="showType" position="bottom">
      <van-picker
        show-toolbar
        value-key="text"
        :columns="accountTypes"
        @confirm="pickType"
        @cancel="showType=false"
      />
    </van-popup>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {SureAddBankAccount,AddCompanyBankCardInfo,AddCollectionAccount} from '@/common/api.js'
export default {
  name:'AddAccount',
  data(){
    return{
      accountTypeName:'',
      accountTypeId:'',
      account:'',
      bankName:'',
      userInfo:'',
      accountType:1,
      isDefault:false,
      showType:false,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      bank:state=>state.bank,
    }),
    accountTypes(){
      if(this.accountType==1){
        return[{text:'支付宝',value:3},{text:'银行卡',value:1}]
      }else{
        return[{text:'银行卡',value:1}]
      }
    }
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/addAccount' && from.path=='/searchBank'){
        // console.log(this.bank);
        if(this.bank){
          this.bankName=this.bank.CodeName1;
        }
      }
      if(to.path=='/addAccount' && from.path=='/accountManage'){
        this.$router.go(0);
      }
    }
  },
  mounted() {
    if(this.userData && this.userData.UserCode){
      if(this.userData.UserCode.indexOf('e')===0){
        this.userInfo=this.userData.CompanyId+'_2';
        this.accountType=2;
      }else{
        this.userInfo=this.userData.UserId+'_1'
        this.accountType=1;
      }
    }
  },
  methods: {
    pickType(data){
      this.accountTypeName=data.text;
      this.accountTypeId=data.value;
      this.showType=false;
    },
    sunmit(){
      if(this.accountTypeId==''){
        this.$toast('请选择账号类型！');
        return;
      }
      if(this.account==''){
        this.$toast('请输入账号！');
        return;
      }
      if(this.bankName=='' && this.accountTypeId==1){
        this.$toast('请选择开户银行！');
        return;
      }
      if(this.accountType==1){
        this.addPersonalAccount();
      }else{
        this.addCompanyAccount();
      }
      
    },
    //添加企业账号
    addCompanyAccount(){
      let params={
        BankCardNo:this.account,
        BankName:this.bankName,
        IsDefault:this.isDefault,
        CompanyID:this.userData.CompanyId
      }
      AddCompanyBankCardInfo(params).then(r=>{
        if(r.Result==1){
          this.$router.go(-1);
        }else{
          this.onConfirm(r.Data.ResultCode,r.Data.BankName)
        }
      })
    },
    //添加个人账号
    addPersonalAccount(){
      let params={
        CollectionAccount:this.account,
        CollectionAccountType:this.accountTypeId,
        IsDefault:this.isDefault,
        UserCode:this.userData.UserCode
      }
      //如果添加的是银行账号，则传银行名称
      if(this.accountTypeId==1){
        params['CollectionAccountName']=this.bankName;
      }
      AddCollectionAccount(params).then(r=>{
        if(r.Result==1){
          this.$router.go(-1);
        }else{
          this.onConfirm(r.Data.ResultCode,r.Data.BankName);
        }
      })
    },
    //提交银行卡账号异常提示
    onConfirm(code=1,bankname=''){
      let msg='',cancelBtn='',confirmBtn='';
      switch (code) {
        case 1:
          //卡号异常
          msg=`请确认您添加的银行卡信息：开户银行${this.bankName},卡号${this.account}的银行卡。若填写错误，可能导致提现/退款不成功。`;
          cancelBtn='返回修改';
          confirmBtn='确认无误';
          break;
        case 2:
          //是信用卡
          msg=`系统检测到您${this.bankName},卡号${this.account}的银行卡为信用卡。速派平台不支持提现/退款至信用卡，如您确认非信用卡，可直接添加。`;
          cancelBtn='返回修改';
          confirmBtn='确认无误';
          break;
        case 3:
          //开户行异常
          msg=`系统检测到您${this.bankName},卡号${this.account}的银行卡开户银行为${bankname}，是否需要为您变更为${bankname}`;
          cancelBtn='返回修改';
          confirmBtn='确认无误';
          break;
      }
      this.$dialog.confirm({
        message:msg,
        confirmButtonText:confirmBtn,
        cancelButtonText:cancelBtn,
      }).then(()=>{
        SureAddBankAccount({
          BankName:code==3?bankname:this.bankName,
          BankAccount:this.account,
          UserCode:this.userData.UserCode
        }).then(r=>{
          if(r.Result==1){
            this.$router.go(-1);
          }else{
            this.$toast(r.Message);
          }
        })
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.addAccount{
  min-height: 100vh;
  background-color: #fff;
  padding-top: 46px;
  .form-item{
    padding: 20px 15px 0;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .picker{
      position: relative;
      width: 100%;
      height: 40px;
      border: 1px solid #e5e5e5;
      padding: 8px 50px 8px 10px;
      font-size: 14px;
      color: #333;
      line-height: 22px;
      &:after{
        content:'';
        position: absolute;
        right: 10px;
        top: 50%;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-top: 8px solid #e5e5e5;
        margin-top: -4px;
      }
    }
    .input{
      display: block;
      width: 100%;
      height: 40px;
      border: 1px solid #e5e5e5;
      padding: 8px 50px 8px 10px;
      font-size: 14px;
      color: #333;
      line-height: 22px;
      &:read-only{
        background-color: #f9f9f9;
      }
    }
    .van-checkbox{
      font-size: 14px;
      color: #666;
    }
  }
  .btn-primary{
    width: 160px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    display: block;
    margin: 60px auto 20px;
  }
}
</style>