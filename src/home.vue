<template>
    <div>
        <div class="fid" v-for="(item,index) in items">
            <div style="margin: 4px">
                <canvas :id="'f'+index" class="plotcanvas"></canvas>
            </div>
            <div style="text-align: center">
                {{item.ip}}
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";
    import * as Influx from "influx";
    import cfg from "./config";

    function PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

    export default {
        data() {
            return {
                items:[{ip:'10.0.0.13'},{ip:'10.0.0.123'},{ip:'10.0.0.199'}]
            }
        },
        mounted() {
            let f = {};
            for (let i = 0; i < 24; ++i) {
                f[i] = 'last_c' + PrefixInteger(i, 2);
            }
            let infl = new Influx.InfluxDB(cfg.dbcfg);
            let timer1 = 0;
            this.$root.$on('sw', (sw)=>{
                if (sw) {
                    timer1 = setInterval(() => {
                        infl.query("select last(*) from surv where time > now() - 30s group by ip")
                            .then(result => {
                                for (let ki = 0; ki < this.items.length; ++ ki) {
                                    if (!this.items[ki].buffer) this.items[ki].buffer = [];
                                    let r = result.find((value)=>{return value.ip === this.items[ki].ip});
                                    if (r !== undefined) {
                                        this.items[ki].buffer.push(r);
                                    } else {
                                        this.items[ki].buffer.push({});
                                    }
                                    if (this.items[ki].buffer.length > 24) {
                                        this.items[ki].buffer.splice(0, 1);
                                    }
                                    let canvas = d3.select("#f" + ki).attr("width", "192px").attr("height", "192px");
                                    let context = canvas.node().getContext("2d");
                                    for(let j = 0; j < this.items[ki].buffer.length; ++j) {
                                        let row = this.items[ki].buffer[j];
                                        for (let i = 0; i < 24; ++i) {
                                            let v = row[f[i]];
                                            if (!v) {
                                                context.fillStyle = "#0";
                                            } else {
                                                let l = v * 0.01;
                                                if (l > 1) l = 1;
                                                context.fillStyle = d3.hsl(240+(360-240)*l,1.0,0.1+0.5*l);
                                            }
                                            let x = 24 - this.items[ki].buffer.length + j;
                                            let y = 23 - i;
                                            context.fillRect(x * 8, y * 8, 7, 7);
                                        }
                                    }
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    },1000);
                } else {
                    clearInterval(timer1);
                }
            });
        },
        methods: {
        }
    }
</script>

<style>
    .fid {
        border-radius: 2px;
        border:1px solid #999;
        display: inline-block;
        width:200px;
        height:228px;
        background-color: #333;
        margin:4px;
        font-size: 12px;
        overflow: hidden;
    }
    .plotcanvas {
        width: 192px;
        height: 192px;
        background-color: #171717;
    }
</style>