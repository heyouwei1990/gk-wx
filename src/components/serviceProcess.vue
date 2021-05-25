<template>
  <div class="serviceProcess">
    <div class="map-container" id="map-container"></div>
    <div class="process-wrapper">
      <div class="process-dl"  v-for="(item,index) in assignUserList" :key="index">
        <div class="process-dt" @click="trigger(index)">
          <div class="engineer">
            <i class="icon-worker"></i>
            <div>
              <div class="name">{{item.TrueName}}</div>
              <span class="grade">评分：{{item.EngineerGrade}}</span>
            </div>
          </div>
          <div class="right-box" v-show="!item.SelectStatus">
            <span class="status">{{item.LastProgressContent}}</span>
            <time class="time">{{item.LastProgressCreateTime}}</time>
          </div>
          <div class="right-btns" v-show="item.SelectStatus">
            <div class="btn-item" @click.stop="chat">
              <i class="icon-chat"></i>
              <div class="text">在线聊天</div>
            </div>
            <div class="btn-item" @click.stop="call(item.Handset)">
              <i class="icon-tel"></i>
              <div class="text">电话沟通</div>
            </div>
          </div>
        </div>
        <div class="process-dd" ref="process">
          <ul>
            <li :class="['status-item',{'on':status.ProgressStatus==0}]" v-for="(status,idx) in item.UserProgressList" :key="idx">
              <span class="status">【{{status.Content}}】</span>
              <div class="icon"></div>
              <div class="item-right">
                <div class="flex">
                  <span class="time">{{status.CreateTime}}</span>
                  <span class="btn-text" v-if="status.StepNum==9 || status.StepNum==19" @click="look(status.StepNum,status.JobId,status.Id)">查看&gt;&gt;</span>
                </div>
                <div class="desc">{{status.Remark}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let BMap=window.BMap;
let map;
import {GetServiceProcessView} from '@/common/api.js'
export default {
  data(){
    return{
      icon:require('@/assets/orderProcess/map-worker.png'),
      iconActive:require('@/assets/orderProcess/map-worker-active.png'),
      iconTarget:require('@/assets/orderProcess/icon-target.png'),
      assignUserList:[],
      destination:null,
      groupId:'',
      isInit:false,
    }
  },
  watch: {
    assignUserList(value){
      if(value.length){
        this.isInit=true;
          this.renderMap();
      }
    },
  },
  created() {
    this.init();
  },
  props:['jobId'],
  mounted() {
    this.renderMap();
  }, 
  methods: {
    init(){
      GetServiceProcessView({
       JobId:this.jobId,
       platform:'pcweb' 
      }).then(r=>{
        if(r.Result==1){
          let list=r.Data.AssignUserList || [];
          for (let i = 0; i < list.length; i++) {
            list[i]['currentStatus']='';
            list[i]['statusTime']='';
            if(!list[i].UserProgressList){
              list[i].UserProgressList=[];
            }
          }
          this.assignUserList=list;
          this.destination=r.Data.Destination;
          this.groupId=r.Data.EasemobGroupId;
        }
      })
    },
    //渲染地图
    renderMap(){
      let that=this;
      map = new BMap.Map("map-container");
      //地图控制器
      let navigationControl = new BMap.NavigationControl({
          anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 靠左上角位置
          type: window.BMAP_NAVIGATION_CONTROL_LARGE, // LARGE类型
          enableGeolocation: true, // 启用显示定位
      });
      // map.addControl(navigationControl)
      map.enableScrollWheelZoom(true);
      this.$nextTick(()=>{
        that.setMarker();
      })
    },
    //添加标识
    setMarker(point){
      map.clearOverlays();  
      let that=this;
      let pointArray=[];
      for (let i = 0; i < that.assignUserList.length; i++) {
        pointArray[i] = new BMap.Point(that.assignUserList[i].Lng,that.assignUserList[i].Lat);
        let icon;
        if(point && point.lng==that.assignUserList[i].Lng && point.lat==that.assignUserList[i].Lat){
          icon=new BMap.Icon(that.iconActive,new BMap.Size(24,31));
        }else{
          icon=new BMap.Icon(that.icon,new BMap.Size(24,31));
        }
        let marker = new BMap.Marker(pointArray[i],{icon}); // 创建标注
        map.addOverlay(marker);
        marker.addEventListener("click",that.pointTap);
      }
      if(that.destination){
        let targetPoint=new BMap.Point(that.destination.Lng,that.destination.Lat);
        let icon=new BMap.Icon(that.iconTarget,new BMap.Size(16,16));
        let marker = new BMap.Marker(targetPoint,{icon}); // 创建标注
        map.addOverlay(marker);
      }
      if(this.isInit){
        map.setViewport(pointArray);
        this.isInit=false;
      }
      
    },
    //点击标识
    pointTap(e) {
      var point = e.target.getPosition();
      let index=-1;
      for (let i = 0; i < this.assignUserList.length; i++) {
        if(point.lng==this.assignUserList[i].Lng && point.lat==this.assignUserList[i].Lat){
          index=i;
        }
      }
      if(index>-1){
        this.trigger(index);
      }
    },
    //点击
    trigger(index){
      let height=this.$refs.process[index].querySelector('ul').offsetHeight;
      for (let i = 0; i < this.assignUserList.length; i++) {
        if(i!==index){
          this.assignUserList[i].SelectStatus=false;
          this.$refs.process[i].style.height=0+'px';
        }
      }
      if(this.assignUserList[index].SelectStatus){
          this.$refs.process[index].style.height=0+'px';
        this.assignUserList[index].SelectStatus=false;
      }else{
        this.$refs.process[index].style.height=height+'px';
        this.assignUserList[index].SelectStatus=true;
      }
      this.$refs.process[index].style.height=height+'px';
        this.assignUserList[index].SelectStatus=true;
      let point={lng:this.assignUserList[index].Lng,lat:this.assignUserList[index].Lat};
      map.centerAndZoom(new BMap.Point(point.lng, point.lat), 10);
      this.setMarker(point);
    },
    //查看
    look(step,jobId,process){
      if(step==9){
        this.$router.push({path:'/arriveRecord',query:{jobId,process}})
      }
      if(step==19){
        this.$router.push({path:'/leaveRecord',query:{jobId,process}})
      }
    },
    //群聊
    chat(){
      this.$router.push({path:'/chat',query:{chatId:this.groupId,type:'group'}})
    },
    //通话
    call(contacts){
      this.$emit('call',contacts);
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.serviceProcess{
  .map-container{
    display: inline-block;
    width: 100%;
    height: px2rem(650px);
    background-color: #f5f5f5;
  }
  
  .process-wrapper{
    width: px2rem(694px);
    margin: -42px auto 0px;
  }
  .process-dt{
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 14px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.11);
    margin-bottom: 15px;
    .engineer{
      display: flex;
    }
    .icon-worker{
      width: px2rem(58px);
      height: px2rem(58px);
      margin-right: 8px;
      @include bg('~@/assets/orderProcess/icon-engineer.png');
    }
    .name{
      font-size: 14px;
      color: #333;
      line-height: px2rem(58px);
    }
    .grade{
      font-size: 12px;
      color: #999;
      line-height: 24px;
    }
    .right-box{
      text-align: right;
      .status{
        font-size: 14px;
        color: #333;
        line-height: px2rem(58px);
        display: block;
      }
      .time{
        font-size: 12px;
        color: #999;
        line-height: 24px;
      }
    }
    .right-btns{
      display: flex;
      align-items: center;
      .btn-item{
        text-align: center;
        margin-left: 10px;
        &:active{
          .text{
            border-bottom: 1px solid $primary;
            color: $primary;
          }
        }
      }
      .icon-chat{
        display: inline-block;
        width: 20px;
        height: 20px;
        @include bg('~@/assets/orderProcess/icon-chat.png');
      }
      .icon-tel{
        display: inline-block;
        width: 20px;
        height: 20px;
        @include bg('~@/assets/orderProcess/icon-tel.png');
      }
      .text{
        display: block;
        font-size: 12px;
        color: #333;
        line-height: 24px;
      }
    }
  }
  .process-dd{
    overflow: hidden;
    height: 0;
    transition: all linear 0.3s;
    .status-item{
      display: flex;
      position: relative;
      padding-bottom: 10px;
      &:before{
        content: "";
        position: absolute;
        left: 85px;
        top: 0;
        width: 1px;
        height: 100%;
        background-color: #e5e5e5;
      }
      &.on{
        .status{
          color: $primary;
        }
        .icon{
          width: 14px;
          height: 14px;
          background-color: $primary;
          top: 0;
        }
      }
      &:last-child{
        &:before{
          height: 10px;
        }
      }
    }
    .status{
      width: 80px;
      font-size: 13px;
      color: #333;
      line-height: 20px;
      white-space: nowrap;
      position: absolute;
      right: 100%;
      top: 0;
      z-index: 2;
      margin-right: -80px;
    }
    .flex{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-right{
      padding-left: 100px;
      width: 100%;
    }
    .icon{
      display: block;
      width: 10px;
      height: 10px;
      background-color: #e5e5e5;
      position: absolute;
      left: 85px;
      top: 3px;
      transform: rotate(45deg);
      transform-origin: left top;
    }
    .time{
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .btn-text{
      font-size: 12px;
      color: $primary;
      line-height: 20px;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 20px;
      margin-top: 5px;
    }
  }
}
</style>