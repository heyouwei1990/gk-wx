<template>
  <div class="createOrder">
    <van-nav-bar
      title="发布工单"
      left-arrow
      fixed
      :z-index="10"
      @click-left="$router.go(-1)"
    />
    <template  v-if="showItems.IsProductCategory!=0">
      <div class="production-module" v-for="(product,idx) in productionInfoList" :key="'productInfo'+idx">
        <div class="module-hd">
          <div class="title">服务产品（{{idx+1}}）</div>
          <div class="btn-remove" v-if="productionInfoList.length>1" @click="removeProduct(idx)">删除</div>
        </div>
        <div class="module-bd">
          <van-radio-group class="tab-hd" v-model="product.DomainId">
            <van-radio :name="item.DomainId" v-for="item in fieldList" :key="item.DomainId"  @click="pickField(idx)">{{item.DomainName}}</van-radio>
          </van-radio-group>
          <div class="form-item" v-if="showItems.IsServiceStage!=0">
            <div class="label">服务类型 <i class="required" v-if="showItems.IsServiceStage==1">*</i></div>
            <div class="input is-link" @click="pickService(idx)" v-if="product.DomainId!=otherDomainId">
              <i :class="['icon-service',product.IsProject===true?'project':'',product.IsProject===false?'standard':'']" v-if="product.ServiceStageId"></i>
              <span class="placeholder" v-if="product.ServiceStageName==''">请选择服务类型</span>
              {{product.ServiceStageName}}
            </div>
            <input v-else class="input" v-model.trim="product.ServiceStageName" type="text" placeholder="请输入服务类型">
          </div>
          <div class="form-item">
            <div class="label">产品/设备 <i class="required" v-if="showItems.IsProductCategory==1">*</i></div>
            <div class="input is-link" @click="toPick(idx,1)" v-if="product.DomainId!=otherDomainId">
              <span class="placeholder" v-if="product.ProductCategoryName==''">请选择产品/设备</span>
              {{product.ProductCategoryName}}
            </div>
            <input v-else class="input" v-model.trim="product.ProductCategoryName" type="text" placeholder="请输入产品/设备">
          </div>
          <div class="form-item">
            <div class="label">产品品牌 <i class="required">*</i></div>
            <div class="input is-link" @click="toPick(idx,2)" v-if="product.DomainId!=otherDomainId">
              <span class="placeholder" v-if="product.BrandName==''">请选择产品品牌</span>
              {{product.BrandName}}
            </div>
            <input v-else class="input" v-model.trim="product.BrandName" type="text" placeholder="请输入产品品牌">
          </div>
          <div class="form-item">
            <div class="label">产品系列 <i class="required" v-if="showItems.IsSeries==1">*</i></div>
            <div class="input is-link" @click="toPick(idx,3)" v-if="product.DomainId!=otherDomainId">
              <span class="placeholder" v-if="product.SeriesName==''">请选择产品系列</span>
              {{product.SeriesName}}
            </div>
            <input v-else class="input" v-model.trim="product.SeriesName" type="text" placeholder="请输入产品系列">
          </div>
          <div class="form-item no-border" v-if="showItems.IsDeviceCount!=0">
            <div class="label">设备数量 <i class="required" v-if="showItems.IsDeviceCount==1">*</i></div>
            <input class="input" v-model.number="product.DeviceCount" type="number" placeholder="请输入数量">
          </div>
        </div>
      </div>
    </template>
    <div class="btn-add" v-if="showItems.IsProductCategory!=0" @click="insertProduct"><van-icon name="plus" />添加产品信息</div>
    <div class="form-item" v-if="showItems.IsIndustry!=0">
      <div class="label">所属行业 <i class="required" v-if="showItems.IsIndustry ==1">*</i></div>
        <div class="input is-link" @click="showIndustry=true">
          <span class="placeholder" v-if="form.Industry==''">所属行业</span>
          {{form.Industry}}
        </div>
    </div>
    <div class="form-item" v-if="showItems.IsEngineersCount!=0">
      <div class="label">所需工程师数量 <i class="required" v-if="showItems.IsEngineersCount==1">*</i></div>
      <input class="input" v-model.number="form.EngineerCount" type="number" placeholder="请输入数量">
    </div>
    <div class="form-item" v-if="showItems.IsFaults!=0">
      <div class="label">故障现象 <i class="required" v-if="showItems.IsFaults==1">*</i></div>
      <textarea class="textarea" v-model.trim="form.Symptom" placeholder="请输入故障现象"></textarea>
    </div>
    <div class="form-item" v-if="showItems.IsJobDescribe!=0">
      <div class="label">服务需求描述 <i class="required" v-if="showItems.IsJobDescribe==1">*</i></div>
      <textarea class="textarea with-marks" v-model.trim="form.Content" placeholder="请输入服务需求描述"></textarea>
      <!-- <div class="mark-list">
        <span class="mark" v-for="(item,index) in markList" :key="'tag'+index">{{item.TagName}}</span>
      </div> -->
    </div>
    <div class="form-item" v-if="showItems.IsDataUpload!=0">
      <div class="label">现场资料 <i class="required" v-if="showItems.IsDataUpload==1">*</i></div>
      <div class="file-wrap">
        <ul class="img-list">
          <li v-for="(item,index) in fileList" :key="index">
            <van-icon class="icon-close" name="clear" @click="removeImg(index)"/>
            <img v-if="['.jpg','.png','.gif','.jpeg','.PNG','.GIF','.JPG','.JPEG'].indexOf(item.fileExt)>=0" :src="item.imgUrl" @click="preview(item.imgUrl)" alt="">
            <img v-if="['.doc','.docx'].indexOf(item.fileExt)>=0" src="static/image/fileIcon/icon_doc.jpg" alt="">
            <img v-if="['.pdf'].indexOf(item.fileExt)>=0" src="static/image/fileIcon/icon_pdf.jpg" alt="">
            <img v-if="['.zip'].indexOf(item.fileExt)>=0" src="static/image/fileIcon/icon_zip.jpg" alt="">
            <img v-if="['.rar'].indexOf(item.fileExt)>=0" src="static/image/fileIcon/icon_rar.jpg" alt="">
            <img v-if="['.ppt'].indexOf(item.fileExt)>=0" src="static/image/fileIcon/icon_ppt.jpg" alt="">
          </li>
          <li>
            <van-uploader
              v-if="fileList.length<6"
              accept="*.*"
              :max-count="2"
              :before-read="beforeRead"
              :after-read="afterRead"
            />
          </li>
        </ul>
        <p class="tips">注：请上传现场照片以及相应文档等资料。<br>最多可添加6个附件，每个附件不超过60MB，格式为：jpg/ gif/png/rar/doc/pdf</p>
      </div>
    </div>
    <!-- <div class="module-title" v-if="isShowSpecial">特殊需求</div>
    <template  v-for="(item,index) in specialList">
      <div class="form-item" v-if="item.DisplayStatus!=0" :key="'special'+index">
        <div class="label" v-if="item.SelectStatus!=2">{{item.Name}}<i class="required" v-if="item.DisplayStatus==1">*</i></div>
        <van-radio-group class="primary-radio" v-model="item.SelectStatus" v-if="item.DisplayStatus!=0 && item.SelectStatus!=2">
          <van-radio :name="1">是</van-radio>
          <van-radio :name="0">否</van-radio>
        </van-radio-group>
        <textarea class="textarea" v-model="item.Remark" placeholder="请输入备注" v-if="item.SelectStatus==1 && item.Default==0"></textarea>
        <textarea class="textarea" v-model="item.Remark" placeholder="请输入备注" v-if="item.SelectStatus==0 && item.Default==1"></textarea>
        <textarea class="textarea" style="height:80px;padding-top:10px;" v-model="item.Remark" placeholder="其他说明备注" v-if="item.SelectStatus==2"></textarea>
      </div>
    </template> -->
    <div class="btn-box">
      <button class="btn-primary" @click="submit">下一步</button>
    </div>
    <!-- 行业弹框 -->
    <van-popup position="bottom" v-model="showIndustry">
      <van-picker 
        :columns="industryList" 
        value-key="name" 
        :show-toolbar="true"
        @confirm="pickIndustry"
        @cancel="showIndustry=false"
      ></van-picker>
    </van-popup>
    <!-- 服务类型 -->
    <van-popup position="bottom" v-model="showService">
      <van-picker 
        :columns="serviceList" 
        value-key="html" 
        :show-toolbar="true"
        @confirm="confirmService"
        @cancel="showService=false"
      >
      </van-picker>
    </van-popup>
    <!-- 分类注释弹框 -->
    <van-popup class="annotation-dialog" closeable close-icon="cross" v-model="showAnnotation">
      <h3 class="title">服务类型</h3>
      <ul class="annotation-list" v-if="annotationType==1">
        <li v-for="(item,index) in fieldList" :key="'annotation'+index">
          <div class="name">{{item.DomainName}}</div>
          <div class="desc">{{item.Description}}</div>
        </li>
      </ul>
      <ul class="annotation-list" v-if="annotationType==2">
        <li v-for="(item,index) in serviceStageMarks" :key="'annotation'+index">
          <div class="name">{{item.ServiceStageName}}</div>
          <div class="desc">{{item.Description}}</div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import {
  GetAccountJobConfig,
  GetIndustry,
  FileUpload,
  ProductDomains,
  ServiceStagesByDomain,
  ServiceStageTags,
  AddJobDetail,
  ProductBrands,
} from '@/common/api.js'
import { ImagePreview } from 'vant';
import validate from '@/common/validate.js'
import { FormatTime,getQueryString } from "@/common/util.js";
import {mapState} from 'vuex'
export default {
  name:'AgencyCreateOrder',
  data(){
    return{
      showItems:'',
      fieldList:[],//领域
      markList:[],//服务类型标签
      industryList:[],//行业列表
      serviceStageMarks:[],
      productionInfoList:[
        {
          serviceStage:[],
          productionList:[],
          brandList:[],
          seriesList:[],
          DomainId:'',
          DomainName:'',
          ServiceStageId:'',
          ServiceStageName:'',
          ProductCategoryID:'',
          ProductCategoryName:'',
          BrandId:'',
          BrandName:'',
          SeriesId:'',
          SeriesName:'',
          DeviceCount:1,
          IsProject:'',
        }
      ],//选择产品的列表
      form:{
        ProductLineList :[],
        Industry:'',
        IndustryId:'',
        Symptom:'',
        Content:'',
        EngineerCount:1,
      },
      fileList:[],//
      price:0,
      jobType:1,//1:自由工单，6:B2B工单，8:内部工单
      showProductCategoryLv1:false,//领域弹框
      showIndustry:false,//行业弹框
      editIndex:'',
      level1:1,
      showDatePicker:false,//
      pickedDate:'',
      specialList:[],//特殊需求
      isShowSpecial:false,
      showAnnotation:false,
      annotationType:1,//1:一级服务类型注释，2:二级
      accShareId:'',
      userCode:'',
      showService:false,//服务类型
      serviceList:[],
      otherDomainId:2147483647,//其他领域id
    }
  },
  watch: {
    // 'productionInfoList.0.ServiceStageId':function(value) {
    //   if(!value){
    //     return [];
    //   }
    //   //根据二级服务类型，获取服务标签
    //   ServiceStageTags({
    //     ServiceStageId:value,
    //     PageSize:5,//最多显示5条
    //   }).then(r=>{
    //     if(r.Result==1){
    //       this.markList=r.Data.Lines;
    //     }
    //   })
    // },
    '$route':function (to,from){
      // if(to.path=='/agencyCreateOrder' && from.path=='/searchProduction'){
      //   //选择产品信息返回
      //   if(this.productPicker && this.editIndex!==''){
      //     let product={...this.productPicker};
      //     this.$set(this.productionInfoList,this.editIndex,product);
      //   }
      // }
      if(to.path=='/agencyCreateOrder' && from.path=='/'){
        //返回首页再进入,清空数据
        if(this.productPicker!==null){
          this.$router.go(0);
        }
      }
    },
    productPicker(value,old){
      if(JSON.stringify(value)!=JSON.stringify(old)){
        if(value){
          let product={...this.productPicker};
          // if(old && value.ProductCategoryName!=old.ProductCategoryName && value.ProductCategoryName=='配电柜(箱)'){
          //   product.BrandId=24984;
          //   product.BrandName='其他';
          //   product.SeriesId=-1;
          //   product.SeriesName='其他';
          // }
          this.$set(this.productionInfoList,this.editIndex,product);
        }
      }
    },
  },
  computed: {
    ...mapState({
      productPicker:state=>state.productPicker,
    }),
  },
  created() {
    this.accShareId=Number(getQueryString('accShareId'));
    this.jobType=Number(getQueryString('jobtype')) || 1;
    this.userCode=getQueryString('usercode') || '';
    //判断是否过期，如果过期，返回首页
    this.shareTime=Number(getQueryString('st'));
    let now=new Date().getTime();
    if(now>this.shareTime+60*60*1000){
      this.$router.replace('/');
    }
    this.productionInfoList[0].DomainId=this.level1;
    this.pickField(0);
    this.init();
  },
  methods: {
    //页面初始化
    init(){
      //获取页面配置
      let type='';
      switch (this.jobType) {
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
        PlatformType:type,
        UserCode:this.userCode,
        platform:'pcweb',
      }).then(r=>{
        if(r.Result==1){
          this.showItems=r.Data;
          this.$store.commit('setCreateConfig',r.Data);
          //产品数量默认1
          if(this.showItems.IsDeviceCount!=0){
            this.productionInfoList[0].DeviceCount=1;
          }
          //特殊需求
          // this.specialList=r.Data.SpecialRemarkList;
          // this.specialList.map((item)=>{
          //   item['Remark']='';
          //   item['Default']=0;
          //   //后面三条默认是
          //   if(item.RemarkType==7 || item.RemarkType==8 || item.RemarkType==9){
          //     item['Default']=1;
          //   }
          //   if(item.DisplayStatus>0){
          //     this.isShowSpecial=true;
          //   }
          // })
          //默认品牌
          this.productionInfoList[0].BrandName=this.showItems.DefaultBrandName || '';
          this.productionInfoList[0].BrandId=this.showItems.DefaultBrandID || '';
        }
      });
      //领域
      ProductDomains({
        IsReturnOtherDomain:true
      }).then(r=>{
        if(r.Result==1){
          this.fieldList=r.Data;
        }
      });
      // 行业列表
      GetIndustry({
        parentID: 0
      }).then(r=>{
        if(r.Result==1){
          this.industryList=r.Data;
        }
      })
    },
    //弹出注释
    showAnno(type,index=0){
      this.annotationType=type;
      if(type==2){
        this.serviceStageMarks=this.productionInfoList[index].serviceStage;
      }
      this.showAnnotation=true;
    },
    //加载服务类型
    loadServeStage(index=0,isSet=false){
      let level1=this.productionInfoList[index].DomainId;
      ServiceStagesByDomain({
        ProductDomainId:level1,
        platform:'pcweb',
      }).then(r=>{
        if(r.Result==1){
          let data=r.Data.Lines;
          let product={...this.productionInfoList[index]};
          product.serviceStage=data;
          if(data.length && !isSet){
            product.ServiceStageId=data[0].ServiceStageId;
          }
          this.$set(this.productionInfoList,index,product);
          this.serviceList=[];
          data.forEach(el=>{
            let projectMark=require('@/assets/createOrder/icon-project.png');
            let standardMark=require('@/assets/createOrder/icon-standard.png');
            if(el.IsProject){
              el['html']=`<span class="text">${el.ServiceStageName}</span><img class="mark" src="${projectMark}" alt="">`;
            }else{
              el['html']=`<span class="text">${el.ServiceStageName}</span><img class="mark" src="${standardMark}" alt="">`;
            }
            this.serviceList.push(el);
          })
        }
      });
    },
    //弹出服务类型
    pickService(index){
      this.showService=true;
      this.editIndex=index;
    },
    //确认选中服务类型
    confirmService(data){
      let product={
        ...this.productionInfoList[this.editIndex],
      }
      product['ServiceStageName']=data.ServiceStageName;
      product['ServiceStageId']=data.ServiceStageId;
      product['IsProject']=data.IsProject;
      this.$set(this.productionInfoList,this.editIndex,product);
      this.showService=false;
    },
    //选择领域
    pickField(index,isSet=false){
      let product={...this.productionInfoList[index]};
      if(!isSet){
        if(this.otherDomainId==product.DomainId){
          product.ServiceStageId=0;
          product.ServiceStageName='';
          product.ProductCategoryName='';
          product.ProductCategoryID=0;
          product.BrandName='';
          product.BrandId=0;
          product.SeriesName='';
          product.SeriesId=0;
          product.IsProject='';
        }else{
          product.IsProject='';
          product.ServiceStageId=0;
          product.ServiceStageName='';
          product.ProductCategoryName='';
          product.ProductCategoryID='';
          product.SeriesName='';
          product.SeriesId='';
          if(product.BrandId!=this.showItems.DefaultBrandID){
            product.BrandName=this.showItems.DefaultBrandName || '';
            product.BrandId=this.showItems.DefaultBrandID || '';
          }else{
            product.BrandName='';
            product.BrandId='';
          }
          this.loadServeStage(index,isSet);
        }
      }
      this.$set(this.productionInfoList,index,product);
    },
    //选择行业
    pickIndustry(data){
      this.form.Industry=data.name;
      this.form.IndustryId=data.id;
      this.showIndustry=false;
    },
    //选择产品、品牌、系列——1:2:3
    toPick(index,type){
      if(type==1 && this.productionInfoList[index].DomainId==''){
        this.$toast('请先选择领域！');
        return;
      }
      if(type==2 && this.productionInfoList[index].DomainId==''){
        this.$toast('请先选择领域！');
        return;
      }
      if(type==2 && this.productionInfoList[index].ProductCategoryID==''){
        this.$toast('请先选择产品！');
        return;
      }
      if(type==3 && this.productionInfoList[index].DomainId==''){
        this.$toast('请先选择领域！');
        return;
      }
      if(type==3 && this.productionInfoList[index].ProductCategoryID==''){
        this.$toast('请先选择产品！');
        return;
      }
      if(type==3 && this.productionInfoList[index].BrandId==''){
        this.$toast('请先选择品牌！');
        return;
      }
      this.editIndex=index;
      this.$store.commit('setProductPicker',{...this.productionInfoList[index]});
      this.$router.push({path:'/searchProduction',query:{type:type}});
    },
    //添加产品
    insertProduct(){
      var index=this.productionInfoList.length;
      this.productionInfoList.push({
        serviceStage:[],
        productionList:[],
        brandList:[],
        seriesList:[],
        DomainId:this.level1,
        ServiceStageId:'',
        ProductCategoryName:'',
        ProductCategoryID:'',
        BrandName:'',
        BrandId:'',
        SeriesName:'',
        SeriesId:'',
        DeviceCount:1,
      })
      this.pickField(index);
    },
    //校验产品信息
    validProduct(item){
      if(!item.DomainId){
          this.$toast('请选择领域！');
          return false;
        }
        if(item.ServiceStageId===''){
          this.$toast('请选择服务类型！');
          return false;
        }
        if(item.ServiceStageId===0 && item.ServiceStageName===''){
          this.$toast('请输入服务类型！');
          return false;
        }
        if(item.ProductCategoryID===''){
          this.$toast('请选择产品/设备！');
          return false;
        }
        if(item.ProductCategoryID===0 && item.ProductCategoryName===''){
          this.$toast('请输入产品/设备！');
          return false;
        }
        if(item.BrandId===''){
          this.$toast('请选择产品品牌！');
          return false;
        }
        if(item.BrandId===0 && item.BrandName===''){
          this.$toast('请输入产品品牌！');
          return false;
        }
        if(item.SeriesId==='' && this.showItems.IsSeries==1){
          this.$toast('请选择产品系列！');
          return false;
        }
        if(item.SeriesId===0 && item.SeriesName==='' && this.showItems.IsSeries==1){
          this.$toast('请输入产品系列！');
          return false;
        }
        if(item.DeviceCount==='' && this.showItems.IsDeviceCount==1){
          this.$toast('请输入故障设备数量！');
          return false;
        }
        if(item.DeviceCount!=='' && !validate.positiveInt(item.DeviceCount)){
          this.$toast('故障设备数量为正整数！');
          return false;
        }
        return true;
    },
    //删除产品
    removeProduct(obj){
      let index=null;
      this.productionInfoList.map((item,i)=>{
        if(item.id==obj.id){
          index=i;
        }
      })
      if(index!==null){
        this.productionInfoList.splice(index,1);
      }
    },
    // 上传前校验
    beforeRead(file){
      var limit=['jpg','jpeg','gif','png','rar','zip','doc','docx','pdf','JPG','JPEG','GIF','PNG'];
      let arr=file.name.split('.');
      var index=limit.indexOf(arr[arr.length-1]);
      if(index==-1){
        this.$toast('上传文件格式不正确！');
        return false;
      }
      return true;
    },
    // 上传
    afterRead(file){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(r=>{
        if(r.Result==1){
          this.fileList=this.fileList.concat(r.Data);
        }
      })
    },
    //删除上传资料
    removeImg(index){
      this.fileList.splice(index,1);
    },
    //预览图片
    preview(url){
      ImagePreview([url]);
    },
    //下一步
    submit(){
      let items={...this.showItems};
      let form={...this.form};
      let productFill=false;
      let productionLine=[];
      for (let i = 0; i < this.productionInfoList.length; i++) {
        let one = this.productionInfoList[i];
        let {DomainId,DomainName,ServiceStageId,ServiceStageName,ProductCategoryID,ProductCategoryName,BrandId,BrandName,SeriesId,SeriesName,DeviceCount}={...this.productionInfoList[i]};
        productionLine.push({
          DomainId,DomainName,ServiceStageId,ServiceStageName,ProductCategoryID,ProductCategoryName,BrandId,BrandName,SeriesId,SeriesName,DeviceCount
        })
        productFill=this.validProduct(one);
      }
      if(!productFill){
        return;
      }
      //默认工单名称
      let orderName=productionLine[0].ProductCategoryName+'-'+productionLine[0].ServiceStageName;
      if(items.IsEngineersCount ==1 && !validate.positiveInt(form.EngineerCount)){
        this.$toast('工程师数量为正整数！');
        return;
      }
      if(items.IsIndustry==1 && form.IndustryId==''){
        this.$toast('请选择所属行业');
        return;
      }
      if(items.IsFaults==1 && form.Symptom==''){
        this.$toast('请输入故障现象');
        return;
      }
      if(items.IsJobDescribe ==1 && form.Content==''){
        this.$toast('请输入服务需求描述');
        return;
      }
      if(items.IsDataUpload ==1 && this.fileList.length==0){
        this.$toast('请上传现场资料');
        return;
      }
      if(items.IsEngineersCount ==1 && form.EngineerCount===''){
        this.$toast('请输入工程师数量');
        return;
      }
      //上传现场资料的数组
      let fileArr=[];
      for (let i = 0; i < this.fileList.length; i++) {
        fileArr[i] = this.fileList[i].imgUrl;
      }
      // orderName=orderName.substring(0,orderName.length-1);
      let encodeName=encodeURIComponent(orderName);
      let params={
        ...form,
        UserCode:this.userCode,
        DisposeId:items.ID,
        JobType:this.jobType,
        ProductLineList:productionLine,
        FileUrlList:fileArr,
        SpecialRemarkList:this.specialList,
        IsReplaceSendJob:true,//
        AccountShareId:this.accShareId,
        orderName:encodeName,
      };
      let paramsStr=JSON.stringify(params);
      this.$router.push({path:'/agencyCreateOrder2',query:{params:paramsStr}});
      // AddJobDetail(params).then(r=>{
      //   if(r.Result==1){
      //     let data=r.Data;
      //     orderName=orderName.substring(0,orderName.length-1);
      //     let encodeName=encodeURIComponent(orderName);
      //     this.$router.push({path:"/agencyCreateOrder2",query:{jobId:r.Data,jobType:this.jobType,jobTitle:encodeName,userCode:this.userCode}});
      //   }else{
      //     this.$toast(r.Message);
      //   }
      // })
    }
  },
}
</script>
<style lang="scss">
.createOrder{
  background-color: #f9f9f9;
  padding-top: 56px;
  .production-module{
    background-color: #fff;
    width: 100%;
    padding: 0 10px 5px;
    overflow: hidden;
    .module-hd{
      display: flex;
      align-items: center;
      height: 40px;
      .title{
        font-size: 14px;
        color: #333;
        line-height: 24px;
        flex: 1;
        font-weight: bold;
      }
      .btn-remove{
        font-size: 13px;
        color: #f75959;
        line-height: 24px;
      }
    }
    .module-bd{
      background-color: #fff;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      margin-bottom: 10px;
      overflow: hidden;
      .label{
        font-weight: normal;
      }
    }
  }
  .form-item{
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
      font-weight: bold;
    }
    .annotation{
      text-align: right;
      font-size: 14px;
      color: #999;
      line-height: 44px;
      position: absolute;
      right: 15px;
      top: 0;
      .icon{
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        margin-left: 4px;
        font-size: 10px;
        background-color:#f75959;
        color: #fff;
        border-radius: 4px;
      }
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    .icon-service{
      display: inline-block;
      width: 60px;
      height: 14px;
      vertical-align: middle;
      margin-right: 3px;
      margin-top: -3px;
      &.project{
        background: url('~@/assets/createOrder/icon-project.png') no-repeat center /contain;
      }
      &.standard{
        background: url('~@/assets/createOrder/icon-standard.png') no-repeat center /contain;
      }
    }
    .file-wrap{
      width: 100%;
      margin-bottom: 12px;
    }
    .tips{
      font-size: 12px;
      color: #999;
      line-height: 18px;
    }
  }
  .tab-hd{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 18px 0;
    .van-radio__icon{
      display: none;
    }
    .van-radio__label{
      font-size: 15px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      height: 24px;
      border-bottom: 2px solid transparent;
      margin-left: 0;
    }
    .van-radio__icon--checked+.van-radio__label{
      border-color: #f75959;
      color: #f75959;
    }
  }
  .btn-add{
    width: 100%;
    height: 40px;
    background-color: #f9f9f9;
    color: #f75959;
    font-size: 14px;
    line-height: 44px;
    text-align: center;
    &:active{
      background-color: #f1f1f1;
    }
    .van-icon-plus{
      vertical-align: middle;
      margin-right: 4px;
      margin-top: -3px;
      font-weight: bold;
    }
  }
  .mark-list{
    width: 100%;
    overflow: hidden;
    .mark{
      float: left;
      padding: 0 8px;
      background-color: #f1f1f1;
      color: #666;
      font-size: 13px;
      height: 24px;
      line-height: 24px;
      margin-right: 8px;
      margin-bottom: 10px;
    }
  }
  .module-title{
    font-size: 15px;
    color: #333;
    line-height: 35px;
    height: 35px;
    text-align: center;
  }
  .primary-radio{
    display: flex;
    height: 44px;
    align-items: center;
    font-size: 14px;
    flex: 1;
    justify-content: flex-end;
    .van-radio{
      margin-right: 10px;
    }
    .van-radio__icon{
      border: 1px solid #e5e5e5;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      padding: 2px;
      background-clip: content-box;
    }
    .van-radio__icon--checked{
      border-color: #f75959;
      background-color: #f75959;
    }
    .van-icon{
      display: none;
    }
  }
  .btn-box{
    margin-top: 10px;
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
  .no-border{
    border-bottom:0 !important;
  }
  
  .img-list{
    display:inline-block;
    overflow:hidden;
    vertical-align: middle;
    >li{
      width:80px;
      height:80px;
      overflow:hidden;
      float:left;
      margin-right:10px;
      margin-bottom: 10px;
      position:relative;
    }
    img{
      width:100%;
      height:100%;
      display:block;
      border-radius: 4px;
    }
    .icon-close{
      font-size:20px;
      color:#ff3838;
      position:absolute;
      right:-5px;
      top:-5px;
      z-index:2;
      line-height:30px;
      width:30px;
      height:30px;
      text-align:center;
    }
  }
  .annotation-dialog{
    width: 80vw;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 13px;
    .title{
      font-size: 16px;
      color: #333;
      text-align: center;
      line-height: 2;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .annotation-list{
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      >li{
        margin-bottom: 10px;
      }
    }
    .name{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .desc{
      font-size: 13px;
      color: #333;
      line-height: 20px;
    }
  }
  .van-picker{
    .mark{
      width: 60px;
      height: 14px;
      margin-left: 3px;
    }
  }
}
</style>