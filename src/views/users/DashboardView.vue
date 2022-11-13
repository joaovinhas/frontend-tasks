<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>Bem Vindo ao Tasks {{username}} <router-link to="/edit_user" class="btn btn-primary" >Editar</router-link> </h1>
      <p>Você possui {{tasks.length}} tasks, vejas suas tasks <router-link to="/tasks">aqui</router-link></p>
      <div v-if="users">
        <p>Numero de usuarios no sistema: {{users.length}}, vejas os usuarios <router-link to="/all_users">aqui</router-link></p>
      </div>
    </main>
  </div>
</template>

<script>

import Axios from '@/api/api.js';
import Navbar from '@/components/NavbarComponent.vue'

export default {
  name: 'DashboardView',
  data(){
    return{
      token:"",
      username:"",
      users: "",
      tasks:"",
    }
  },
  async created(){

    if(localStorage.token || sessionStorage.token){

      if(localStorage.token){
        
        this.token = localStorage.token
        this.username = localStorage.username

      }else if(sessionStorage.token){
        
        this.token = sessionStorage.token
        this.username = sessionStorage.username

      }

      var check = await Axios.check_user(this.token)

      if(check.user.status != "block"){

        var response = await Axios.dashboard(this.token)

        if(response.users){
          this.users = response.users
          this.tasks = response.tasks
        }else{
          this.tasks = response.tasks
        }

      }else{
        this.$router.push('/login')
      }
      
    }else{
      this.$router.push('/login')
    }

  },
  components: {
    Navbar,
  }
}

</script>

<style lang="scss" scoped>

</style>