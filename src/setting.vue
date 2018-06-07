<template>
    <div>
        <div class="st1">
            <el-table :data="tableData" size="mini" :max-height="350"
                      class="st2"
                      :header-cell-style="{backgroundColor:'#444',color:'#aaa'}"
                      :row-style="{backgroundColor:'#333',color:'#aaa'}">
                <el-table-column label="" width="20"></el-table-column>
                <el-table-column prop="ip" label="ip" width="140"></el-table-column>
                <el-table-column prop="label" label="标签" width="160">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.label"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="enabled" label="监视" width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" active-color="#13ce66"></el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="st4">
            <el-button size="mini" type="primary" @click="dofetch">更新</el-button>
            <el-button size="mini" type="primary" @click="dosave">保存</el-button>
        </div>
    </div>
</template>

<script>
    import cfg from "./config";
    export default {
        data() {
            return {
                tableData:[]
            }
        },
        methods:{
            dofetch() {
                if (!this.$root.influx)
                    return;
                this.$root.influx.query("select ip,last(c00) from surv where time > now() - 72h group by ip")
                    .then(result => {
                        let count  = 0;
                        result.forEach(value=>{
                            let r = this.tableData.find(v=>{return v.ip === value.ip;});
                            if (!r) {
                                this.tableData.push({ip:value.ip, label:'', enabled:false});
                                ++count;
                            }
                        });
                        this.$root.$emit('loginfo', 'endpoints has been updated, ' + count + ' more endpoints added');
                        this.$message.success("更新完成，新增" + count + "个端点");
                    })
                    .catch(error => {
                        this.$root.$emit('logerr', error);
                        this.$message.error(error);
                    });
            },
            dosave() {
                this.$axios.post(cfg.restapi + "/endpoints",{endpoints:this.tableData})
                    .then(response=>{
                        this.$root.$emit('loginfo', 'endpoints has been saved');
                        this.$message.success("已保存");
                    })
                    .catch(error=>{
                        if (error) {
                            this.$root.$emit('logerr', error);
                            this.$message.error(error);
                        }
                    });
            }
        },
        mounted() {
            this.$root.$emit('loginfo', 'trying to get endpoints from ' + cfg.restapi);
            this.$axios.get(cfg.restapi + "/endpoints")
                .then(response=>{
                    this.tableData = response.data;
                    this.$root.$emit('loginfo', 'endpoints has been fetched');
                })
                .catch(error=>{
                    if (error) {
                        this.$root.$emit('logerr', error);
                    }
                });
        }
    }
</script>

<style>
    .st1{
        width:400px;
        height:350px;
        background-color: #333;
        border-radius: 3px;
        overflow: hidden;
    }
    .st2{
        width:100%;
        height:100%;
        background-color: #333;
        border-radius: 3px;
        overflow: hidden;
    }
    .el-table td, .el-table th.is-leaf{
        border-bottom: 1px solid #666;
    }
    .el-table::before{
        background-color: #333;
    }
    .el-checkbox__inner{
        background-color: #555;
        border:1px solid #777;
    }
    .el-input__inner{
        color:#aaa;
        background-color: transparent;
        border:none;
    }
    .st4{
        box-sizing:border-box;
        width:450px;
        height:48px;
        background-color: #111;
        margin-top: 12px;
        border-radius: 3px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #444;
    }
    .el-scrollbar__wrap{
        background-color: #111;
    }
</style>