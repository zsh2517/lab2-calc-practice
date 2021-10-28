import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import Home from "@/components/Home";
import Exercise from "@/components/Exercise";
import Print from "@/components/Print";
import Vuex from 'vuex';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
const router = new VueRouter({
    routes: [
        {path: "/", component: Home},
        {path: "/exercise", component: Exercise},
        {path: "/print", component: Print},
    ]
})
const store = new Vuex.Store({
    state: {
        config: {
            interval: {
                answer: [1, 100],
                element: [1, 100]
            },
            operators: ["+"],,
            bracket: false,
            count: 2
        },
        problems: [],
        history: [
            {
                problems: [],
                time: new Date(),
                timeUsed: 100,
                level: ["有括号", "四则运算", "100 以内"],
                correct: 7,
                total: 10
            }
        ],
        readOnly: false
    },
    mutations: {
        setConfig(state, conf) {
            state.config = conf;
        },
        setProblems(state, probs) {
            state.problems = probs;
        },
        readHistory(state) {
            console.log(JSON.parse(localStorage.getItem("history")));
            try {
                state.history = JSON.parse(localStorage.getItem("history"));
            } catch {
                state.history = [];
            }
            if (!state.history) {
                state.history = [];
            }
        },
        pushHistory(state, historyRecord) {
            state.history.push(historyRecord);
            console.log("push");
            localStorage.setItem("history", JSON.stringify(state.history));
        },
        setReadOnly(state, ro) {
            state.readOnly = ro;
        }
    }
})
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
