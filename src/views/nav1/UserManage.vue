<template>
    <section>
        <el-button class="add" @click="addCompany">创建公司</el-button>
        <!-- <el-button class="add" @click="addUsers">添加用户</el-button> -->
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                label="序号"
                type="index"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="单位"
               >
            </el-table-column>
            <el-table-column
                label="用户"
                type="expand"
                width="180"
               >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.users" v-bind:key="item.id" class="equipment">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="id：" class="userInfo">
                                <span>{{item.id}}</span>
                            </el-form-item>
                            <el-form-item label="用户名："  class="userInfo"><span>{{item.user}}</span></el-form-item>
                            <el-form-item label="模式："  class="userInfo"><span>{{item.controll?'看控模式':'只看模式'}}</span></el-form-item>
                            <el-form-item label="操作："  class="userInfo">
                                <el-button type="text" size="small" @click="medifyUser(scope.row,item.id)">修改用户</el-button>
                                <el-button type="text" size="small" @click="deleteUser(scope.row,item.id)">删除用户</el-button>
                            </el-form-item>
                        </el-form>
                    </div> 
                </template>
            </el-table-column>
            <el-table-column
                label="设备名"
                width="200">
                <template slot-scope="scope">
                   <div v-for="item in scope.row.equipments" v-bind:key="item.id"> 
                       <span class="equipmentName" >{{item.name}}</span>
                       <el-button type="text" size="small" @click="deleteEquipment(item.id)"> 删除设备</el-button>
                   </div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addUsers(scope.row.id)">添加用户</el-button>
                    <el-button type="text" size="small" @click="addEquipmIent(scope.row)">添加设备</el-button>
                    <el-button type="text" size="small" @click="medifyCompany(scope.row)">修改公司</el-button>
                    <el-button type="text" size="small" @click="deleteCompany(scope.row)">删除公司</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
              <el-pagination
            background
            layout="prev, pager, next"
            @current-change="pageChange"
            :page-size="10"
            :total="total">
        </el-pagination> 
        </div>
        <el-dialog
            :title="companyId===0?'创建公司':'修改公司'"
            :visible.sync="dialogVisibleCompany"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>公司名称</h1> 
              <el-input v-model="company" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleCompany = false">取 消</el-button>
                <el-button type="primary" @click="saveCompany">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="userId===0?'添加用户':'修改用户'"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>用户名</h1> 
              <el-input v-model="user" placeholder="请输入内容"></el-input>
            </div>
            <div class="news">
              <h3>密码</h3> 
              <el-input v-model="password"  type="password" placeholder="请输入内容"></el-input>
            </div>
            <div class="news">
                <el-switch
                    class="model"
                    v-model="onlySee"
                    inactive-text="只看模式"
                    active-text="看控模式"
                >
                </el-switch>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUser">保存</el-button>
            </span>
        </el-dialog>
         <el-dialog
            title="查看设备"
            :visible.sync="dialogVisibleViewEquipment"
            width="60%"
            :before-close="handleCloseViewEquipment">
            <div class="news">
              <h1>单位</h1>
              <span>{{company}}</span>&nbsp;&nbsp;&nbsp;<el-button type="primary" @click="addEquipmIent">添加设备</el-button>
            </div>
            <div class="news">
                <h3>设备名</h3> 
                <div v-for="item of userequipments" v-bind:key="item.name">
                   <span>{{item.name}}</span>&nbsp;&nbsp;
                   
                </div>
            </div>
        </el-dialog> 
        <!-- <el-dialog
            title="查看设备"
            :visible.sync="dialogVisibleViewEquipment"
            width="60%"
            :before-close="handleCloseViewEquipment">
            <div class="news">
              <h1>用户名</h1>
              <span>{{user}}</span>&nbsp;&nbsp;&nbsp;<el-button type="primary" @click="addEquipmIent">添加设备</el-button>
            </div>
            <div class="news">
                <h3>设备名</h3> 
                <div v-for="item of userequipments" v-bind:key="item.name">
                   <span>{{item.name}}</span>&nbsp;&nbsp;
                   <el-button type="text" size="small" @click="deleteEquipment(item.id)"> 删除设备</el-button>
                </div>
            </div>
        </el-dialog>  -->
        <el-dialog
            title="添加设备"
            :visible.sync="dialogVisibleEquipment"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>单位</h1>
              <span>{{company}}</span> 
            </div>
            <div class="news">
                <h3>创建设备名</h3> 
                <el-input v-model="equipmentName" placeholder="请输入内容"></el-input>
                <!-- <el-select v-model="equipmentsId" multiple placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEquipment = false">取 消</el-button>
                <el-button type="primary" @click="saveEquipment">保存</el-button>
            </span>
        </el-dialog>    
    </section>    
</template>
<script>
import { VueEditor } from 'vue2-editor'
import md5 from 'js-md5';
import { saveUser,getAllUser,saveEquipment,getUser,getCompany,updateUser,updateCompany,deleteUser,deleteCompany,addEquipment,getAllEquipment,relevanceEquipment,deleteUserAssociatedDevice,saveCompany,getAllCompany,deleteEquipment} from '../../api/api';
export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            dialogVisibleEquipment: false,
            dialogVisibleCompany:false,
            dialogVisibleViewEquipment:false,
            company:"",
            user:"",
            password:"",
            companyId:0,
            userId:0,
            nowPage:1,
            total:0,
            options: [],
            equipmentName:"",
            equipmentsId: [],
            userequipments:[],
            onlySee: true,
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllCompany({nowPage}).then((result)=>{
                if(result.code){
                this.tableData=result.result.result;
                this.total=result.result.count
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        viewEquipment(company){
            this.company=company.name;
            this.companyId=company.id;
            this.dialogVisibleViewEquipment=true;
            getAllEquipment({companyId:company.id}).then((result)=>{
                if(result.code){
                  this.userequipments=result.result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        addEquipmIent(company){
            this.company=company.name;
            this.companyId=company.id;
            this.dialogVisibleEquipment=true;
            this.equipmentsId=[];
            this.userequipments.forEach(element => {
                this.equipmentsId.push(element.equipmentId);
            });
            getAllEquipment().then((result)=>{
                if(result.code){
                  this.options=result.result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        handleCloseViewEquipment(){
           this.dialogVisibleViewEquipment=false;
        },
        saveEquipment(){
            saveEquipment({companyId:this.companyId,name:this.equipmentName}).then((result)=>{
                if(result.code){
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.dialogVisibleEquipment=false;
                    this.init(this.nowPage);
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        addCompany(){
            this.companyId=0;
            this.company="";
            this.dialogVisibleCompany=true;
        },
        addUsers(companyId){
            this.companyId=companyId;
            this.userId=0;
            this.user="";
            this.password="";
            this.dialogVisible=true;
        },
        handleClose(){
          this.dialogVisible=false;
          this.dialogVisibleEquipment=false;
          this.dialogVisibleCompany=false;
        },
        medifyUser(obj,userId){
            this.dialogVisible=true;
            getUser({
                id:userId
            }).then((res)=>{
                if(res.code){
                    let data=res.result
                    this.userId=data.id
                    this.user=data.user
                    this.onlySee=data.controll?true:false;
                    this.password="";
                }
            })
        },
        medifyCompany(obj){
            this.dialogVisibleCompany=true;
            getCompany({
                id:obj.id
            }).then((res)=>{
                if(res.code){
                    let data=res.result
                    this.companyId=data.id
                    this.company=data.name
                }
            })
        },
        pageChange(page){
            this.init(page);
            this.nowPage=page;
        },
        deleteEquipment(equipmentId){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteEquipment({
                      id:equipmentId
                    }).then((res)=>{
                        if(res.code){
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                          this.init(this.nowPage);
                        }else{
                           this.$message({
                              type: 'info',
                              message: res.result.msg
                           }); 
                        }
                        
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                    console.log(222)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
        },
        deleteUser(obj,userId){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteUser({
                      id:userId
                    }).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        if(this.tableData.length===1&&this.nowPage>1){
                          this.nowPage--;
                        }
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
        },
        deleteCompany(obj){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteCompany({
                      id:obj.id
                    }).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        if(this.tableData.length===1&&this.nowPage>1){
                          this.nowPage--;
                        }
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
        },
        saveUser(){
            if(this.user===""||this.user===null){
               return this.$message({
                        message: '用户名不能为空',
                        type: 'warning'
                    });
            }
            if(this.password===""||this.password===null){
                return this.$message({
                        message: '密码不能为空',
                        type: 'warning'
                    });
            }
            if(this.password.length<8){
                return this.$message({
                        message: '密码长度不能低于8位',
                        type: 'warning'
                    });
            } 
            if(this.userId>0){
                updateUser({
                    id:this.userId,
                    user:this.user,
                    onlySee:this.onlySee,
                    password:md5(this.password),
                }).then((result)=>{
                    if(result.code){
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.init(this.nowPage);
                        this.dialogVisible=false;
                    }else{
                        this.$message({
                            message: '更新失败',
                            type: 'warning'
                        });
                    }
                })
            }else{
                saveUser({
                    companyId:this.companyId,
                    user:this.user,
                    onlySee:this.onlySee,
                    password:md5(this.password),
                }).then((result)=>{
                    if(result.code){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.init(this.nowPage);
                            this.dialogVisible=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }
        },
        saveCompany(){
            if(this.company===""||this.company===null){
               return this.$message({
                        message: '公司名不能为空',
                        type: 'warning'
                    });
            }
            if(this.companyId>0){
                updateCompany({
                    id:this.companyId,
                    name:this.company,
                }).then((result)=>{
                    if(result.code){
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.init(this.nowPage);
                        this.dialogVisibleCompany=false;
                    }else{
                        this.$message({
                            message: '更新失败',
                            type: 'warning'
                        });
                    }
                })
            }else{
                saveCompany({
                    name:this.company,
                }).then((result)=>{
                    if(result.code){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.init(this.nowPage);
                            this.dialogVisibleCompany=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }
        }
    },
    components: {
      VueEditor
    },
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<style lang="less" scoped>
  section{
      .add{
          margin: 10px;
      }
      .page{
          text-align: center;
          margin: 30px auto;
      }
        .model{
          margin-top: 10px;    
        }
          
        .equipmentName{
            text-align: center;
            display: inline-block;
            width: 30px;
        }
      .equipment{
          border-bottom: 2px solid #409EFF; 
          span{
              margin: 10px;
          }
          .userInfo{
              display: block;
              span{
                 margin: 0;
              }
          }
      }
  }
</style>
