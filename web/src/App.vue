<template>
  <NavBar/>
  <router-view />
</template>

<script>
import NavBar from './components/NavBar.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
// import $ from 'jquery';

export default {
  components: {
    NavBar
  },
  setup() {
    // $.ajax({
    //   url: "http://localhost:3000/user/account/token/",
    //   type: "post",
    //   data: {
    //     username: "zym",
    //     password: "pzym",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });
    // $.ajax({
    //   url: "http://localhost:3000/user/account/register/",
    //   type: "post",
    //   data: {
    //     username: "zym3",
    //     password: "pzym3",
    //     confirmedPassword: "pzym3",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });
  }
}
</script>

<style>
body{
  background-image: url("@/assets/background.png");
  background-size: cover;
} 
</style>
