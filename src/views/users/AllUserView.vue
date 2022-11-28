<template>
  <div>
    <Navbar/>
    <main class="container"><br/>
      <Notification v-if="notification" :message="notification"/>
      <h1>Todos usuarios</h1><br/>

<!--Busca usuarios-->

      <div class="input-group">
        <input v-if="type != 'status' && type != 'permission'" v-model="search" type="text" class="form-control" placeholder="Digite algo na busca aqui!">

        <select v-if="type == 'permission'" v-model="search" class="form-control">
          <option value="admin">Admin</option>
          <option value="client">cliente</option>
        </select>

        <select v-if="type == 'status'" v-model="search" class="form-control">
          <option value="free">Gratuito</option>
          <option value="paid">Pago</option>
          <option value="unlimited">Ilimitado</option>
          <option value="block">Bloqueado</option>
        </select>

        <select v-model="type" class="custom-select">
          <option value="name">Nome</option>
          <option value="email">Email</option>
          <option value="status">Status</option>
          <option value="permission">Permissao</option>
        </select>     
        <div class="input-group-append">
          <button @click="search_task()" class="btn btn-primary" type="button">Buscar</button>
        </div>
      </div>

      <br/>

<!--Carrega os usuarios na tela-->

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
  import Notification from '@/components/NotificationComponent.vue'

  export default {
    name: 'RegisterView',
    data(){
      return{
        token:"",
        users:"",
        permission:"",
        search:"",
        type:"name",
        notification:"",
      }
    },
    components: {
      Navbar,
      Notification,
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

      close_notification(){
        this.notification = ""
      },

      async alt_user(id_user, permission, status){

        var response = await Axios.edit_permission(this.token, id_user, permission, status)

        this.notification = response

      },

      async search_task(){

        var response = await Axios.search_user(this.token, this.type, this.search)
        
        if(response.users){
          this.users = response.users
        }else{
          this.notification = new Object()
          this.notification.error = "Nenhum usuario encontrado!"
        }

      }

    },

  }

</script>

<style lang="scss" scoped>

</style>