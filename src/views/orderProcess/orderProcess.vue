<template>
  <div :class="['orderProcess',{'has-footer':footerStatus>0}]">
    <van-nav-bar
      :title="title"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.replace('/myOrders');$router.go(-1);"
      
    >
      <template #right>
        <!-- <van-icon v-show="groupId" @click="chat" name="chat-o" size="20" /> -->
        <span class="header-btn" v-show="groupId" @click="chat"><div class="icon-chat"></div>群聊</span>
      </template>
    </van-nav-bar>
    <div class="head">
      <div class="main">
        <i :class="['icon',statusIcon]"></i>
        <div class="desc">{{statusDesc}}</div>
      </div>
    </div>
    <order-informartion :productInfo="productInfo" @call="call"></order-informartion>
    <!-- 押金 -->
    <section class="deposit" v-if="desposit.IsExist" :style="{height:desposit.IsOpen?'auto':'66px'}">
      <div class="module-hd">
        <h3 class="title">{{desposit.Title}}</h3>
        <span class="price" v-if="productInfo.JobType==1">￥{{desposit.MarketMiniPrice | formatPrice}}~{{desposit.MarketMaxPrice | formatPrice}}</span>
        <span class="price" v-if="productInfo.JobType!=1 && allData.JobStep!=20">￥{{desposit.RealDepositAmount | formatPrice}}</span>
        <van-icon name="arrow-down" :class="{'active':desposit.IsOpen}"  @click="desposit.IsOpen=!desposit.IsOpen" v-if="productInfo.JobType==6 && productInfo.IsProject==false"/>
      </div>
      <!-- 标准工单——代付款 -->
      <template v-if="productInfo.JobType==6 && allData.JobStep==20 && productInfo.IsProject==false">
        <div class="price-module dark">
          <div class="flex">
            <span class="label">服务押金：</span>
            <span class="value price">￥{{desposit.WorkLogAmount | formatPrice}}</span>
          </div>
        </div>
        <ul class="price-list" >
          <li v-for="(item,index) in desposit.Lines" :key="'price'+index">
            <div class="flex">
              <span class="date">{{item.Date}}</span>
              <div class="label">
                <span>服务价格：</span>
                <span class="price">¥{{item.Money | formatPrice}}</span>
              </div>
            </div>
            <div class="flex">
              <span class="date-type">{{item.HolidayType | formatWorkday}}</span>
              <span class="men">工程师{{item.WorkerNum}}人</span>
            </div>
          </li>
        </ul>
        <div class="price-module dark">
          <div class="flex">
            <span class="label">路费押金（{{desposit.WorkDay}}天）：</span>
            <span class="value price">￥{{desposit.TrafficAmount | formatPrice}}</span>
          </div>
          <div class="flex remark">
            <span class="label">备注：</span>
            <span class="value">工单默认需每天多收取100元作为路费押金</span>
          </div>
        </div>
        <div class="price-module dark">
          <div class="flex">
            <span class="label">总计：</span>
            <span class="value price">￥{{desposit.RealDepositAmount | formatPrice}}</span>
          </div>
          <div class="flex remark">
            <span class="label">备注：</span>
            <span class="value">最终根据工单最终费用来结算，多退少补</span>
          </div>
        </div>
      </template>
      <!-- 标准工单——代付款 end -->
      <!-- 标准工单——已付押金 -->
      <template v-if="productInfo.JobType==6 && allData.JobStep!=20 && productInfo.IsProject==false">
        <div class="price-module bb">
          <div class="flex">
            <span class="label">服务押金：</span>
            <span class="value">￥{{desposit.WorkLogAmount | formatPrice}}</span>
          </div>
        </div>
        <ul class="price-list" >
          <li v-for="(item,index) in desposit.Lines" :key="'price'+index">
            <div class="flex">
              <span class="date">{{item.Date}}</span>
              <div class="label">
                <span>服务价格：</span>
                <span class="price">¥{{item.Money | formatPrice}}</span>
              </div>
            </div>
            <div class="flex">
              <span class="date-type">{{item.HolidayType | formatWorkday}}</span>
              <span class="men">工程师{{item.WorkerNum}}人</span>
            </div>
          </li>
        </ul>
        <div class="price-module">
          <div class="flex">
            <span class="label">路费押金（{{desposit.WorkDay}}天）：</span>
            <span class="value price">￥{{desposit.TrafficAmount | formatPrice}}</span>
          </div>
        </div>
        <div class="price-module bb">
          <div class="flex">
            <span class="label">预付押金：</span>
            <span class="value price">￥{{desposit.RealDepositAmount | formatPrice}}</span>
          </div>
        </div>
        <div class="price-module" v-if="desposit.AdditionalDepositList.length">
          <div class="flex" v-for="(item,index) in desposit.AdditionalDepositList" :key="'add'+index">
            <span class="label">追加押金</span>
            <span class="value price">￥{{item | formatPrice}}</span>
          </div>
        </div>
      </template>
      <!-- 标准工单——已付押金 end -->
      <div class="project-price" v-if="productInfo.JobType!=1 && allData.JobStep==20 && productInfo.IsProject">
        <div class="flex">
          <span class="label">预计工单费用：</span>
          <span class="value">￥{{desposit.RealDepositAmount | formatPrice}}</span>
        </div>
        <div class="flex">
          <span class="label">支付总押金：</span>
          <span class="value">￥{{desposit.RealDepositAmount | formatPrice}}</span>
        </div>
      </div>
    </section>
    <!-- 押金 end -->
    <!-- 服务进度 -->
    <!-- <section class="process" v-if="jobProgress.IsExist" :style="{height:jobProgress.IsOpen?'auto':'66px'}">
      <div class="module-hd" @click="jobProgress.IsOpen=!jobProgress.IsOpen">
        <h3 class="title">服务进度</h3>
        <van-icon name="arrow-down" :class="{'active':jobProgress.IsOpen}" />
      </div>
      <ul class="step-list">
        <li :class="{'on':item.Status===0,'active':item.Status===1}" v-for="(item,index) in jobProgress.ProgressList" :key="'process'+index">
          <i class="dot"></i>
          <div class="flex">
            <span class="name">【{{item.ProgressName}}】</span>
            <time class="time">{{item.CreateTime}}</time>
          </div>
          <div class="content">
            {{item.Remark}}
          </div>
        </li>
      </ul>
    </section> -->
    <!-- 服务进度 end -->
    <!-- 需求三方报告 -->
    <section class="third-report" v-if="thirdReport.IsExist" :style="{height:thirdReport.IsOpen?'auto':'66px'}">
      <div class="module-hd" @click="thirdReport.IsOpen=!thirdReport.IsOpen">
        <h3 class="title">需求三方报告</h3>
        <van-icon name="arrow-down" :class="{'active':thirdReport.IsOpen}" />
      </div>
      <div class="wrapper">
        <ul class="file-list">
          <li v-for="item in thirdReport.FileList" :key="item.Id">
            <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
            <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
          </li>
        </ul>
        <div class="label">特殊说明：</div>
        <p class="report-content">{{thirdReport.Remark }}</p>
      </div>
    </section>
    <!-- 需求三方报告 end -->
    <!-- 服务报告 -->
    <section class="report" v-if="serviceReport.IsExist" :style="{height:serviceReport.IsOpen?'auto':'66px'}">
      <div class="module-hd" @click="serviceReport.IsOpen=!serviceReport.IsOpen">
        <h3 class="title">服务报告</h3>
        <van-icon name="arrow-down" :class="{'active':serviceReport.IsOpen}" />
      </div>
      <div class="wrapper">
        <div class="label">工程师日志：</div>
        <ul class="engineer-list">
          <li 
            class="is-link" 
            v-for="(item,index) in serviceReport.EngineerWorkLogList" 
            :key="item.UserId" 
            @click="$router.push({path:'/engineerReport',query:{userId:item.UserId,jobId}})"
          >
            <span class="label">工程师{{index+1}}</span>
            <span class="name">{{item.TrueName}}</span>
            <van-icon name="arrow" />
          </li>
        </ul>
        <div class="label">服务报告：</div>
        <p class="report-content">{{serviceReport.ServiceReport}}</p>
      </div>
    </section>
    <!-- 服务报告 end -->
    <!-- 费用明细 -->
    <section class="bill" v-if="amountInfo.IsExist" :style="{height:amountInfo.IsOpen?'auto':'66px'}">
      <div class="module-hd" @click="amountInfo.IsOpen=!amountInfo.IsOpen">
        <h3 class="title">费用明细</h3>
        <van-icon name="arrow-down" :class="{'active':amountInfo.IsOpen}" />
      </div>
      <div class="wrapper">
        <div class="flex">
          <span class="label">服务费用：</span>
          <div class="value">
            <i class="tax">（含税￥{{amountInfo.WorkLogAmount}}元）</i>
            <span class="amount">￥{{amountInfo.WorkLogAmount_NoTax}}</span>
          </div>
        </div>
        <div class="flex">
          <span class="label">其他费用：</span>
          <div class="value">
            <i class="tax">（含税￥{{amountInfo.OtherTaxAmount}}元）</i>
            <span class="amount">￥{{amountInfo.OtherAmount}}</span>
          </div>
        </div>
        <div class="flex remark" v-if="amountInfo.OtherAmount && amountInfo.OtherAmountRemark">
          <span class="label">备注：</span>
          <div class="value">{{amountInfo.OtherAmountRemark}}</div>
        </div>
        <div class="flex" v-if="amountInfo.OtherAmountFileList.length">
          <span class="label">其他票据：</span>
          <div class="value doc-list">
            <div class="doc-item" v-for="item in amountInfo.OtherAmountFileList" :key="item.Id">
              <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
              <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
            </div>
          </div>
        </div>
        <template v-if="amountInfo.Subsidy==2">
          <div class="flex">
            <span class="label">交通费用：</span>
            <div class="value">
              <i class="tax">（含税￥{{amountInfo.PDTaxAmount}}元）</i>
              <span class="amount">￥{{amountInfo.PDTrafficAmount}}</span>
            </div>
          </div>
          <div class="flex remark" v-if="amountInfo.PDTrafficAmount && amountInfo.TrafficPriceRemark">
            <span class="label">备注：</span>
            <div class="value">{{amountInfo.TrafficPriceRemark}}</div>
          </div>
          <div class="flex" v-if="amountInfo.TrafficAmountFileList.length">
            <span class="label">交通票据：</span>
            <div class="value doc-list">
              <div class="doc-item" v-for="item in amountInfo.TrafficAmountFileList" :key="item.Id">
                <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
                <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
              </div>
            </div>
          </div>
          <div class="flex">
            <span class="label">住宿费用：</span>
            <div class="value">
              <i class="tax">（含税￥{{amountInfo.HousingTaxAmount}}元）</i>
              <span class="amount">￥{{amountInfo.HousingAmount}}</span>
            </div>
          </div>
          <div class="flex remark" v-if="amountInfo.HousingAmount && amountInfo.HousingPriceRemark">
            <span class="label">备注：</span>
            <div class="value">{{amountInfo.HousingPriceRemark}}</div>
          </div>
          <div class="flex" v-if="amountInfo.HousingAmountFileList.length">
            <span class="label">住宿票据：</span>
            <div class="value doc-list">
              <div class="doc-item" v-for="item in amountInfo.HousingAmountFileList" :key="item.Id">
                <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
                <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
              </div>
            </div>
          </div>
        </template>
        <div class="flex" v-if="amountInfo.OvertimeAmount_NoTax">
          <span class="label">加班费用：</span>
          <div class="value">
            <i class="tax">（含税￥{{amountInfo.OvertimeAmount }}元）</i>
            <span class="amount">￥{{amountInfo.OvertimeAmount_NoTax }}</span>
          </div>
        </div>
        <div class="flex remark" v-if="amountInfo.OvertimeAmount_NoTax && amountInfo.OvertimeAmountRemark">
          <span class="label">备注：</span>
          <div class="value">{{amountInfo.OvertimeAmountRemark}}</div>
        </div>
        <div class="flex" v-if="amountInfo.OvertimeAmountFileList.length">
          <span class="label">加班票据：</span>
          <div class="value doc-list">
            <div class="doc-item" v-for="item in amountInfo.OvertimeAmountFileList" :key="item.Id">
              <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
              <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
            </div>
          </div>
        </div>
        <template v-if="amountInfo.Subsidy==3 || amountInfo.Subsidy==4">
          <div class="flex" v-if="amountInfo.SubsidyAmount">
            <span class="label">补助费用：</span>
            <div class="value">
              <i class="tax">（含税￥{{amountInfo.SubsidyAmount}}元）</i>
              <span class="amount">￥{{amountInfo.SubsidyAmount_NoTax }}</span>
            </div>
          </div>
        </template>
        <div class="flex" v-if="amountInfo.TotalAmount">
          <span class="label">总计：</span>
          <div class="value">￥{{amountInfo.TotalAmount }}</div>
        </div>
        <div class="flex preaid">
          <span class="label">总押金：</span>
          <div class="value">
            <span class="amount">￥{{amountInfo.PayedDeposit }}</span>
          </div>
        </div>
        <div class="flex extra" v-if="amountInfo.TobePayAmount">
          <span class="label" v-if="amountInfo.DifferStatus==1">需要退还金额：</span>
          <span class="label" v-if="amountInfo.DifferStatus==0 || amountInfo.DifferStatus==2">需要额外支付金额：</span>
          <div class="value">￥{{amountInfo.TobePayAmount}}</div>
        </div>
      </div>
    </section>
    <!-- 费用明细 end -->
    <!-- 服务流程 -->
    <section class="process" v-if="serviceProgress.IsExist" :style="{height:serviceProgress.IsOpen?'auto':'66px'}">
      <div class="module-hd" @click="serviceProgress.IsOpen=!serviceProgress.IsOpen">
        <h3 class="title">服务流程</h3>
        <van-icon name="arrow-down" :class="{'active':serviceProgress.IsOpen}" />
      </div>
      <service-process :jobId='jobId' :show="serviceProgress.IsOpen" @call="call"></service-process>
    </section>
    <!-- 服务流程 end -->
    <!-- 接单方 -->
    <section class="receiver" v-if="pickJob.IsExist">
      <div class="module-hd" v-if="pickJob.Company">
        <h3 class="title">接单方</h3>
      </div>
      <div class="receiver-dl" v-if="pickJob.Company">
        <div class="dt">
          <img class="avatar" :src="pickJob.Company.Logo" alt="">
        </div>
        <div class="dd">
          <div class="name" @click="call(pickJob.Company.HandSet)" >
            <span>{{pickJob.Company.CompanyName}}</span>
            <van-icon name="phone"/>
          </div>
          <div class="location">
            <van-icon name="location" />
            <span>{{pickJob.Company.ProvinceName}}·{{pickJob.Company.CityName}}</span>
          </div>
        </div>
      </div>
      <div class="module-hd" v-if="pickJob.EngineerList && pickJob.EngineerList.length">
        <h3 class="title">服务工程师</h3>
      </div>
      <div class="receiver-dl" v-for="(item,index) in pickJob.EngineerList" :key="'engineer'+index">
        <div class="dt">
          <img class="avatar" :src="item.HeadImg" alt="">
        </div>
        <div class="dd">
          <div class="name" @click="call(item.HandSet)" ><span>{{item.TrueName}}</span><van-icon name="phone"/></div>
          <div class="location">
            <van-icon name="location" />
            <span>{{item.ProvinceName}}·{{item.CityName}}</span>
          </div>
        </div>
      </div>
    </section>
    <!-- 接单方 end -->
    <!-- 评价 -->
    <section class="comment" v-if="evaluation.IsExist">
      <div class="module-hd" >
        <h3 class="title">评价</h3>
      </div>
      <!-- <div class="comment-item overall-item">
        <span class="label">总体评价：</span>
        <div class="value">
          <span class="overall" v-if="evaluation.EvaluateLevel==1">好</span>
          <span class="overall" v-if="evaluation.EvaluateLevel==3">一般</span>
          <span class="overall" v-if="evaluation.EvaluateLevel==4">差</span>
        </div>
      </div> -->
      <div class="comment-item">
        <span class="label">言行举止：</span>
        <div class="value">
          <van-rate v-model="evaluation.BehaviorLevel" readonly :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
        </div>
        <span class="evaluate-text">{{evaluation.BehaviorLevel | formatEvaluate}}</span>
      </div>
      <div class="comment-item">
        <span class="label">技术能力：</span>
        <div class="value">
          <van-rate v-model="evaluation.TechnicalLevel" readonly :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
        </div>
        <span class="evaluate-text">{{evaluation.TechnicalLevel | formatEvaluate}}</span>
      </div>
      <div class="comment-item">
        <span class="label">服务完成质量：</span>
        <div class="value">
          <van-rate v-model="evaluation.ServiceQualityLevel" readonly :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
        </div>
        <span class="evaluate-text">{{evaluation.ServiceQualityLevel | formatEvaluate}}</span>
      </div>
      <div class="comment-item">
        <span class="label">速派对接服务：</span>
        <div class="value">
          <van-rate v-model="evaluation.ButtjointLevel" readonly :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
        </div>
        <span class="evaluate-text">{{evaluation.ButtjointLevel | formatEvaluate}}</span>
      </div>
      <!-- <div class="question-item">
        <span class="label">1、S2S工程师提供的服务报告内容是否属实？</span>
        <div class="radio-wrap">
          <van-radio v-model="evaluation.IsReal" :name="true" v-if="evaluation.IsReal==true">是</van-radio>
          <van-radio v-model="evaluation.IsReal" :name="false" v-if="evaluation.IsReal==false">否</van-radio>
        </div>
      </div>
      <div class="question-item">
        <span class="label">2、此次任务派发的问题是否得到解决？</span>
        <div class="radio-wrap">
          <van-radio v-model="evaluation.IsSolve" :name="true" v-if="evaluation.IsSolve==true">是</van-radio>
          <van-radio v-model="evaluation.IsSolve" :name="false" v-if="evaluation.IsSolve==false">否</van-radio>
        </div>
      </div>
      <div class="comment-desc">{{evaluation.ConmendContent }}</div> -->
    </section>
    <!-- 评价 end -->
    <!-- 推荐投标人 -->
    <section class="receiver" v-if="recommendList.length">
      <div class="module-hd">
        <h3 class="title">推荐投标人</h3>
      </div>
      <div class="receiver-dl" v-for="(item,index) in recommendList" :key="'engineer'+index">
        <div class="dt">
          <img class="avatar" :src="item.HeadPicUrl" alt="">
        </div>
        <div class="dd">
          <div class="name">{{item.AccountName}}</div>
          <div class="location">
            <van-icon name="location" />
            <span>{{item.Address}}</span>
          </div>
          <div class="bottom-flex">
            <mark :class="['title-mark',{'mark1':item.UserType==1,'mark2':item.UserType==2}]">{{item.RoleName}}</mark>
            <button class="btn-invite" v-if="item.InviteStatus==1" @click="invite(item.UserCode)">邀请投标</button>
            <span class="btn-invite disabled" v-if="item.InviteStatus==2">已邀请</span>
          </div>
        </div>
      </div>
    </section>
    <!-- 推荐投标人 end -->
    <!-- 底部按钮 -->
    <footer class="footer" v-if="footerStatus==1">
      <button class="btn-block flex1" @click="showCancelReason=true">取消工单</button>
    </footer>
    <footer class="footer" v-if="footerStatus==2">
      <button class="btn-block flex1">重新发单</button>
    </footer>
    <footer class="footer" v-if="footerStatus==3">
      <span class="btn-block" @click="showCancelReason=true">取消工单</span>
      <div class="text">已投标{{allData.TenderCount}}人</div>
      <button class="btn-primary" @click="$router.push({path:'/bidderList',query:{jobNo:allData.JobNo}})">选择投标人</button>
    </footer>
    <footer class="footer" v-if="footerStatus==4">
      <span class="btn-block" @click="showCancelReason=true">取消工单</span>
      <span class="btn-block" @click="addDesposit">追加押金</span>
      <div class="count-down-wrapper">
        <span class="label">倒计时</span>
        <van-count-down :time="countDownTime" format="HH:mm:ss">
          <template v-slot="timeData">
            <span class="block">{{ timeData.hours>9?timeData.hours:'0'+timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes>9?timeData.minutes:'0'+timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds>9?timeData.seconds:'0'+timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
    </footer>
    <footer class="footer" v-if="footerStatus==5 && productInfo.JobType!=8">
      <button class="btn-block flex1" @click="addDesposit">追加押金</button>
    </footer>
    <footer class="footer" v-if="footerStatus==6">
      <button class="btn-block flex1" @click="showCancelReason=true">取消工单</button>
      <button class="btn-primary flex1" @click="$router.push({path:'/allocateMenu',query:{jobId}})">分配工单</button>
    </footer>
    <footer class="footer" v-if="footerStatus==8">
      <button class="btn-block flex1" @click="ensure">确认</button>
    </footer>
    <footer class="footer" v-if="footerStatus==7">
      <div class="text" v-if="amountInfo.DifferStatus==0 || amountInfo.DifferStatus==2">支付<i class="price">￥{{amountInfo.TobePayAmount | formatPrice}}</i></div>
      <div class="text" v-if="amountInfo.DifferStatus==1">退还<i class="price">￥{{amountInfo.TobePayAmount | formatPrice}}</i></div>
      <button class="btn-primary" @click="agreeTap">同意</button>
    </footer>
    <!-- <footer class="footer" v-if="footerStatus==9">
      <div class="desc">您的评价有助于我们改进服务</div>
      <button class="btn-primary" @click="$router.push({path:'/evaluate',query:{jobNo:allData.JobNo}})">评价</button>
    </footer> -->
    <footer class="footer" v-if="footerStatus==10">
      <div class="desc">复制链接到手机默认浏览器下载</div>
      <button class="btn-primary" @click="download">一键复制</button>
    </footer>
    <footer class="footer" v-if="footerStatus==11">
      <span class="btn-block" @click="showCancelReason=true">取消工单</span>
      <div class="text">总计：<i class="price">￥{{desposit.RealDepositAmount | formatPrice}}</i></div>
      <button class="btn-primary" @click="toPay">支付</button>
    </footer>
    <!-- 底部按钮 end -->
    <van-dialog 
      v-model="showAddDesposit" 
      class="desposit-dialog" 
      title="请输入押金" 
      :before-close="confirmDesposit" 
      show-cancel-button
      close-on-click-overlay>
      <div class="form">
        <input class="input" type="number" v-model="despositAdd" placeholder="">
      </div>
    </van-dialog>
    <van-popup v-model="isShowPwd">
      <password-dialog @confirm="agreePay" @close="isShowPwd=false"></password-dialog>
    </van-popup>
    <van-popup v-model="isShowEvaluate" position="bottom">
      <div class="comment-form" >
        <h3 class="form-title">评价</h3>
        <div class="comment-item">
          <span class="label">工程师技术能力</span>
          <van-rate v-model="evForm.TechnicalLevel" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.TechnicalLevel | formatEvaluate}}</span>
        </div>
        <div class="comment-item">
          <span class="label">工程师言行举止</span>
          <van-rate v-model="evForm.BehaviorLevel" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.BehaviorLevel | formatEvaluate}}</span>
        </div>
        <div class="comment-item">
          <span class="label">工单服务完成质量</span>
          <van-rate v-model="evForm.ServiceQualityLevel" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.ServiceQualityLevel | formatEvaluate}}</span>
        </div>
        <div class="comment-item">
          <span class="label">速派对接服务</span>
          <van-rate v-model="evForm.ButtjointLevel" :size="20" color="#E60012" void-icon="star" void-color="#ebebeb" />
          <span class="evaluate-text">{{evForm.ButtjointLevel | formatEvaluate}}</span>
        </div>
        <button class="btn-primary" @click="confirmEvaluate">提交</button>
      </div>
    </van-popup>
    <van-popup class="cancel-reason-popup" v-model="showCancelReason" position="bottom">
      <h3 class="title">取消原因</h3>
      <van-radio-group v-model="cancelReasonId">
        <van-cell-group>
          <van-cell v-for="item in cancelReason" :key="item.Id" :title="item.Reason" clickable @click="cancelReasonId = item.Id">
            <template #right-icon>
              <van-radio :name="item.Id" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="btn-primary" @click="cancelOrder">确认删除</div>
    </van-popup>
    <van-dialog v-model="showPrompt" class="prompt-call" :before-close="confirmCall" close-on-click-overlay>
      <div class="tel-form">
        <van-icon name="phone-o" />
        <input class="input" type="tel" v-model="contacts" placeholder="请输入您的联系方式">
      </div>
    </van-dialog>
  </div>
</template>
<script>
import OrderInformartion from '@/components/orderInformation.vue'
import ServiceProcess from '@/components/serviceProcess.vue'
import PasswordDialog from '@/components/passwordDialog.vue'
import {
  GetAppSendJobViewInfo,
  CancelJob,
  GetJobRecommendReceiverList,
  InviteJob,
  CreatePayOrder,
  JobAgreePay,
  AxbBindPhone,
  GetJobZipFileInfo,
  ConfirmInternalJobServiceReport,
  SubmitJobServiceCommend,
  GetOperationReason
} from '@/common/api.js'
import {TEL} from '@/common/util.js'
import { ImagePreview } from 'vant';
import {mapState} from 'vuex'
import valid from '@/common/validate.js'
export default {
  name:'OrderProcess',
  components:{
    OrderInformartion,
    PasswordDialog,
    ServiceProcess,
  },
  data(){
    return{
      allData:{},
      title:'发单流程',
      statusIcon:'status-wait',
      statusDesc:'',
      jobId:0,
      footerStatus:0,
      productInfo:{},//工单信息
      desposit:{},//押金明细
      pickJob:{},//接单方
      serviceReport:{},//服务报告
      jobProgress:{},//工单流程
      serviceProgress:{},//服务流程
      terminationSettle:{},//
      amountInfo:{},//费用明细
      thirdReport:{},//三方报告
      evaluation:{},//评价
      countDownTime:0,//倒计时
      showPrompt:false,//电话弹框
      // showAddDesposit:false,//追加金额弹框
      phone:'',
      contacts:'',//
      recommendList:[],//推荐接单人
      // despositAdd:'',
      isShowPwd:false,
      password:'',
      groupId:'',
      isShowEvaluate:false,
      evForm:{
        TechnicalLevel:0,
        BehaviorLevel:0,
        ServiceQualityLevel:0,
        ButtjointLevel:0,
      },
      cancelReason:[],//取消原因
      cancelReasonId:0,
      showCancelReason:false,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  filters:{
    formatWorkday(value){
      var str;
      switch (value) {
        case 1:
          str='工作日';
          break;
        case 2:
          str='周末';
          break;
        case 3:
          str='节假日';
          break;
      }
      return str;
    },
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
  mounted() {
    this.jobId=this.$route.query.jobId;
    this.init();
  },
  methods: {
    init(){
      GetAppSendJobViewInfo({jobId:this.jobId}).then(r=>{
        if(r.Result==1){
          this.allData=r.Data;
          this.groupId=r.Data.EasemobGroupId;
          this.productInfo=r.Data.Job;
          this.desposit=r.Data.SendDesposit;
          this.pickJob=r.Data.PickJob;
          this.serviceReport=r.Data.ServiceReport;
          this.jobProgress=r.Data.JobProgress;
          this.serviceProgress=r.Data.JobProgress;
          this.thirdReport=r.Data.ThirdReport;
          this.amountInfo=r.Data.AmountInfo;
          this.terminationSettle =r.Data.TerminationSettle;
          this.evaluation=r.Data.JobEvaluation;
          //推荐人列表
          let Recommend=r.Data.InviteViewModel;
          if(Recommend){
            this.recommendList=Recommend.RecommendReceiverList||[];
          }
          //获取倒计时时间
          if(this.productInfo.ReleaseDate){
            let time=new Date(this.productInfo.ReleaseDate).getTime();
            let hour=r.Data.JobConfig.ResponseTime || 0;
            let targetTime=time+(hour*60*60*1000);
            let now=new Date().getTime();
            if(targetTime>now){
              this.countDownTime=targetTime-now;
            }else{
              this.countDownTime=0;
            }
          }
          this.setTitle(r.Data.JobStep);
        }else{
          this.$toast(r.Message);
        }
      })
      GetOperationReason({
        type:1,
      }).then(r=>{
        if(r.Result==1){
          this.cancelReason=r.Data || [];
        }
      })
    },
    //邀请接单
    invite(code){
      InviteJob({
        JobNo:this.allData.JobNo,
        UserCode:code
      }).then(r=>{
        if(r.Result==1){
          this.init();
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //根据状态设置标题
    setTitle(step){
      switch (step) {
        case 10:
          this.setStatus('审核中','status-wait','您的工单正在审核，请耐心等候',1);
          break;
        case 11:
          this.setStatus('已完成','status-stop','抱歉！您的工单后台审核不通过，如有疑问请联系客服',2);
          break;
        case 12:
          this.setStatus('投标中','status-wait','工单正在投标中，请选择投标人',1);
          break;
        case 20:
          if(this.productInfo.JobType==1){
            //自由平台
            this.setStatus('投标中','status-wait','工单正在投标中，请选择投标人',3);
          }
          if(this.productInfo.JobType==6){
            //B2B
            if(this.productInfo.IsProject){
              //项目工单
              this.setStatus('待支付','status-pay','您的工单已通过审核，速派为您匹配了服务站，请尽快支付押金',11);
            }else{
              this.setStatus('待支付','status-pay','工单押金尚未支付',11);
            }
          }
          break;
        case 21:
          this.setStatus('审核中','status-wait','速派正在确认您的汇款信息，请稍候');
          break;
        case 30:
          if(this.productInfo.JobType==8){
            this.setStatus('匹配中','status-wait','已分配服务站，等待对方承接');
          }else{
            var desc='';
            if(this.countDownTime==0){
              //超时未承接
              desc=`抱歉！该工单尚未匹配到合适的服务站，已为您转至速派后台处理。您可以取消工单，或者联系${TEL}客服`
            }else{
              desc=`正在为您匹配服务站和工程师。速派承诺${this.allData.JobConfig.ResponseTime}小时响应，请耐心等候！`
            }
            this.setStatus('匹配中','status-wait',desc,4);
          }
          break;
        case 31:
          if(this.productInfo.JobType==8){
            this.setStatus('匹配中','status-deposit','已成功分配工单，等待接单方分配工程师');
          }else{
            this.setStatus('签约中','status-wait','您已支付押金，接单方正在指派工程师……',5);
          }
          break;
        case 32:
          this.setStatus('匹配中','status-wait',`抱歉！该工单尚未匹配到合适的服务站，已为您转至速派后台处理。您可以取消工单，或者联系${TEL}客服`,4);
          break;
        case 33:
          this.setStatus('匹配中','status-hand','您已成功发布工单，请分配工单',6);
          break;
        case 40:
          this.setStatus('服务中','status-service','分配工程师完成，待下载服务单',5);
          break;
        case 41:
          this.setStatus('服务中','status-service','工程师已下载服务单，等待工程师出发',5);
          break;
        case 42:
          this.setStatus('服务中','status-service','工程师已出发，等待工程师到达现场',5);
          break;
        case 43:
          this.setStatus('服务中','status-service','工程师已到达现场，等待确认任务',5);
          break;
        case 44:
          this.setStatus('服务中','status-service','工程师已确认任务，开始服务',5);
          break;
        case 45:
          this.setStatus('服务中','status-service','现场服务已完成，等待接单方上传服务报告',5);
          break;
        case 46:
          this.setStatus('服务中','status-service','等待工程师出发',5);
          break;
        case 50:
          this.setStatus('服务完成','status-wait','服务报告正在审核中');
          break;
        case 51:
          this.setStatus('付款中','status-pay','工程师的现场服务已完成，请尽快确认，并付款',7);
          break;
        case 52:
          this.setStatus('服务中','status-confirm','工程师的现场服务已完成，请确认服务报告',8);
          break;
        case 60:
          this.setStatus('评价','status-comment','您已成功付款请评价此次服务',9);
          break;
        case 70:
          this.setStatus('完成','status-finish','恭喜您，服务已完成',10);
          break;
        case 71:
          this.setStatus('已终止','status-stop','该工单已终止');
          break;
        case 80:
          this.setStatus('付款中','status-pay','速派客服已协调终止结算，请查看并结算',7);
          break;
        case 90:
          this.setStatus('已取消','status-warn','该工单已取消');
          break;
        case 100:
          this.setStatus('已关闭','status-stop','该工单已关闭');
          break;
      }
    },
    //设置标题和提示
    setStatus(title,icon='status-wait',desc,foot=0){
      this.title=title;
      this.statusIcon=icon;
      this.statusDesc=desc;
      this.footerStatus=foot;
    },
    chat(){
      this.$router.push({path:'/chat',query:{chatId:this.groupId,type:'group'}})
    },
    //提交电话
    call(contacts){
      if(!contacts){
          this.$toast('对方电话有误，请联系速派400-1100-243！')
          return;
      }
      this.phone=contacts;
      this.showPrompt=true;
    },
    //三方联系接单人
    confirmCall(action,done){
      if(action==='confirm'){
        var that=this;
        if(!valid.link(this.contacts)){
            this.$toast('请输入正确的电话号码或者手机号！');
            done(false);
            return;
        }
        AxbBindPhone({
          jobId:this.jobId,
          isLongTime:false,
          aNumber:this.contacts,
          bNumber:this.phone,
          platform:'pcweb'
        }).then(r=>{
            if(r.Result==1){
                // this.$toast('拨打成功！');
                window.location.href='tel:'+r.Data.PrivateNumber;
            }else{
                this.$toast(r.Message);
            }
            done();
            this.showPrompt=false;
        })
      }
      done();
    },
    //预览图片
    preview(url){
      ImagePreview([url]);
    },
    //取消工单
    cancelOrder(){
      if(!this.cancelReasonId){
        this.$toast('请选择取消原因');
        return;
      }
      CancelJob({
        JobNo:this.allData.JobNo,
        CancelReasonId:this.cancelReasonId,
        UserCode:this.userData.UserCode
      }).then(r=>{
        if(r.Result==1){
          this.showCancelReason=false;
          this.cancelReasonId=0;
          this.init();
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //联系客服
    callService(){
      var that=this;
      this.$dialog.confirm({
        message:'立即联系 速派客服',
        confirmButtonText:'立即联系',
        cancelButtonText:'暂不联系'
      }).then(()=>{
        window.location.href='tel:'+TEL;
      })
    },
    //追加押金
    addDesposit(){
      // this.despositAdd='';
      // this.showAddDesposit=true;
      this.$store.commit('setJobId',this.jobId);
      this.$store.commit('triggerDespositDialog',true);
    },
    //提交追加押金金额
    // confirmDesposit(action,done){
    //   if(action==='confirm'){
    //     var that=this;
    //     if(!valid.positiveInt(this.despositAdd)){
    //         this.$toast('请输入正整数！');
    //         done(false);
    //         return;
    //     }
    //     CreatePayOrder({
    //       Amount:this.despositAdd,
    //       OuterOrderType:1,
    //       OuterOrderId:this.jobId,
    //       TradeType:3,
    //     }).then(r=>{
    //       if(r.Result==1){
    //         this.$router.push({path:'/payDeposit',query:{jobId:this.jobId,payId:r.Data.PayId,from:2}});
    //       }else{
    //         this.$toast(r.Message);
    //       }
    //     })
    //   }else{
    //     done();
    //     this.showAddDesposit=false;
    //   }
    // },
    //支付
    toPay(){
      CreatePayOrder({
        Amount:this.desposit.RealDepositAmount,
        OuterOrderType:1,
        OuterOrderId:this.jobId,
        TradeType:1,
      }).then(r=>{
        if(r.Result==1){
          this.$router.push({path:'/payDeposit',query:{jobId:this.jobId,payId:r.Data.PayId,from:2}});
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //同意按钮点击
    agreeTap(){
      if(this.allData.IsEvaluate){
        this.confirmReport();
      }else{
        this.isShowEvaluate=true
      }
    },
    //确认服务报告评价后支付
    confirmReport(){
      if(this.amountInfo.DifferStatus==2){
        this.agreePay();
      }else{
        this.isShowPwd=true;
      }
    },
    //同意支付
    agreePay(password){
      let params={
        jobId:this.jobId,
        payPwd:password
      }
      var text=this.userData.UserCode.substr(0,1);
      if(text=='e'){
        params['loginCompanyId']=this.userData.CompanyId;
      }
      if(text=='p'){
        params['loginUserId']=this.userData.UserId;
      }
      JobAgreePay(params).then(r=>{
        if(r.Result==1){
          if(r.Data.IsAppendPay){
            this.$router.push({path:'/payDeposit',query:{jobId:this.jobId,payId:r.Data.PayId,from:2}});
          }else{
            this.init();
          }
          this.isShowPwd=false;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //下载服务单
    download(){
      let params={
        jobId:this.jobId,
      }
      var text=this.userData.UserCode.substr(0,1);
      if(text=='e'){
        params['loginCompanyId']=this.userData.CompanyId;
      }
      if(text=='p'){
        params['loginUserId']=this.userData.UserId;
      }
      GetJobZipFileInfo(params).then(r=>{
        if(r.Result==1){
          // window.location.href=r.Data.FileUrl;
          this.copyToClip(r.Data.FileUrl);
        }
      })
    },
    copyToClip(content) {
        var aux = document.createElement("input"); 
        aux.setAttribute("value", content); 
        document.body.appendChild(aux); 
        aux.select();
        document.execCommand("copy"); 
        document.body.removeChild(aux);
        this.$toast("复制成功");
    },
    //内部工单发单方确认
    ensure(){
      ConfirmInternalJobServiceReport({
        JobNo:this.allData.JobNo,
      }).then(r=>{
        this.$toast(r.Message);
        if(r.Result==1){
          this.init();
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //提交评价
      confirmEvaluate(){
          if(!this.evForm.TechnicalLevel){
              this.$toast('请评价技术能力！');
              return;
          }
          if(!this.evForm.BehaviorLevel){
              this.$toast('请评价言行举止！');
              return;
          }
          if(!this.evForm.ServiceQualityLevel){
              this.$toast('请评价服务完成质量！');
              return;
          }
          if(!this.evForm.ButtjointLevel){
              this.$toast('请评价速派对接服务！');
              return;
          }
          SubmitJobServiceCommend({
              JobNo:this.allData.JobNo,
              UserCode:this.userData.UserCode,
              ...this.evForm,
          }).then(r=>{
              this.showEvaluate=false;
              if(r.Result==1){
                  this.confirmReport();
              }else{
                  this.$toast(r.Message);
              }
          })
      }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.orderProcess{
  padding-top: 46px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 46px);
  .header-btn{
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    .icon-chat{
      display: inline-block;
      width: 20px;
      height: 20px;
      background:url('~@/assets/orderProcess/icon-chat2.png') no-repeat center;
      background-size: contain;
      margin-right: 4px;
    }
  }
  &.has-footer{
    padding-bottom: 50px;
  }
  .head{
    width: 100%;
    height:px2rem(220px);
    @include bg('~static/image/order-process-bg.png');
    .main{
      width: 80%;
      height: px2rem(200px);
      position: relative;
      z-index: 2;
      top: px2rem(64px);
      background-color: #fff;
      box-shadow:0px 2px 10px 0px rgba(34,23,20,0.1);
      @include radius;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 10px 18px;
    }
    .icon{
      width: px2rem(64px);
      height: px2rem(64px);
      margin-right: 9px;
      &.status-wait{
        @include bg('~@/assets/orderProcess/status-wait.png');
      }
      &.status-comment{
        @include bg('~@/assets/orderProcess/status-comment.png');
      }
      &.status-deposit{
        @include bg('~@/assets/orderProcess/status-deposit.png');
      }
      &.status-delete{
        @include bg('~@/assets/orderProcess/status-delete.png');
      }
      &.status-finish{
        @include bg('~@/assets/orderProcess/status-finish.png');
      }
      &.status-pause{
        @include bg('~@/assets/orderProcess/status-pause.png');
      }
      &.status-pay{
        @include bg('~@/assets/orderProcess/status-pay.png');
      }
      &.status-restart{
        @include bg('~@/assets/orderProcess/status-restart.png');
      }
      &.status-service{
        @include bg('~@/assets/orderProcess/status-service.png');
      }
      &.status-warn{
        @include bg('~@/assets/orderProcess/status-warn.png');
      }
      &.status-stop{
        @include bg('~@/assets/orderProcess/status-stop.png');
      }
      &.status-confirm{
        @include bg('~@/assets/orderProcess/status-confirm.png');
      }
      &.status-hand{
        @include bg('~@/assets/orderProcess/status-hand.png');
      }
    }
    .desc{
      flex: 1;
      min-width: 40px;
      font-size: 13px;
      color: #333;
      font-weight: bold;
      line-height: 20px;
    }
  }
  .module-hd{
    font-size: 18px;
    color: #333;
    line-height: 2;
    @include flex;
    .title{
      flex:1;
      width: 100px;
      font-weight: bold;
      @extend .ellipsis;
    }
    .van-icon-arrow-down{
      transition: all 0.2s linear;
    }
    .van-icon-arrow-down.active{
      transform: rotate(-180deg);
    }
  }
  .deposit{
    padding: 15px;
    margin-top: 10px;
    background-color: #fff;
    overflow: hidden;
    .module-hd{
      margin-bottom: 5px;
      .price{
        font-weight: bold;
        color: $primary;
      }
    }
    .price-module{
      margin-left: -15px;
      margin-right: -15px;
      padding: 8px 15px;
      &.dark{
        background-color: #f9f9f9;
        margin-bottom: 5px;
      }
      &.bb{
        @include bb;
      }
      .flex{
        @include flex;
        line-height: 24px;
        font-size: 14px;
        color: #333;
        &.remark{
          color: #999;
          font-size: 12px;
        }
      }
      .label{
        font-weight: 500;
      }
      .price{
        font-family: $number;
        font-weight: 500;
        color: $primary;
      }
    }
    .price-list{
      overflow-y: auto;
      max-height: 236px;
      >li{
        @include bb;
        padding: 10px 0;
      }
      .flex{
        @include flex;
        margin-bottom: 5px;
        line-height: 24px;
      }
      .date{
        font-size: 15px;
        color: #333;
        font-weight: bold;
      }
      .label{
        font-size: 14px;
        color: #666;
        line-height: 24px;
      }
      .price{
        font-size: 16px;
        color: #333;
        font-family: $number;
        font-weight: 500;
        line-height: 24px;
      }
      .date-type,.men{
        font-size: 14px;
        color: #333;
      }
    }
    .project-price{
      padding-top: 5px;
      padding-bottom: 5px;
      .flex{
        @include flex;
        font-size: 14px;
        color: #333;
        line-height: 24px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .value{
        font-family: $number;
        font-weight: 500;
      }
    }
  }
  .footer{
    box-shadow:0px 5px 20px 0px rgba(34,23,20,0.1);
    @include flex;
    z-index: 9;
    .text{
      flex: 1;
      text-align: right;
      padding-right: 12px;
      font-size: 12px;
      color: #333;
    }
    .desc{
      flex: 1;
      text-align: right;
      padding-right: 12px;
      font-size: 12px;
      color: #999;
    }
    .price{
      font-size: 18px;
      color: $primary;
      font-weight: 500;
      font-family: $number;
    }
    .btn-primary{
      width: px2rem(300px);
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #fff;
      &:active{
        background-color: $active;
      }
    }
    .count-down-wrapper{
      margin-right: 15px;
      min-width: 172px;
    }
    .btn-block{
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      color: $primary;
      text-align: center;
      font-size: 16px;
      padding-left: 15px;
      padding-right: 15px;
      white-space: nowrap;
      &:active{
        background-color: #f8f8f8;
      }
    }
    .flex1{
      flex: 1;
    }
  }
  .report{
    overflow: hidden;
    padding: 15px;
    background-color: #fff;
    margin-top: 10px;
    .wrapper{
      margin-top: 20px;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .engineer-list{
      margin-bottom: 10px;
      .is-link{
        margin-bottom: 15px;
        box-shadow:0px 2px 20px 0px rgba(34,23,20,0.1);
        background-color: #fff;
        height: 60px;
        padding: 20px 10px;
        @include flex;
      }
      .label{
        font-weight: normal;
        margin-bottom: 0;
        flex: 1;
      }
      .name{
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
      .van-icon-arrow{
        font-size: 18px;
        color: #333;
      }
    }
    .report-content{
      font-size: 14px;
      color: #999;
      line-height: 24px;
    }
  }
  .process{
    overflow: hidden;
    padding: 15px;
    background-color: #fff;
    margin-top: 10px;
    .module-hd{
      margin-bottom: 20px;
    }
  }
  .receiver{
    padding: 15px 15px 10px;
    background-color: #fff;
    margin-top: 10px;
    .receiver-dl{
      @include flex;
      padding: 10px 0;
      .dt{
        width: px2rem(200px);
        height: px2rem(200px);
        margin-right: 20px;
      }
      .avatar{
        display: block;
        width: 100%;
        height: 100%;
        @include radius(200px);
      }
      .dd{
        flex: 1;
      }
      .name{
        font-size: 16px;
        color: #333;
        font-weight: 500;
        line-height: 24px;
        display: flex;
      }
      .van-icon-phone{
        color: $primary;
        margin-left: 6px;
        font-size: 20px;
      }
      .location{
        font-size: 14px;
        color: #666;
        line-height: 24px;
        display: flex;
        align-items: center;
        margin-top: 15px;
      }
      .van-icon-location{
        font-size: 20px;
        margin-right: 6px;
        color: $primary;
      }
    }
    .bottom-flex{
      @include flex;
      width: 100%;
      margin-top: 10px;
      .title-mark{
        font-size: 9px;
        padding: 0 3px;
        height: 16px;
        line-height: 16px;
        color: #fff;
      }
      .mark1{
        background-color: #FD8F28;
      }
      .mark2{
        background-color: #027B21;
      }
    }
    .btn-invite{
      width: 70px;
      height: 24px;
      border: 1px solid $primary;
      font-size: 12px;
      color: $primary;
      line-height: 22px;
      text-align: center;
      background-color: #fff;
      @include radius(24px);
      &.disabled{
        border-color: #cdcdcd;
        color: #999;
      }
    }
  }
  .third-report{
    overflow: hidden;
    padding: 15px;
    background-color: #fff;
    margin-top: 10px;
    .wrapper{
      margin-top: 20px;
    }
    .file-list{
      width: 100%;
      overflow: hidden;
      >li{
        width: px2rem(160px);
        height: px2rem(160px);
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
      .pic{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .report-content{
      font-size: 14px;
      color: #999;
      line-height: 24px;
    }
  }
  .bill{
    overflow: hidden;
    padding: 15px;
    background-color: #fff;
    margin-top: 10px;
    .wrapper{
      margin: 10px -15px -10px;
    }
    .flex{
      @include flex('flex-start');
      padding: 10px 15px;
      color: #333;
    }
    .label{
      font-size: 14px;
      line-height: 24px;
    }
    .value{
      font-size: 14px;
      line-height: 24px;
      text-align: right;
    }
    .amount{
      font-family:$number;
      font-weight: 500;
    }
    .tax{
      font-size: 12px;
      color: $primary;
    }
    .remark{
      color: #999;
    }
    .extra{
      color: $primary;
      @include bt;
    }
    .doc-list{
      overflow: hidden;
    }
    .doc-item{
      float: left;
      width: px2rem(160px);
      height: px2rem(160px);
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .pic{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .comment{
    padding: 15px;
    background-color: #fff;
    margin-top: 10px;
    .comment-item{
      font-size: 14px;
      line-height: 24px;
      display: flex;
      padding-top: 6px;
      padding-bottom: 6px;
      &.overall-item{
        .label{
          color: #333;
        }
      }
      .label{
        color: #666;
        width: 7em;
      }
      .value{
        flex: 1;
        margin-left: 10px;
      }
      .evaluate-text{
        font-size: 12px;
        color: #999;
      }
      .overall{
        display: block;
        width: 50px;
        padding: 0 10px;
        @include radius(20px);
        background-color: $primary;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        text-align: center;
      }
    }
    .question-item{
      padding: 6px 0;
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
      .van-icon-success{
        border: 1px solid $primary;
        padding: 2px;
        background-clip: content-box;
        background-color: $primary;
        &:before{
          visibility: hidden;
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
      margin-top: 10px;
      margin-bottom:10px;
    }
  }
  .comment-form{
    width: 100%;
    padding: 10px 15px;
    overflow: hidden;
    .form-title{
      text-align: center;
      font-size: 18px;
      line-height: 2;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .comment-item{
      font-size: 14px;
      line-height: 24px;
      display: flex;
      padding: 6px 0px;
      .label{
        color: #666;
        width: 9em;
      }
      .van-rate__item{
        margin-right: 10px;
      }
      .evaluate-text{
        font-size: 12px;
        color: #999;
      }
    }
    .btn-primary{
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      margin-bottom: 20px;
      margin-top: 24px;
    }
  }
  .prompt-call{
    padding:30px 20px;
    .tel-form{
      position: relative;
    }
    .van-icon-phone-o{
      font-size: 20px;
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #999;
    }
    .input{
      width: 100%;
      height: 40px;
      line-height: 20px;
      padding: 10px;
      border: 1px solid #e5e5e5;
      margin-bottom: 40px;
      font-size: 16px;
      color: #333;
      padding-left: 40px;
    }
    .van-dialog__confirm, .van-dialog__confirm:active{
      background-color: $primary;
      color: #fff;
    }
  }
  .cancel-reason-popup{
    .title{
      text-align: center;
      font-size: 16px;
      color: #333;
      line-height: 44px;
      font-weight: 500;
    }
    .btn-primary{
      text-align: center;
      height: 44px;
      line-height: 44px;
      margin-top: 10px;
      font-size: 14px;
    }
  }
}
</style>