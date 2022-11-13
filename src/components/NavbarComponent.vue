<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Tasks</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item">
            
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">Sobre</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link v-if="!username" to="/login" class="nav-link" >Login</router-link>

              
              <div v-if="username" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {{username}}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><router-link to="/dashboard" class="dropdown-item" >Dashboard</router-link></li>
                  <li><button @click="logout()" class="dropdown-item" >Sair</button></li>
                </ul>
              </div>


            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

  import Axios from '@/api/api.js';

  export default {
    name: 'NavbarComponent',
    data() {
      return {
        username: "",
        token: "",
      }
    },
    components: {
    },
    async  created(){

      if(localStorage.token || sessionStorage.token){
        
        if(localStorage.token){
          this.token = localStorage.token
        }else{
          this.token = sessionStorage.token
        }

        var check = await Axios.check_user(this.token)

        if(check.user.status != "block"){
          this.username = sessionStorage.username
        }
      
      }

    },
    methods: {

      async logout(){

        var response = await Axios.logout(this.token)

        console.log(response)

        if(localStorage.token){
            
          localStorage.removeItem('username');
          localStorage.removeItem('token');
        }

        if(sessionStorage.token){

          sessionStorage.removeItem('username');
          sessionStorage.removeItem('token');
        }

        this.$router.push('/login')

      }

    }
  }

</script>

<style lang="scss" scoped>

</style>