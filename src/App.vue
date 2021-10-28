<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
// import main from "@/src/core/main.mjs";

export default {
    name: 'App',
    components: {},
    methods: {
    },
    mounted() {
        window.$store = this.$store;

        // let l = this.create(10);
        // this.$store.commit("setProblems", l);
        // localStorage.setItem("problems", JSON.stringify(l));
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
}

html, body {
    margin: 0;
}
</style>
