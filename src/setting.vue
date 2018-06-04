<template>
    <div>
        <div class="st1">
            <el-table :data="tableData" size="mini" :max-height="350"
                      class="st2"
                      header-cell-style="background-color:#444;color:#aaa;"
                      row-style="background-color:#333;color:#aaa;">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="ip" label="ip" width="160"></el-table-column>
                <el-table-column prop="label" label="标签" width="240">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.label"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="st4">
            <el-button size="mini" type="primary">更新</el-button>
            <el-button size="mini" type="primary">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData:[
                    {ip:'10.0.0.13',label:'aaa'},
                    {ip:'10.0.0.131',label:'aaa'},
                    {ip:'10.0.0.132',label:'aaa'},
                    {ip:'10.0.0.133',label:'aaa'},
                    {ip:'10.0.0.134',label:'aaa'},
                    {ip:'10.0.0.135',label:'aaa'},
                    {ip:'10.0.0.136',label:'aaa'},
                    {ip:'10.0.0.137',label:'aaa'},
                    {ip:'10.0.0.138',label:'aaa'},
                    {ip:'10.0.0.139',label:'aaa'},
                    {ip:'10.0.0.123',label:'哈哈哈'},
                    {ip:'10.0.0.199',label:'123456678'}
                    ]
            }
        }
    }
</script>

<style>
    .st1{
        width:450px;
        height:350px;
        background-color: #333;
    }
    .st2{
        width:100%;
        height:100%;
        background-color: #333;
        border: none;
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
        background-color: #333;
        border:none;
    }
    .st4{
        box-sizing:border-box;
        width:450px;
        height:48px;
        background-color: #333;
        margin-top: 12px;
        padding:10px;
        border-radius: 3px;
    }
</style>