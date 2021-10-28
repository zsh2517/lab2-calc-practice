<template>
    <el-row :gutter="20" style="margin: 100px 0;">
        <el-col :span="16" :offset="4" style="font-size: x-large;">
            <el-card>
                <h2>题目</h2>
                <div style="font-size: medium; margin: 20px;">
                    可以分别将题目和答案复制到 word 内进行打印~
                </div>
                <el-input type="textarea" :autosize="{min: 10, max: 40}" :value="exerciseText"
                          style="font-size: x-large">
                </el-input>
                <el-divider></el-divider>
                <h2>答案</h2>
                <el-input type="textarea" :autosize="{min: 10, max: 40}" :value="answerText"
                          style="font-size: x-large">
                </el-input>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "Exercise",
    data() {
        return {
            exercises: [],
            timeCount: 0,
            timeoutHandle: 0
        }
    },
    computed: {
        exerciseText() {
            let text = "";
            this.exercises.forEach(item => {
                text += item.formula + "\n"
            })
            return text;
        },
        answerText() {
            let text = "";
            this.exercises.forEach(item => {
                text += item.ans + "\n"
            })
            return text;
        }
    },
    mounted() {
        this.exercises = this.$store.state.problems;
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
