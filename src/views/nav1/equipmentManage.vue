<template>
    <section>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="id"
                label="id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="项目名称"
               >
            </el-table-column>
            <el-table-column
                label="设备名称"
               >
               <template slot-scope="scope">
                    <div v-for="item in scope.row.equipments" v-bind:key="item.name" class="equipment">
                        <span>{{item.name}}</span>
                        <el-button type="text" size="small" @click="deleteEquipment(scope.row,item.id)">删除设备</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addEquipment(scope.row)">选择设备</el-button>
                    <!-- <el-button type="text" size="small" @click="medify(scope.row)">修改</el-button> -->
                    <!-- <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button> -->
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
            title="添加菜单"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <h1>项目名称:{{twoLevelMenu}}</h1>
            <el-select v-model="equipments" multiple placeholder="请选择" size='medium'>
                <el-option
                    v-for="item in selectEquipments"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>    
    </section>    
</template>
<script>
import { VueEditor } from 'vue2-editor'
import md5 from 'js-md5';
import {getAllTwoLevelMenu,getAllEquipment,saveAssociatedDevice,deleteAssociatedDevice} from '../../api/api';
export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            twoLevelMenu:"",
            id:0,
            nowPage:1,
            total:0,
            selectEquipments:[],
            equipments:[],
            twoLevelMenuId:0
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllTwoLevelMenu({nowPage}).then((result)=>{
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
            getAllEquipment().then((result)=>{
                if(result.code){
                  this.selectEquipments=result.result.result;
                }else{
                this.$message({
                    message: result.result.msg,
                    type: 'warning'
                });
                }
            })
        },
        addEquipment(row){
            this.dialogVisible=true;
            this.twoLevelMenuId=row.id;
            this.twoLevelMenu=row.name;
            this.equipments=[];
            for(let i=0;i<this.tableData.length;i++){
                if(row.id===this.tableData[i].id){
                    for(let item of this.tableData[i].equipments){
                       this.equipments.push(item.id);
                    }
                }
            }
        },
        handleClose(){
          this.dialogVisible=false;
        },
        medify(obj){
            this.dialogVisible=true;
            getEquipment({
                id:obj.id
            }).then((res)=>{
                    if(res.code){
                        let data=res.result
                        this.id=  data.id
                        this.menu=data.menu
                    }
            })
        },
        pageChange(page){
            this.init(page);
            this.nowPage=page;
        },
        deleteEquipment(obj,equipmentId){
            console.log(obj,equipmentId)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteAssociatedDevice({
                      twoLevelMenuId:obj.id,
                      equipmentId
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
        save(){
            console.log(this.id,this.equipments)
            if(this.equipments.length===0){
                return this.$message({
                        message: '请选择设备',
                        type: 'warning'
                });
            }
            if(this.id>0){
                // updateEquipment({
                //     id:this.id,
                //     user:this.user,
                //     password:md5(this.password),
                // }).then((result)=>{
                //     if(result.code){
                //         this.$message({
                //             message: '更新成功',
                //             type: 'success'
                //         });
                //         this.init(this.nowPage);
                //         this.dialogVisible=false;
                //     }else{
                //         this.$message({
                //             message: '更新失败',
                //             type: 'warning'
                //         });
                //     }
                // })
            }else{
                saveAssociatedDevice({
                    twoLevelMenuId:this.twoLevelMenuId,
                    equipments:this.equipments,
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
        }
    },
    components: {
      VueEditor
    },
}
</script>
<style lang="less" scoped>
  section{
      .add{
          margin: 10px;
      }
     .page{
          text-align: center;
          margin: 30px auto;
      }
      .equipment{
          span{
              margin: 10px;
          }
      }
  }
</style>
