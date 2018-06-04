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
                    <el-menu :router="true" :default-active="$route.path" background-color="#333" active-text-color="#ffd04b">
                        <el-menu-item index="/"><i class="el-icon-menu"></i></el-menu-item>
                        <el-menu-item index="/2"><i class="el-icon-setting"></i></el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <transition name="el-fade-in-linear" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                refreshsw: '停止',
                refreshing: true
            }
        },
        mounted() {
        },
        methods: {
            onrsw() {
                this.refreshing = !this.refreshing;
                this.refreshsw = this.refreshing ? '停止' : '开始';
                this.$root.$emit('sw', this.refreshing);
            }
        }
    }
</script>

<style scoped>
    .el-menu {
        border-right-width: 0;
    }

    .el-header, .el-footer {
        background-color: #333;/* #545c64;  #B3C0D1 */
        color: #333;
        text-align: center;
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
</style>
