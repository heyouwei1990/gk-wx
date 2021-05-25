<template>
  <div class="search-production">
    <van-search
      v-model.trim="keyword"
      show-action
      placeholder="请输入关键字"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <ul class="result-list">
      <li v-for="(item,index) in searchResult" :key="index" @click="pick(item)">
        <van-icon class="icon-search" name="search" />
        {{item.name}}
      </li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {
  ProductBrands,
} from '@/common/api.js'
export default {
  name:'SearchProduction',
  data(){
    return{
      keyword:'',
      allData:[],
      searchResult:[],
      type:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      productPicker:state=>state.productPicker,
      productions:state=>state.productions
    }),
  },
  created() {
    this.type=Number(this.$route.query.type);
    this.ready();
  },
  mounted() {
    if(!this.productPicker){
      this.$router.go(-1);
    }
  },
  methods: {
    ready(){
      //如果是选择产品，且产品列表为空
      if(this.type==1){
        this.loadData();
      }
      if(this.type!=1){
        this.loadData(this.productPicker.ProductCategoryID);
      }
    },
    loadData(id){
      let params={
        ProductCategoryLv1:[this.productPicker.DomainId],
        NestingLevel:1,
      };
      if(id){
        params['ProductCategoryLv1']=[this.productPicker.DomainId]
        params['ProductId']=id;
        params['NestingLevel']=2;
      }
      ProductBrands(params).then(r=>{
        if(r.Result==1){
          let data=r.Data || [];
          if(this.type==1){
            for (let i = 0; i < data.length; i++) {
               data[i]['name'] = data[i].ProductCategoryName;
            }
            this.allData=data;
          }
          if(this.type==2 && data.length){
            data[0].Brands.map(item=>{
              item['name']=item.BrandName;
            })
            this.allData=data[0].Brands;
          }
          if(this.type==3 && data.length){
            var brandList=data[0].Brands;
            var obj=brandList.find((item)=>{
              return item.BrandId==this.productPicker.BrandId
            })
            var seriesList=obj?obj.Series:[];
            seriesList.map(item=>{
              item['name']=item.SeriesName;
            })
            this.allData=seriesList;
          }
          this.searchResult=[...this.allData];
        }
      })
    },
    onSearch(){
      this.searchResult=this.allData.filter(item=>{
        return item.name.indexOf(this.keyword)!=-1
      })
    },
    pick(item){
      var obj={...this.productPicker};
      switch (this.type) {
        case 1:
          obj.ProductCategoryID=item.Id;
          obj.ProductCategoryName=item.ProductCategoryName;
          // obj.BrandId='';
          // obj.BrandName='';
          obj.SeriesId='';
          obj.SeriesName='';
          break;
        case 2:
          obj.BrandId=item.BrandId;
          obj.BrandName=item.BrandName;
          obj.SeriesId='';
          obj.SeriesName='';
          break;
        case 3:
          obj.SeriesId=item.SeriesId;
          obj.SeriesName=item.SeriesName;
          break;
      }
      this.$store.commit('setProductPicker',obj);
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="scss">
.search-production{
  padding-top: 44px;
  .van-search{
    background-color: #f75959;
    position: fixed;
    left: 50%;
    top: 0;
    z-index: 2;
    width: 100%;
    max-width: 750px;
    height: 44px;
    padding: 5px 0px 5px 12px;
    transform: translateX(-50%);
  }
  .van-search__content{
    border-radius: 40px;
  }
  .van-search__action{
    color: #fff;
    &:active{
      background-color: transparent;
    }
  }
  .result-list{
    >li{
      padding: 6px 15px 6px 40px;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      color: #666;
      line-height: 22px;
      min-height: 34px;
    }
    .icon-search{
      position: absolute;
      left: 10px;
      top: 9px;
      font-size: 16px;
      color: #999;
    }
  }
}
</style>