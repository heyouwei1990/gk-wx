<template>
  <div class="addressEdit">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div class="form-item ">
      <label><i class="required">*</i>详细地址</label>
      <div class="isLink" @click="openMap">{{form.FullAddress}}</div>
    </div>
    <div class="form-item">
      <label>门牌号</label>
      <input type="text" v-model.trim="form.Address" class="input" placeholder="门牌号">
    </div>
    <div class="form-item">
      <label><i class="required">*</i>现场联系人</label>
      <input type="text" v-model.trim="form.ContactsName" class="input" placeholder="现场联系人">
    </div>
    <div class="form-item">
      <label><i class="required">*</i>电话号码</label>
      <input type="tel" v-model.trim="form.ContactsPhone" class="input" placeholder="电话号码">
    </div>
    <button class="btn-primary" @click="submit">保存</button>
  </div>
</template>
<script>
import validate from '@/common/validate.js'
import {
  AddJobAddress,
  UpdateJobAddress,
} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  data(){
    return{
      title:'新增地址',
      form:{
        CityName:'',
        Lng:'',
        Lat:'',
        Address:'',
        ContactsName:'',
        ContactsPhone:'',
        FullAddress:'',
      },
      editId:'',
    }
  },
  computed:{
    ...mapState({
      userData:state=>state.userData,
    })
  },
  watch:{
    '$route'(to,from){
      if(from.path=='/baiduMap' || from.path=='/searchAddress'){
        if(this.$store.state.mapPoint){
          let mapPoint=this.$store.state.mapPoint;
          this.form.Lat=mapPoint.Lat;
          this.form.Lng=mapPoint.Lng;
          this.form.CityName=mapPoint.CityName;
          this.form.FullAddress=mapPoint.FullAddress;
        }
      }
    }
  },
  created() {
    this.pageInit();
  },
  methods: {
    pageInit(){
      let params=this.$route.params;
      if(params.ID){
        this.title="编辑地址";
        this.form={
          CityName:params.CityName,
          Lng:'',
          Lat:'',
          Address:'',
          ContactsName:'',
          ContactsPhone:'',
          FullAddress:'',
        }
        for (const i in this.form) {
          this.form[i]=params[i];
        }
        this.editId=params.ID;
      }else{
        this.title="新增地址";
        this.editId='';
        this.form={
          CityName:'',
          Lng:'',
          Lat:'',
          Address:'',
          ContactsName:'',
          ContactsPhone:'',
          FullAddress:'',
        }
      }
    },
    openMap(){
      let obj={};
      if(this.form.FullAddress){
        obj={
          CityName:this.form.CityName,
          Lat:this.form.Lat,
          Lng:this.form.Lng,
          FullAddress:this.form.FullAddress,
        }
      }
      this.$store.commit('setMapCity',this.form.CityName);
      this.$router.push({
        path:'/baiduMap',
        query:obj
      })
    },
    //提交
    submit(){
      if(this.form.FullAddress==''){
        this.$toast('请选择地址');
        return;
      }
      if(!this.form.ContactsName){
        this.$toast('请输入现场联系人');
        return;
      }
      if(!this.form.ContactsPhone){
        this.$toast('请输入现场联系人手机号');
        return;
      }
      if(!validate.link(this.form.ContactsPhone) && this.form.ContactsPhone!=''){
        this.$toast('手机号格式不正确');
        return;
      }
      let params={
        ...this.form,
        platform:'pcweb',
      }
      if(this.userData && this.userData.UserId){
        params['UserId']=this.userData.UserId;
      }else if(this.userData && this.userData.CompanyId){
        params['CompanyId']=this.userData.CompanyId;
      }else{
        return;
      }
      if(this.editId){
        params['Id']=this.editId;
        UpdateJobAddress(params).then(r=>{
          if(r.Result==1){
            this.$toast.success('修改成功');
            this.$router.go(-1);
          }else{
            this.$toast(r.Message);
          }
        })
      }else{
        AddJobAddress(params).then(r=>{
          if(r.Result==1){
            this.$toast.success('添加成功');
            this.$router.go(-1);
          }else{
            this.$toast(r.Message);
          }
        })
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.addressEdit{
  padding-top: 46px;
  background-color: #fff;
  
  .form-item{
    padding: 0 15px;
    width: 100%;
    position: relative;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #d5d5d5;
    label {
      font-size:14px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
  }
  .input{
    // width: 100%;
    min-width: 100px;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #333;
    // border: 1px solid #d5d5d5;
    text-align: right;
    padding-left: 20px;
  }
  .isLink{
    flex: 1;
    min-width: 100px;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #333;
    text-align: right;
    padding-left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    padding-right: 12px;
    &:after{
      content:'\F00A';
      font-family: vant-icon;
      font-size: 16px;
      color: #666;
      position: absolute;
      right:-4px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .btn-primary{
    display: block;
    width: 50%;
    margin: 60px auto 0;
    text-align: center;
    line-height: 44px;
    height: 44px;
    background-color: #f75959;
    color: #fff;
    font-size: 14px;
  }
}
</style>