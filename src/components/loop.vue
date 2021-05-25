<template>
  <div class="loop-wrapper">
    <ul class="loop-list" ref="slide">
      <li 
        class="loop-item"
        v-for="(item,index) in listArr"
        :key="index"
        @touchstart="cancelAnimation"
        @touchend="setAnimation"
      >
        <img v-lazy="item" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
export default{
  data(){
    return{
      timer:0,
      scrollEnd:0,
    }
  },
  props:{
    list:{
      type:Array,
    }
  },
  computed: {
    listArr() {
      let list = []
      for (let i = 0; i < 2; i++) {
        this.list && this.list.forEach(item => {
          list.push(item)
        })
      }
      return list
    }
  },
  // watch:{
  //   listArr(val){
  //     if(val.length>0){
  //       this.$nextTick(()=>{
  //         this.scrollEnd=this.$refs.slide.offsetWidth/2;
  //         this.setAnimation();
  //       })
  //     }
  //   }
  // },
  mounted() {
    this.scrollEnd=this.$refs.slide.offsetWidth/2;
    this.setAnimation();
  },
  methods: {
    setAnimation () {
      this.timer = requestAnimationFrame(() => {
        if (!this.$refs.slide) {
          return;
        }
        let curlLeft = this.$refs.slide.parentNode.scrollLeft;
        if (curlLeft < this.scrollEnd) {
          this.$refs.slide.parentNode.scrollLeft = curlLeft + 1;
        } else {
          this.$refs.slide.parentNode.scrollLeft = 0;
        }
        this.setAnimation();
      })
    },
    cancelAnimation () {
      cancelAnimationFrame(this.timer)
    },
  },
  distroyed(){
    // console.log(1);
  }
}
</script>
<style lang="scss">
.loop-wrapper{
  width:100%;
  height: 100px;
  overflow-x:auto;
  overflow-y:hidden;
  position:relative;
  &::-webkit-scrollbar {
    opacity: 0;
  }
  .loop-list{
    white-space: nowrap;
    position:absolute;
    left:0;
    top:0;
  }
  .loop-item{
    display: inline-block;
    width: 110px;
    height: 80px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    img{
      width:100%;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate3d(-50%,-50%,0);
      background-color:#fff;
    }
  }
}
</style>