<template>
    <el-row :gutter="20" style="margin: 0">
        <el-col :span="12" :offset="6">
            <el-card style="width: 100%; min-height: 400px; margin-top: 100px;">
                <h1>小学算术生成器</h1>
                <div>
                    <el-divider>选择难度</el-divider>
                    <div>
                        <el-radio-group v-model="level">
                            <el-radio class="radio" :label="1">加法运算</el-radio>
                            <el-radio class="radio" :label="2">不带括号的加减运算</el-radio>
                            <el-radio class="radio" :label="3">不带括号的四则运算</el-radio>
                            <div>
                                <el-radio class="radio" :label="4">带括号的加减运算</el-radio>
                                <el-radio class="radio" :label="5">带括号的四则运算</el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                </div>
                <div>
                    <el-divider>数字大小</el-divider>
                    <div>
                        <el-radio-group v-model="interval">
                            <el-radio class="radio" :label="10">十以内的运算</el-radio>
                            <el-radio class="radio" :label="100">一百以内的运算</el-radio>
                            <el-radio class="radio" :label="1000">一千以内的运算</el-radio>
                            <el-radio class="radio" :label="10000">一万以内的运算</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div>
                    <el-divider>每个算式的数目</el-divider>
                    <div>
                        <el-input-number :min="1" :max="10" v-model="count">

                        </el-input-number>
                    </div>
                </div>
                <div>
                    <el-divider :min="1" :max="200">题目数目</el-divider>
                    <div>
                        <el-input-number v-model="countQuestion">

                        </el-input-number>
                    </div>
                </div>
                <div>
                    <el-divider></el-divider>
                    <div>
                        <router-link to="/exercise" style="margin: 20px;">
                            <el-button type="primary" @click="click('exercise')">开始做题</el-button>
                        </router-link>
                        <router-link to="/print" style="margin: 20px;">
                            <el-button type="primary" @click="click('print')">打印题目</el-button>
                        </router-link>
                    </div>
                </div>
                <div>
                    <el-divider>做题记录</el-divider>
                    <el-table :data="history" style="width: 100%;">
                        <el-table-column
                            prop="time"
                            label="时间"
                            width="150"
                            align="center">
                            <template v-slot="scope">
                                {{ time2str(scope.row.time)[0] }}<br>
                                {{ time2str(scope.row.time)[1] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="timeUsed"
                            label="做题用时"
                            width="100"
                            align="center">
                            <template v-slot="scope">
                                {{ secondHumanize(scope.row.timeUsed) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="level"
                            label="题目类型"
                            width="100"
                            align="center">
                            <template v-slot="scope">
                                {{ scope.row.level[0] }}<br>
                                {{ scope.row.level[1] }}<br>
                                {{ scope.row.level[2] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="正确数目"
                            width="100"
                            align="center">
                            <template v-slot="scope">
                                {{ scope.row.correct }} / {{ scope.row.total }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ope"
                            label="操作"
                            width="100"
                            align="center">
                            <template v-slot="scope">
                                <el-button @click="enableProblemset(scope.$index)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="display: none;">
                    {{ config }}
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import {generateCount} from "@/core/main";

export default {
    name: "Home",
    data() {
        return {
            level: 1,
            interval: 100,
            count: 2,
            countQuestion: 10
        }
    },
    computed: {
        config() {
            let ope = [];
            let bracket = false;
            switch (this.level) {
                case 1:
                    ope = ["+"];
                    bracket = false;
                    break;
                case 2:
                    ope = ["+", "-"];
                    bracket = false;
                    break;
                case 3:
                    ope = ["+", "-", "*", "/"];
                    bracket = false;
                    break;
                case 4:
                    bracket = true;
                    ope = ["+", "-"];
                    break;
                case 5:
                    bracket = true;
                    ope = ["+", "-", "*", "/"];
                    break;
            }
            let conf = {
                interval: {
                    answer: [1, this.interval],
                    element: [1, this.interval]
                },
                operators: ope,
                count: this.count,
                bracket,
                countQuestion: this.countQuestion
            }
            this.$store.commit("setConfig", conf);
            return conf;
        },
        history() {
            return this.$store.state.history;
        }
    },
    methods: {
        time2str(tm) {
            tm = new Date(tm);
            return [`${tm.getMonth() + 1} 月 ${tm.getDate()} 日`,
                `${tm.getHours()}:${tm.getMinutes()}`]
        },
        secondHumanize(tm) {
            let minute = Math.floor(tm / 60);
            minute = minute ? `${minute} 分 ` : "";
            let second = Math.floor(tm % 60);
            second = second ? `${second} 秒` : "";
            return minute + second;
        },
        click(x) {
            this.$store.commit("setReadOnly", false);
            generateCount(this.$store);
            this.$router.push("/" + x);
        },
        enableProblemset(index) {
            this.$store.commit("setProblems", this.$store.state.history[index].problems);
            this.$store.commit("setReadOnly", true);
            this.$router.push("/exercise");
        }
    }, mounted() {
        this.$store.commit("readHistory");
    }
}
</script>

<style scoped>
.radio {
    margin: 10px;
}
</style>
