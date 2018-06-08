<template>
    <div id="app">
        <el-container style="position: absolute;top:0;bottom: 0;left: 0;width: 100%;">
            <el-header>
                <div style="float:left; color: white;line-height: 60px; height:60px;">录音监视控制台</div>
                <div style="float: right;display: inline-block;background-color: #333;line-height: 60px; height:60px;">
                    <el-select v-model="selgroup" @change="onselgroup" style="width:80px">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="东环" value="东环"></el-option>
                        <el-option label="西环" value="西环"></el-option>
                    </el-select>
                    <el-switch style="margin: 0 20px 0 50px" v-model="refreshing" @change="onrsw" active-color="#13ce66"></el-switch>
                </div>
            </el-header>
            <el-container>
                <el-aside width="64px">
                    <el-menu :router="true" :default-active="$route.path" background-color="#333" active-text-color="#ffd04b" @select="menusel">
                        <el-menu-item index="/"><i class="el-icon-menu"></i></el-menu-item>
                        <el-menu-item index="/2"><i class="el-icon-setting"></i></el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <transition name="el-fade-in-linear" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-main>
                    <el-footer height="150px" style="overflow: hidden">
                        <div id="logs" v-html="logs2html"></div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import * as moment from 'moment'
    import * as Influx from "influx";
    import cfg from "./config";

    export default {
        data() {
            return {
                selgroup: '全部',
                refreshing: false,
                logs:[]
            }
        },
        computed: {
            logs2html() {
                return this.logs.reduce((a, b) => a + '<br>' + b);
            }
        },
        created() {
            this.loginfo("initializing...");
            this.$root.$on('loginfo', this.loginfo);
            this.$root.$on('logerr', this.logerr);
        },
        mounted() {
            (async ()=>{
                try {
                    let res = await this.$axios.get(cfg.restapi + "/tsdb");
                    this.loginfo('tsdb configuration is ' + JSON.stringify(res.data.tsdb));
                    this.$root.influx = new Influx.InfluxDB(res.data.tsdb);
                } catch (error) {
                    this.logerr(error);
                }
            })();
        },
        methods: {
            loginfo(s) {
                this.logs.push(moment().format('YYYY-MM-DD HH:mm:ss') + '&nbsp-&nbsp' + s);
                if (this.logs.length > 9)
                    this.logs.splice(0, 1);
            },
            logerr(s) {
                this.logs.push('<span style="color:red">' + moment().format('YYYY-MM-DD HH:mm:ss') + '&nbsp-&nbsp' + s + '</span>');
                if (this.logs.length > 9)
                    this.logs.splice(0, 1);
            },
            onrsw() {
                this.$root.$emit('sw', this.refreshing);
            },
            menusel(index) {
                if (index === '/2') {
                    this.refreshing = false;
                    this.$root.$emit('sw', this.refreshing);
                }
            },
            onselgroup() {
                this.$root.$emit('selgroup', this.selgroup);
            }
        }
    }
</script>

<style>
    .el-menu {
        border-right-width: 0;
    }

    .el-header {
        background-color: #333;/* #545c64;  #B3C0D1 */
        color: #333;
        text-align: center;
    }

    .el-footer {
        background-color: #222;/* #545c64;  #B3C0D1 */
        color: #999;
        font-size: 12px;
        font-family: Consolas, 'Courier New', monospace;
        padding: 10px;
    }

    .el-aside {
        background-color: #333;/* #545c64;  #D3DCE6 */
        color: #333;
    }

    .el-main {
        background-color: #111;
        color: white;
        padding: 8px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    #logs{
        width: 100%;
        height: 100%;
    }

    .el-select .el-input__inner {
        color: #eee;
        background-color: #333;
        border:none;
    }
    .el-select-dropdown__list{
        background-color: #333;
    }
    .el-select-dropdown__item{
        color: #aaa;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
        color: #333;
    }
</style>
