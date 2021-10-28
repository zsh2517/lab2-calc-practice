export function ranNum(from, to) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function ranChoice(array) {
    return array[ranNum(0, array.length)];
}

let config = {
    interval: {
        answer: [1, 100],
        element: [1, 100]
    },
    operators: ["+"], // , "-", "*", "/"],
    count: 2
}

let cntCount = 0

function GetMulNumber(x) {
    let arr = [];
    if (x === 0) {
        throw "Mul0";
    }
    for (let i = 1; i * i <= x; i++) {
        if (x % i === 0) {
            arr.push(i);
            arr.push(x / i);
        }
    }
    return ranChoice(arr);
}

function Element(val, status, extend) {
    // val: 这一项的取值（包含拆分后的结果）
    // status: CFG 中，上一项的状态（即是否加括号），状态转移参考 MS whiteboard
    this.val = val;
    this.status = status;
    this.prev = null;
    this.operator = "";
    this.next = null;
    this.bracket = false;
    this.getFormulation = function () {
        if (this.prev) {
            let ret = this.prev.getFormulation() +
                this.operator +
                this.next.getFormulation();
            if (this.bracket) {
                ret = `(${ret})`;
            }
            return ret;
        } else {
            return this.val;
        }
    }
    if (cntCount < config.count && extend) {
        let temp = ranNum(0, 2);
        // let temp = 0; //ranNum(0, 2);
        this.operator = ranChoice(config.operators);
        // console.log(temp, this.operator);
        cntCount += 1;
        let a;
        switch (this.operator) {
            case "+":
                this.bracket = "-*/".indexOf(status) > -1;
                a = ranNum(0, this.val + 1);
                this.prev = new Element(a, "+", temp === 1);
                this.next = new Element(this.val - a, "+", temp === 0);
                break;
            case "-":
                this.bracket = "-*/".indexOf(status) > -1;
                a = ranNum(this.val, config.interval.element[1] + 1);
                this.prev = new Element(a, "+", temp === 1);
                this.next = new Element(a - this.val, "-", temp === 0);
                break;
            case "*":
                this.bracket = "/".indexOf(status) > -1;
                // a = ranNum(0, this.val + 1);
                a = GetMulNumber(this.val);
                this.prev = new Element(a, "*", temp === 1);
                this.next = new Element(this.val / a, "*", temp === 0);
                break;
            case "/":
                this.bracket = "/".indexOf(status) > -1;
                if (this.val === 0) {
                    throw "DIV0";
                }
                a = ranNum(1, Math.floor(config.interval.element[1] / this.val) + 1);
                this.prev = new Element(a * this.val, "*", temp === 1);
                this.next = new Element(a, "/", temp === 0);
                break;
        }
        if(this.bracket && !config.bracket) {
            throw "have bracket, re-generate";
        }
    }
}

export function generate(conf = null) {
    let ele;
    config = conf;
    console.log("conf", conf);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // console.log("AAA");
        cntCount = 1;
        try {
            let ans = ranNum(conf.interval.answer[0], conf.interval.answer[1]);
            ele = new Element(ans, "+", true);
            return {
                formula: ele.getFormulation(),
                ans: ans,
                input: "",
            };
        }
            // eslint-disable-next-line no-empty
        catch (e) {
        }
    }
}

export function generateCount($store) {
    let l = [];
    let config = $store.state.config;
    while (l.length < config.countQuestion) {
        let temp = generate(config);
        console.log(temp);
        let temps = JSON.stringify(temp);
        if (l.indexOf(temps) === -1) {
            l.push(temps);
        }
    }
    console.log(l.map(item => JSON.parse(item)));
    // return l.map(item => JSON.parse(item));
    $store.commit("setProblems", l.map(item => JSON.parse(item)));
}

export function test() {
    for (let i = 0; i < 10; i++) {
        let ans = ranNum(0, 100 + 1);
        let ele = generate(ans);
        console.log(ele.getFormulation(), eval(ele.getFormulation()) === ans);
    }
    console.log("Test begin");
    for (let i = 0; i < 1000; i++) {
        let ans = ranNum(0, 100 + 1);
        cntCount = 1;
        let ele = generate(ans);
        if (!(eval(ele.getFormulation()) === ans)) {
            console.log(ele.getFormulation(), eval(ele.getFormulation()) === ans);
        }
    }
}

export default {
    generate,
};
