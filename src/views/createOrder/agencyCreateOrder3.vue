<template>
  <div class="createOrder">
    <van-nav-bar
      title="发布工单"
      left-arrow
      fixed
      :z-index="10"
      @click-left="$router.go(-1)"
    />
    <div class="form-item no-border" v-if="showItems.IsJobTitle!=0 ">
      <div class="label">工单名称<i class="required" v-if="showItems.IsJobTitle==1 ">*</i></div>
      <input class="input" v-model.trim="form.JobTitle" type="text" :placeholder="orderPlaceholder" />
    </div>
    <div class="divide"></div>
    <div class="form-item" v-if="showItems.IsJobAddress !=0 ">
      <div class="label">工单地址<i class="required" v-if="showItems.IsJobAddress==1 ">*</i></div>
      <!-- <span class="btn-address" @click="getAddressList">地址簿</span> -->
      <div class="input address-input is-link"  @click="openMap">
        <span class="placeholder" v-if="form.FullAddress==''">详细地址</span>
        {{form.FullAddress}}
      </div>
    </div>
    <div class="form-item no-border" v-if="showItems.IsJobAddress!=0 ">
      <input class="input" v-model.trim="form.Address" type="text" placeholder="门牌号" />
    </div>
    <div class="divide"></div>
    <div class="form-item" v-if="showItems.IsContacts!=0 ">
      <div class="label">现场联系人<i class="required" v-if="showItems.IsContacts==1 ">*</i></div>
      <input class="input" v-model.trim="form.LinkMan" type="text" placeholder="即服务签字验收人，请谨慎填写" />
    </div>
    <div class="form-item no-border" v-if="showItems.IsContactsPhone !=0">
      <div class="label">联系电话<i class="required" v-if="showItems.IsContactsPhone==1">*</i></div>
      <input class="input" v-model.trim="form.HandSet" type="tel" placeholder="联系电话" />
    </div>
    <div class="divide"></div>
    <div class="form-item" v-if="showItems.IsEngineerToDoorName!=0 ">
      <div class="label">工程师以何名义上门<i class="required" v-if="showItems.IsEngineerToDoorName==1 ">*</i></div>
      <input class="input" v-model.trim="form.EngineerToDoorName" type="text" placeholder="工程师上门名义" />
    </div>
    <div class="form-item" v-if="showItems.IsExecStartDate !=0">
      <div class="label">最早上门时间<i class="required" v-if="showItems.IsExecStartDate==1">*</i></div>
      <div class="input is-link" @click="callDate(1)">
        <span class="placeholder" v-if="form.ExecStartDate==''">最早上门时间</span>
        {{form.ExecStartDate}}
      </div>
    </div>
    <div class="form-item" v-if="showItems.IsExecEndDate !=0">
      <div class="label">最晚上门时间<i class="required" v-if="showItems.IsExecEndDate==1">*</i></div>
      <div class="input is-link" @click="callDate(2)">
          <span class="placeholder" v-if="form.ExecEndDate==''">最晚上门时间</span>
          {{form.ExecEndDate}}
        </div>
    </div>
    <div class="form-item no-border" v-if="showItems.IsServiceDayCount !=0">
      <div class="label">预计服务天数<i class="required" v-if="showItems.IsServiceDayCount==1">*</i></div>
      <input class="input" v-model.number="form.ServiceDayCount" type="text" placeholder="预计服务天数" />
    </div>
    <div class="divide"></div>
    <div class="form-item no-border" v-if="showItems.IsInternalJobNo !=0">
      <div class="label">内部工单号<i class="required" v-if="showItems.IsInternalJobNo ==1">*</i></div>
      <input class="input" v-model.trim="form.SiemensTicketNumber" type="text" placeholder="内部工单号" />
    </div>
    <div class="form-item" v-if="(showItems.IsBudgetRanger !=0 && !isProject) || isProject">
      <div class="label">预算总价<i class="required" v-if="(showItems.IsBudgetRanger !=0 && !isProject) || isProject">*</i></div>
      <input class="input" v-model.number="form.MinPrice" type="number" placeholder="" />
      <span class="line">至</span>
      <input class="input" v-model.number="form.MaxPrice" type="number" placeholder="" />
    </div>
    <!-- <div class="form-item" v-if="showItems.IsEndDate !=0 && jobType==1"> -->
    <div class="form-item no-border" v-if="showItems.IsEndDate !=0">
      <div class="label">招标截止日<i class="required" v-if="showItems.IsEndDate ==1">*</i></div>
      <div class="input is-link" @click="callDate(3)">
          <span class="placeholder" v-if="form.EndDate==''">招标截止日期</span>
          {{form.EndDate}}
        </div>
    </div>
    <template v-for="(item,index) in extraItems">
      <div class="form-item" v-if="showItems.ExtendFieldList[index].FieldType!=0" :key="index">
        <div class="label">
          {{showItems.ExtendFieldList[index].FieldName }}
            <i class="required" v-if="showItems.ExtendFieldList[index].FieldType==1">*</i>
        </div>
        <input class="input" v-model="item.FieldValue" type="text" placeholder />
      </div>
    </template>
    <div class="divide"></div>
    <div class="urgent-item">
      <div class="flex">
        <span class="label">急单服务<i class="tips" @click="$router.push('/urgentRule')">?</i></span>
        <span class="origin-price">¥{{showItems.UrgentTotalAmount}}</span>
        <span class="current-price">¥{{showItems.UrgentAmount}}</span>
        <van-checkbox shape="square" checked-color="#00A0E9" icon-size="18px" v-model.trim="form.IsUrgent"></van-checkbox>
      </div>
      <p class="desc">速派承诺2小时为您的订单推荐工程师，如推荐不成功退回急单费用</p>
    </div>
    <div class="btn-box">
      <button class="btn-primary" @click="next">下一步</button>
    </div>
    <van-calendar 
      v-model="showDate"
      :round="false"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirmDate"
    />
    <van-popup class="deposit-dialog" v-model="showDeposit" position="bottom">
      <template v-if="depositData">
        <h3 class="title">预付押金</h3>
        <div class="module-item">
          <div class="flex">
            <span class="label">服务押金：</span>
            <div class="value price">¥{{depositData.DepositAmount | formatPrice}}</div>
          </div>
        </div>
        <ul class="bill-list">
          <li v-for="(item,index) in depositData.Lines" :key="'deposit'+index">
            <div class="flex">
              <span class="time">{{item.Date}}</span>
              <span class="price">服务价格：<i>¥{{item.Money}}</i></span>
            </div>
            <div class="flex">
              <span>{{item.HolidayType | formatDay}}</span>
              <span>工程师{{item.WorkerNum }}人</span>
            </div>
          </li>
        </ul>
        <div class="module-item">
          <div class="flex">
            <span class="label">路费押金（{{depositData.WorkDay}}天）：</span>
            <div class="value price">¥{{depositData.TraficAmount | formatPrice}}</div>
          </div>
          <div class="flex remark">
            <span class="label">备注:</span>
            <div class="value">工单默认需每天多收取100元作为路费押金</div>
          </div>
        </div>
        <div class="module-item">
          <div class="flex">
            <span class="label">总计：</span>
            <div class="value price">¥{{depositData.JobTotalAmount| formatPrice}}</div>
          </div>
          <div class="flex remark">
            <span class="label">备注：</span>
            <div class="value">最终根据工单最终费用来结算，多退少补</div>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn-primary" @click="$router.push({path:'/payDeposit',query:{payId}})">确定</div>
        </div>
      </template>
    </van-popup>
  </div>
</template>
<script>
import {
  GetAccountJobConfig,
  AddJobBase,
  GetAreas,
  GetJobDepositDetail,
} from "@/common/api.js";
import { FormatTime } from "@/common/util.js";
import validate from "@/common/validate.js";
import {mapState} from 'vuex'
export default {
  name:'AgencyCreateOrder2',
  data() {
    return {
      showItems: "",
      form: {
        JobTitle: "",
        FullAddress:'',
        Address: "",
        LinkMan: "",
        HandSet: "",
        EngineerToDoorName:"",
        ExecStartDate: "",
        ExecEndDate: "",
        SecondLinkMan: "",
        SecondHandSet: "",
        SiemensTicketNumber: "",
        CityName:'',
        AddressID: 0,
        Lat:'',
        Lng:'',
        MinPrice:'',
        MaxPrice:'',
        EndDate:'',
        ExtendValueList:[],
        IsUrgent:false,
        ServiceDayCount:'',
      },
      extraItems:[],//额外添加的配置
      duration: "",
      provinceList:[],//省份列表
      showDate: false,
      showDeposit:false,
      dateId: "",
      jobType: 1,
      jobId:'',
      districtText:'',
      depositData:null,
      payId:'',//支付id
      userCode:'',
      defaultTitle:'',
      orderPlaceholder:'',//工单名提示
      isProject:false,//B2B项目工单?
    };
  },
  filters:{
    formatDay(value){
      let day='';
      switch (value) {
        case 1:
          day='工作日'
          break;
        case 2:
          day='周末'
          break;
        case 3:
          day='节假日'
          break;
      }
      return day;
    }
  },
  computed: {
    maxDate(){
      if(this.form.ExecEndDate && this.dateId==1){
        let arr=this.form.ExecEndDate.split('-');
        return new Date(arr[0],arr[1]-1,arr[2]);
      }else if(this.form.ExecEndDate && this.dateId==3){
        let arr=this.form.ExecEndDate.split('-');
        return new Date(arr[0],arr[1]-1,arr[2]);
      }else{
        let year=new Date().getFullYear() + 10;
        let month=new Date().getMonth() + 1;
        let date=new Date().getDate();
        return new Date(year,month,date);
      }
    },
    minDate(){
      if(this.form.ExecStartDate && this.dateId==2){
        let arr=this.form.ExecStartDate.split('-');
        return new Date(arr[0],arr[1]-1,arr[2]);
      }else{
        return new Date();
      }
    },
    ...mapState({
      userData:state=>state.userData,
      createConfig:state=>state.createConfig,
    })
  },
  watch: {
    $route(to,from){
      if(from.path=='/searchAddress' || from.path=='/baiduMap'){
        if(this.$store.state.mapPoint){
          var mapPoint=this.$store.state.mapPoint;
          this.form.Lat=mapPoint.Lat;
          this.form.Lng=mapPoint.Lng;
          this.form.CityName=mapPoint.CityName;
          this.form.FullAddress=mapPoint.FullAddress;
        }
      }
    },
  },
  created() {
    this.init();
  },
  activated() {
    this.jobType=Number(this.$route.query.jobType);
    this.jobId=Number(this.$route.query.jobId);
    this.userCode=this.$route.query.userCode;
    this.isProject=this.$route.query.isProject;
    this.defaultTitle=decodeURIComponent(this.$route.query.jobTitle);
    this.orderPlaceholder='例如：'+this.defaultTitle;
  },
  methods: {
    init() {
      //获取页面配置
      let type='';
      switch (Number(this.$route.query.jobType)) {
        case 6:
          type=2;
          break;
        case 8:
          type=3;
          break;
        default:
          type=1;
          break;
      }
      GetAccountJobConfig({
        PlatformType: type,
        UserCode: this.$route.query.userCode,
        platform:'pcweb',
      }).then(r => {
        if (r.Result == 1) {
          this.showItems = r.Data;
          //新选项
          var arr=[];
          if(this.showItems && this.showItems.ExtendFieldList.length>0){
            this.showItems.ExtendFieldList.forEach(item => {
              var obj={};
              obj['FieldId']=item.ID;
              obj['FieldValue']='';
              arr.push(obj);
            });
          }
          this.extraItems=arr;
        }
      });
      GetAreas().then(r=>{
        if(r.Result==1){
          this.provinceList=r.Data.province || [];
        }else{
          this.$toast(r.Message);
        }
      });
    },
    //唤起日历插件
    callDate(id) {
      if(id==2 && this.form.ExecStartDate==''){
        this.$toast('请先选择执行开始时间');
        return;
      }
      this.dateId = id;
      this.showDate = true;
    },
    //选中日期
    confirmDate(date) {
      if (this.dateId == 1) {
        this.form.ExecStartDate = FormatTime(date, "yyyy-MM-dd");
        if(FormatTime(new Date(),'yyyy-MM-dd')==this.form.ExecStartDate){
          this.$dialog.alert({
            message:'工业速派将为向您服务的工程师购买商业保险，该商业保险系隔日生效，如您于商业保险生效前强行要求施工而给工程师、您及其工作人员或第三方造成人身及财产损失的，由您自行承担全部责任！'
          });
        }
      }
      if (this.dateId == 2) {
        this.form.ExecEndDate = FormatTime(date, "yyyy-MM-dd");
      }
      if (this.dateId == 3) {
        this.form.EndDate= FormatTime(date, "yyyy-MM-dd");
      }
      this.showDate = false;
    },
    //打开地图
    openMap(){
      let obj={
        CityName:this.form.CityName,
        Lat:this.form.Lat,
        Lng:this.form.Lng,
        FullAddress:this.form.FullAddress,
      }
      this.$store.commit('setMapCity',obj.CityName);
      this.$router.push({path:'/baiduMap',query:obj})
    },
    //获取押金明细
    getDeposit(){
      GetJobDepositDetail({JobId:this.jobId}).then(r=>{
        if(r.Result==1){
          this.depositData=r.Data.B2BStandardJobDeposit;
          this.showDeposit=true;
          this.$commit('setProductPicker',null);
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //下一步
    next() {
      let items={...this.showItems};
      let form={...this.form};
      if(items.IsJobTitle==1 && form.JobTitle==''){
        form.JobTitle=this.defaultTitle;
      }
      if(items.IsJobAddress==1 && form.FullAddress==''){
        this.$toast('请选择工单地址');
        return;
      }
      if(items.IsContacts==1 && form.LinkMan==''){
        this.$toast('请输入现场联系人');
        return;
      }
      if(items.IsContactsPhone==1 && form.HandSet==''){
        this.$toast('请输入联系人电话');
        return;
      }
      if(items.IsContactsPhone!=0 && (!validate.link(form.HandSet) && form.HandSet!='')){
        this.$toast('联系电话格式不正确');
        return;
      }
      if(items.IsEngineerToDoorName==1 && form.EngineerToDoorName==''){
        this.$toast('请输入工程师上门名义');
        return;
      }
      if(items.IsSecondLinkMan==1 && form.SecondLinkMan==''){
        this.$toast('请输入现场备用联系人');
        return;
      }
      if(items.IsSecondHandSet==1 && form.SecondHandSet==''){
        this.$toast('请输入备用联系人电话');
        return;
      }
      if(items.IsSecondHandSet!=0 && (!validate.link(form.SecondHandSet) && form.SecondHandSet!='')){
        this.$toast('现场联系人电话格式不正确');
        return;
      }
      if(items.IsExecStartDate==1 && form.ExecStartDate==''){
        this.$toast('请输入最早上门时间');
        return;
      }
      if(items.IsExecEndDate==1 && form.ExecEndDate==''){
        this.$toast('请输入最晚上门时间');
        return;
      }
      if(items.IsServiceDayCount==1  && form.ServiceDayCount==0){
        this.$toast('请输入预计服务天数');
        return;
      }
      if(items.IsInternalJobNo==1 && form.SiemensTicketNumber==''){
        this.$toast('请输入内部工单号');
        return;
      }
      if(((items.IsBudgetRanger ==1 && !this.isProject) || this.isProject) && (form.MinPrice=='' || form.MaxPrice=='')){
        this.$toast('请输入预算范围');
        return;
      }
      if(((items.IsBudgetRanger ==1 && !this.isProject) || this.isProject) &&(!validate.positiveInt(Number(form.MinPrice)) || !validate.positiveInt(Number(form.MaxPrice)))){
        this.$toast('预算总价为正整数！');
        return;
      }
      if(((items.IsBudgetRanger ==1 && !this.isProject) || this.isProject) && Number(form.MinPrice)<100){
        this.$toast('最低预算不得低于100元！');
        return;
      }
      if(((items.IsBudgetRanger ==1 && !this.isProject) || this.isProject) && Number(form.MaxPrice)<Number(form.MinPrice)){
        this.$toast('最高预算不得低于最低预算！');
        return;
      }
      if(items.IsEndDate ==1 && this.jobType==1 && form.EndDate==''){
        this.$toast('请选择招标截止日期');
        return;
      }
      //必填新选项
      for (let i = 0; i < items.ExtendFieldList.length; i++) {
        if(items.ExtendFieldList[i].FieldType==1 && this.extraItems[i].FieldValue==''){
          this.$toast('请输入'+items.ExtendFieldList[i].FieldName);
          return;
        }
      }
      // if(form.IsAgree==0){
      //   this.$toast('请阅读并同意《工业速派在线技术服务发布规则》');
      //   return;
      // }
      // form.IsAgree=this.form.IsAgree?1:0;
      let params={
        ...form,
        UserCode:this.userCode,
        JobId:this.jobId,
        JobType:this.jobType,
        DisposeId:items.ID,
        IsAgree:1,
        ExtendValueList:this.extraItems,
      }
      AddJobBase(params).then(r=>{
        if(r.Result==1){
          this.$toast.success('代填成功');
          this.$store.commit('setProductPicker',null);
          this.$router.push({path:'/createSuccess',query:{jobId:this.jobId,from:'agency'}})
        }else{
          this.$toast(r.Message);
        }
      })
      
    },
  }
};
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.createOrder {
  background-color: #f9f9f9;
  padding-top: 56px;
  .divide{
    width: 100%;
    height: 10px;
    background-color: #f9f9f9;
  }
  .form-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fff;
    padding-left: 15px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
    }
    
    .input{
      flex: 1;
      min-width: 60px;
      padding-right: 15px;
      color: #333;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      text-align: right;
      padding-left: 10px;
    }
    .textarea{
      width: 100%;
      padding-right: 15px;
      color: #333;
      height: 40px;
      line-height: 20px;
      font-size: 14px;
      margin-bottom: 15px;
      &.with-marks{
        margin-bottom: 4px;
      }
    }
    .is-link{
      min-width: 100px;
      height: 44px;
      color: #333;
      line-height: 44px;
      font-size: 14px;
      position: relative;
      padding-right: 30px;
      &:after{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        content:"\F00A";
        font-family: 'vant-icon';
        font-size: 16px;
        color: #333;
      }
    }
  }
  .placeholder{
    color: #999;
  }
  .address-input{
    padding-right: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn-address{
    width: 50px;
    height: 20px;
    margin-left: 10px;
    white-space: nowrap;
    font-size: 12px;
    color: #f75959;
    line-height: 18px;
    border: 1px solid #f75959;
    border-radius: 20px;
    text-align: center;
  }
  .line {
    padding-left: 6px;
    padding-right: 6px;
    color: #999;
    font-size: 14px;
  }
  .protocol-wrapper{
    padding: 18px 15px ;
    background-color: #fff;
    .agree {
      color: #666;
      font-size: 14px;
    }
    .protocol {
      font-size: 14px;
      color: #ff3838;
    }
  }
  
  .btn-box{
    padding: 15px 15px 32px;
    background-color: #fff;
    .btn-primary{
      text-align: center;
      line-height: 44px;
      font-size: 14px;
      width: 100%;
      height: 44px;
    }
  }
  .address-hd{
    padding: 10px 15px;
    font-size: 16px;
    color: #333;
    line-height: 2;
    font-weight: 500;
    border-bottom: 1px solid #d5d5d5;
  }
  .address-list{
    // width: 90vw;
    >li{
      padding: 10px 15px;
      background-color: #fff;
      border-bottom: 1px solid #d5d5d5;
    }
    .flex{
      display: flex;
      margin-bottom: 5px;
    }
    .name{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      flex:1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .phone{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      margin-left: 20px;
    }
    .detail{
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      word-break: break-all;
    }
  }
  .no-border{
    border-bottom:0 !important;
  }
  .urgent-item{
    background-color: #fff;
    padding: 10px 15px;
    position: relative;
    .flex{
      display: flex;
      align-items: center;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      flex: 1;
    }
    .tips{
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: middle;
      border-radius: 50%;
      margin-left: 6px;
      text-align: center;
      line-height: 12px;
      color: #fff;
      font-size: 10px;
      background-color: $primary;
      margin-top: -3px;
    }
    .origin-price{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
      font-weight: 500;
      font-family: $number;
      margin-right: 8px;
      text-decoration: line-through;
    }
    .current-price{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
      font-weight: 600;
      font-family: $number;
      margin-right: 8px;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
  }
}
.deposit-dialog{
  .title{
    text-align: center;
    font-size: 16px;
    color: #333;
    line-height: 44px;
    height: 44px;
    font-weight: bold;
  }
  .module-item{
    background-color: #f9f9f9;
    padding: 10px 15px;
    margin-bottom: 5px;
  }
  .flex{
    @include flex;
  }
  .label{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    font-weight: 500;
  }
  .value{
    font-size: 14px;
    line-height: 24px;
    &.price{
      font-weight: 500;
      color: $primary;
      font-family: $number;
    }
  }
  .remark{
    .label{
      color: #666;
      font-size: 12px;
    }
    .value{
      color: #666;
      font-size: 12px;
    }
  }
  .btn-group{
    padding: 20px 15px 10px;
    .btn-primary{
      text-align: center;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
    }
  }
  .bill-list{
    padding: 0 15px;
    max-height: 204px;
    overflow-y: auto;
    >li{
      @include bb;
      padding: 10px 0;
      span{
        font-size: 12px;
        color: #333;
        line-height: 24px;
      }
      .time{
        font-weight: bold;
        font-size: 14px;
      }
      .price{
        font-size: 14px;
        color: #666;
        >i{
          color: #333;
          font-weight: 500;
          font-family: $number;
        }
      }
    }
  }
}
</style>