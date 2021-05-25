<template>
  <div class="pwd_box">
    <input
      ref="pwd"
      type="tel"
      maxlength="6"
      v-model="msg"
      class="pwd"
      @input="msgChange"
      unselectable="on"
    />
    <ul class="pwd-wrap" @click="focus">
      <li :class="msg.length == 0 ? 'psd-blink' : ''">
        <i v-if="msg.length > 0"></i>
      </li>
      <li :class="msg.length == 1 ? 'psd-blink' : ''">
        <i v-if="msg.length > 1"></i>
      </li>
      <li :class="msg.length == 2 ? 'psd-blink' : ''">
        <i v-if="msg.length > 2"></i>
      </li>
      <li :class="msg.length == 3 ? 'psd-blink' : ''">
        <i v-if="msg.length > 3"></i>
      </li>
      <li :class="msg.length == 4 ? 'psd-blink' : ''">
        <i v-if="msg.length > 4"></i>
      </li>
      <li :class="msg.length == 5 ? 'psd-blink' : ''">
        <i v-if="msg.length > 5"></i>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: "cashier",
  head() {
    return {
      title: `去支付`,
    };
  },
  data() {
    return {
      msg: "", //支付密码
    };
  },
  props:{
    value:{
      type:[Number,String],
      default:'',
    }
  },
  watch: {
    msg(curVal) {
      if (/[^\d]/g.test(curVal)) {
        this.msg = this.msg.replace(/[^\d]/g, "");
      }
    },
    value:{
      handler(val){
        this.msg=val;
      },
      immediate:true,
    }
  },
  methods: {
    //输入支付密码
    focus() {
      this.$refs.pwd.focus();
    },
    msgChange(){
      this.$emit('input',this.msg);
    }
  },
};
</script>

<style type="text/scss" lang="scss" scoped>
// 输入支付密码样式
.pwd_box {
  height: auto;
  display: flex;
  input[type="tel"] {
    width: 0.1px;
    height: 0.1px;
    color: transparent;
    // position: relative;
    // top: 23px;
    background: #000000;
    // left: 46px;
    border: none;
    font-size: 18px;
    opacity: 0;
    z-index: -1;
  }
  //光标
  .pwd-wrap {
    width: 260px;
    margin: 0 auto;
    background: #fff;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    z-index: 10;
    li {
      list-style-type: none;
      text-align: center;
      height: 36px;
      width: 36px;
      border: 1px solid #ddd;
      position: relative;
      i {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #000;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
      }
    }
    .psd-blink {
      border-color: lightblue;
      box-shadow: 0 0 3px lightblue;
    }
  }
  button {
    position: relative;
    display: block;
    height: 41px;
    text-align: center;
    margin: 0 auto;
    margin-top: 70%;
    padding: 0 20px;
    border-radius: 5px;
    font-size: 16px;
    border: 1px solid #dddddd;
    background: #dddddd;
    color: #000000;
  }
}
</style>
