<template>
    <el-row :gutter="20" style="margin: 100px 0;">
        <el-col :span="3" :offset="2" style="font-size: x-large;">
            <el-card>
                <div>已用时间</div>
                <div style="font-size: xx-large; font-family: cursive, monospace;">{{ timeText }}</div>
            </el-card>
        </el-col>
        <el-col :span="16" :offset="1">
            <el-card>
                <div class="exercise-field">
                    <div v-for="(item, index) in exercises" :key="index" class="exercise-box"
                         :style="`color: ${statusList[index]}!important`">
                        <div class="exercise-question">
                            {{ item.formula }} =
                        </div>
                        <div class="exercise-question">
                            <input :style="`border: none; font-size: x-large; height: 1em;
                            width: 3em; border-bottom: 0.5px solid black; color: ${statusList[index]};`"
                                   v-model="item.input"/>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 50px;">
                    <el-divider></el-divider>
                    <el-button type="primary" v-if="!$store.state.readOnly" @click="submit">交卷</el-button>
                    <el-button type="primary" v-if="$store.state.readOnly" @click="ret">返回</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "Exercise",
    data() {
        return {
            createTime: new Date(),
            exercises: [],
            timeCount: 0,
            timeoutHandle: 0,
        }
    },
    computed: {
        timeText() {
            let a = String(Math.floor(this.timeCount / 60));
            let b = String(this.timeCount % 60);
            if (a.length === 1) {
                a = "0" + a;
            }
            if (b.length === 1) {
                b = "0" + b;
            }
            return a + ":" + b;
        },
        statusList() {
            let temp = [];
            this.exercises.forEach(item => {
                temp.push(
                    item.ans === Number(item.input) || !this.$store.state.readOnly ? "black" : "red"
                );
            });
            console.log(JSON.stringify(temp));
            return temp;
        }
    },
    mounted() {
        this.exercises = this.$store.state.problems;
        this.timeoutHandle = setInterval(() => {
            if (!this.$store.state.readOnly) {
                this.timeCount += 1
            }
        }, 1000);
        // let s = [];
        // for (let i = 0; i < 10; i++) {
        //     s.push({
        //         formula: 1,
        //         ans: 1,
        //         input: 1,
        //     })
        // }
    },
    methods: {
        submit() {
            this.$store.commit("setReadOnly", true);
            this.$store.commit("pushHistory", {
                problems: JSON.parse(JSON.stringify(this.$store.state.problems)),
                time: this.createTime,
                timeUsed: this.timeCount,
                correct: (() => {
                    let temp = 0;
                    this.exercises.forEach(item => {
                        if (item.ans === Number(item.input)) {
                            temp += 1;
                        }
                    })
                    return temp;
                })(),
                level: [
                    this.$store.state.config.bracket ? "有括号" : "无括号",
                    (() => {
                        switch (this.$store.state.config.operators.length) {
                            case 1:
                                return "加法运算";
                            case 2:
                                return "加减运算";
                            case 4:
                                return "四则运算";
                        }
                    })(),
                    (() => {
                        switch (this.$store.state.config.interval.answer[1]) {
                            case 10:
                                return "十以内";
                            case 100:
                                return "一百以内";
                            case 1000:
                                return "一千以内";
                            case 10000:
                                return "一万以内";
                        }
                    })()],
                total: this.exercises.length
            })
        },
        ret() {
            this.$router.push("/");
        }
    }
}
</script>
<style scoped>
.exercise-field {
    width: 100%;
    text-align: left;
    font-size: x-large;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.exercise-box {
    width: 40%;
    border-bottom: 1px dashed #999999;
    height: 3em;
    display: flex;
    align-items: flex-end;
}

.exercise-question {
    height: 1em;
}
</style>
