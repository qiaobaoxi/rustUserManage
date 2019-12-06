<template>
    <section>
        <!-- <el-button class="add" @click="addUsers">添加用户</el-button> -->
        <div class="menu">
            <span>设备名称</span>
            <el-select v-model="equipmentVale" placeholder="请选择" class="equipment" @change="changeEquipment">
                <el-option
                v-for="item in equipments"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select>
            <el-button type="primary" class="excelBtn" @click="downToExcel">下载成excel</el-button>
            <el-button type="primary" class="excelBtn" @click="downToFile">下载数据文件</el-button>
            <el-button type="primary" class="excelBtn" @click="deleteFile">删除数据文件</el-button>
        </div>
        <div class="table" v-show="isShow">
           <div class="tableHead">
                <div class="date">
                    <span>{{year}}年</span><span>{{month}}月</span><span>{{date}}日</span><span>{{time.slice(0,2)+':'+time.slice(2)}}测</span>
                </div>
                <div class="num">
                    <span>工程号：{{engineerNum}}</span><span>区号:{{areaNum}}</span>
                </div>
                <div class="num">
                    <span>D={{diameter}}</span><span>{{passivation===1?'活化':'钝化'}}</span>
                </div>
                <div class="num">
                    <span>x={{row}}</span><span>y={{column}}</span>
                </div>
                <div class="num">
                    <span>使用天数{{howmanydays}}</span>
                </div>
           </div>
           <div class="tableBody">
                <div v-for="(item,index) in tableData" v-bind:key="index" :style="'width:'+column*80+'px'">
                   <span v-for="(it,idx) in item" v-bind:key="idx" :style="'background-color:'+it.color">{{it.value===65535?'':it.value}}</span>
                </div>
           </div>
        </div>
        <div id="main" style="width: 98%;height: 400px;" v-show="isShow"></div>
    </section>    
</template>
<script>
import echarts from 'echarts';
import {getAllEquipment,getEquipmentData,downToExcel,deleteFile} from '../../api/api';
export default {
    data() {
        return {
            equipments:[],
            equipmentVale:'',
            mergeData:[],
            json_data: [],
            base64:'',
            arrVal:[],
            year:"",
            month:"",
            date:"",
            time:"",
            engineerNum:"",
            areaNum:"",
            diameter:"",
            passivation:"",
            row:"",
            column:'',
            tableData:[],
            isShow:false,
            howmanydays:0
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            this.dataInit();
            getAllEquipment().then((result)=>{
                if(result.code){
                    this.equipments=result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        dataInit(){
            this.equipments=[];
            this.equipmentVale='';
            this.mergeData=[];
            this.json_data=[];
            this.base64='';
            this.arrVal=[];
            this.year="";
            this.month="";
            this.date="";
            this.time="";
            this.engineerNum="";
            this.areaNum="";
            this.diameter="";
            this.passivation="";
            this.row="";
            this.column='';
            this.tableData=[];
            this.isShow=false;
            this.howmanydays=0;
        },
        draw(id){
            let xData=[];
            let yData=[];
            let yData1=[];
            let yData2=[];
            this.tableData=[];
            let length=this.mergeData[6]*this.mergeData[7];
            let x=this.mergeData[8]&0x7f;
            let p=this.mergeData[9]*256+this.mergeData[10]*1;
            this.howmanydays=this.mergeData[9]*256+this.mergeData[10]*1;
            let csfinish=this.mergeData[12]&0xff;
            for(let i=0;i<length;i++){
                xData.push(i+1)
                let yValue=(this.mergeData[i*2+16]+this.mergeData[i*2+17]*256)/100;
                if(yValue*100==65535){
                  yData.push(0);
                  yData2.push(0)
                  yData1.push(yValue);
                }else{
                  yData.push(yValue);
                  yData1.push(this.getRou(yValue*100,p,csfinish,x));
                  yData2.push(this.getRou(yValue*100,p,csfinish,x));
                }
            }
            for(let j=0; j<this.mergeData[6];j++){
                let row=[];
                for(let k=0; k<this.mergeData[7];k++){
                    let color= "green";
                    let value=yData1[j*this.mergeData[7]+k]*100;
                    if(value==65535){
                      color= "#A9A9A9";
                      value=65535   
                    }else if(value>=1000){
                      color="red";
                      value=5;
                    }else if(value>=500){
                      color="orange";
                      value=4;
                    }else if(value>=300){
                      color="yellow";
                      value=3
                    }else if(value>=200){
                      color="blue";
                      value=2
                    }else{
                      value=1;  
                    }
                    row.push({value:value,color});
                }
                this.tableData.push(row);
            }
            this.arrVal=yData;
            this.charts = echarts.init(document.getElementById(id))
            this.charts.setOption({
                 dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        // xAxisIndex: [0, 1]
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 30,
                        end: 70,
                        // xAxisIndex: [0, 1]
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: xData
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '电流密度',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '截面损失率',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                ],
                series: [{
                    data: yData,
                    type: 'line',
                    smooth: true
                },
                {
                    data: yData2,
                    yAxisIndex:1,
                    type: 'line',
                    smooth: true
                }
                ]
               })
        },
         getRou(r,p,csfinish,x)
            {
            let lt;
            lt=p;   //dates
            lt=parseInt(lt*r);    //电流密度i带100倍来计算,dates按365倍计算
            lt=parseInt(lt*csfinish); //alpha按100000倍
            lt=lt+150;
            lt=parseInt(lt/365);   //dates 365倍还原
            lt+=40;
            lt=parseInt(lt/100);   //alpha 还原1000倍,由于直径按mm除，此处要加10倍，所以用/=100
            lt=parseInt(lt/x);   //diameter
            lt=10000-lt;
            lt=parseInt(lt*lt);
            lt+=4000;
            lt=parseInt(lt/10000);
            lt=10000-lt;  //结果为 X%%
            return lt/100;
        } ,
        changeEquipment(){
            this.isShow=false;
            getEquipmentData({equipmentName:this.equipmentVale}).then((result)=>{
                if(result.code){
                    this.isShow=true;
                    let data=JSON.parse(result.result.data)
                    data=data.map((item)=>{
                    item=JSON.parse(item)
                    return item;
                    })
                    let mergeData=[]
                    for(let item of data){
                        mergeData.push(...item);
                    }
                    for(let i=0;i<mergeData.length;i++){
                        mergeData[i]=parseInt(mergeData[i],16)
                    }
                    this.mergeData=mergeData
                    this.year=this.equipmentVale.slice(0,4)
                    this.month=this.equipmentVale.slice(4,6)
                    this.date=this.equipmentVale.slice(6,8)
                    this.time=this.equipmentVale.slice(8,12)
                    this.engineerNum=this.equipmentVale.slice(13,17)
                    this.areaNum=this.equipmentVale.slice(18,20)
                    this.row= this.mergeData[6];
                    this.column= this.mergeData[7];
                    this.diameter= this.mergeData[8];
                    this.passivation= this.mergeData[9];
                    setTimeout(()=>{
                        this.draw("main")
                    }) 
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
                
            })
        },
        downToExcel(){
            if(!this.equipmentVale){
                this.$message({
                    message: "请选择设备",
                    type: 'warning'
                });
            }
            downToExcel({base64:this.charts.getConnectedDataURL({
                pixelRatio: 5,　　//导出的图片分辨率比率,默认是1
                backgroundColor: '#fff',　　//图表背景色
                excludeComponents:[　　//保存图表时忽略的工具组件,默认忽略工具栏
                'toolbox'
                ],
                type:'png'　　//图片类型支持png和jpeg
                }),equipmentName:this.equipmentVale}).then((result)=>{
                    if(result.code){
                        window.location.href=result.result.http
                    }
            })
        },
        downToFile(){
            if(!this.equipmentVale){
                this.$message({
                    message: "请选择设备",
                    type: 'warning'
                });
                return
            }
            window.open("http://47.111.115.157/data/"+this.equipmentVale);
        },
        deleteFile(){
            if(!this.equipmentVale){
                this.$message({
                    message: "请选择设备",
                    type: 'warning'
                });
            }
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteFile({
                      equipmentName:this.equipmentVale
                    }).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.init(this.nowPage);
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
        }
    },
}
</script>
<style lang="less">
   .equipment.el-select{
       width: 300px;
   }
</style>
<style lang="less" scoped>
  section{
      .menu{
        margin: 10px 0;  
        span{
            margin: 10px;
        }
      }
      .add{
          margin: 10px;
      }
     .page{
          text-align: center;
          margin: 30px auto;
      }
      .excelBtn{
          margin-left: 10px;
      }
      .table{
          .tableHead{
            display: flex;
            justify-content:space-between;
          }
          .tableBody{
            margin-top: 10px;
            width: 1000px;
            height: 600px;
            overflow-x:scroll;
            overflow-y:scroll;
            span{
               margin: 4px; 
               vertical-align: middle;
               display: inline-block;
               border:1px solid black;
               text-align: center;
               line-height: 20px;
               width: 20px;
               height: 20px; 
               padding: 4px;
            }
          }
      }
  }
</style>
