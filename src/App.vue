<template>
    <div id="app">
        <el-container style="position: absolute;top:0;bottom: 0;left: 0;width: 100%;">
            <el-header>
                <div style="float:left; color: white;line-height: 60px; height:60px;">录音监视控制台</div>
                <el-menu mode="horizontal" background-color="#333" text-color="#fff" active-text-color="#ffd04b" style="float: right">
                    <el-menu-item index="/" @click="onrsw">{{refreshsw}}</el-menu-item>
                </el-menu>
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
                refreshsw: '开始',
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
                this.refreshing = !this.refreshing;
                this.refreshsw = this.refreshing ? '停止' : '开始';
                this.$root.$emit('sw', this.refreshing);
            },
            menusel(index) {
                if (index === '/2') {
                    this.refreshing = false;
                    this.refreshsw = '开始';
                    this.$root.$emit('sw', this.refreshing);
                }
            }
        }
    }
</script>

<style scoped>
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
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    #logs{
        width: 100%;
        height: 100%;
    }
</style>
