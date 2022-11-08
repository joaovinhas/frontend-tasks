<template>
  <div>
    <Navbar/>
    <main class="container"><br/>
      <h1>Todos usuarios</h1><br/>

      <li v-for="(user, index) in users" :key="index" class="list-group-item list-group-item-dark">
        
        {{user.name}}<br/>
        
        {{user.email}}<br/>
        
        <select v-model="user.permission">
          <option value="admin">admin</option>
          <option value="client">client</option>
        </select><br/>

        <select v-model="user.status">
          <option value="free">free</option>
          <option value="unlimited">ilimitado</option>
          <option value="paid">pago</option>
          <option value="block">bloqueado</option>
        </select><br/><br/>

        <button @click="alt_user(user.id, user.permission, user.status)" type="button" class="btn btn-primary">Salvar alteração</button>

      </li><br/>

    </main>
  </div>
</template>

<script>

  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'

  export default {
    name: 'RegisterView',
    data(){
      return{
        token:"",
        users:"",
        permission:"",
      }
    },
    components: {
      Navbar,
    },
    async created(){ 

      if(localStorage.token || sessionStorage.token){

        if(localStorage.token){
          
          this.token = localStorage.token
          this.permission = sessionStorage.permission

        }else if(sessionStorage.token){
          
          this.token = sessionStorage.token
          this.permission = sessionStorage.permission

        }

        var check = await Axios.check_user(this.token)

        if(check.user.permission == "admin"){

          var response = await Axios.show_users(this.token)

          this.users = response.success

        }else{
          this.$router.push('/dashboard')
        }

      }else{
        this.$router.push('/login')
      }

    },
    methods:{

      async alt_user(id_user, permission, status){

        var response = await Axios.edit_permission(this.token, id_user, permission, status)

        console.log(response)

      },

    },

  }

</script>

<style lang="scss" scoped>

</style>