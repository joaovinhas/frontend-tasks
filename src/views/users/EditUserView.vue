<template>
  <div>
    <Navbar/>
    <main class="container">
      
      <div class="row align-items-center justify-content-center">
        
        <Notification v-if="notification" :message="notification"/>

      <form v-if="!show_password" class="col">
        <h2>Edite seu usuario aqui!</h2>

          <div class="mb-3 row">
            <label class="col-sm-1 col-form-label">Nome</label>
            <div class="col-sm-11">
              <input v-model="username" type="text" class="form-control" placeholder="Digite seu nome aqui!" required="required">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-1 col-form-label">Email</label>
            <div class="col-sm-11">
              <input v-model="email" type="email" class="form-control" placeholder="Digite seu email aqui!" required="required">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-1 col-form-label">Senha</label>
            <div class="col-sm-11">

              <button @click="show_password = !show_password" type="button" class="btn btn-primary">Editar</button>

            </div>
          </div>

          <button type="button" @click="edit_user()" class="btn btn-primary">Salvar alterações</button>

      </form>

      <form v-if="show_password">
        <div class="mb-3 row">
          <label class="col-sm-12 col-form-label">Nova Senha</label>
          <div class="col-sm-12">
            <input v-model="new_password" type="password" class="form-control" placeholder="Digite sua nova senha aqui!" min="8" required="required">
          </div>
        </div>

        <div class="mb-3 row">
          <label class="col-sm-12 col-form-label">Confirmar Senha</label>
          <div class="col-sm-12">
            <input v-model="confirm_password" type="password" class="form-control" placeholder="Confirme sua senha aqui!" min="8" required="required">
          </div>
        </div>

        <button type="button" @click="edit_password()" class="btn btn-primary">Salvar alteração</button>

        <button @click="show_password = !show_password" type="button" class="btn btn-danger">Cancelar</button>

      </form>
    
      </div>


    </main>
  </div>
</template>

<script>
  
  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'
  import Notification from '@/components/NotificationComponent.vue'

  export default {
    name: 'EditUserView',
    data() {
      return {
        username: "",
        email:"",
        new_password:"",
        confirm_password: "",
        token:"",
        show_password: false,
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

        }else if(sessionStorage.token){
          
          this.token = sessionStorage.token

        }

        var check = await Axios.check_user(this.token)

        if(check.user.status != "block"){

          var response = await Axios.show_user(this.token)

          if(response.user){
            this.username = response.user.username
            this.email = response.user.email
          }else{
            this.notification = response
          }

        }else{
          this.$router.push('/login')
        }
        
      }else{
        this.$router.push('/login')
      }
    },
    methods:{

      close_notification(){
        this.notification = ""
      },

      async edit_user(){

        if(this.username != null && this.email != null){

          var response = await Axios.edit_user(this.token, this.username, this.email)

          this.notification = response

        }else{
          this.notification = new Object()
          this.notification.error = "Usuario ou email invalido!" 
        }

      },

      async edit_password(){

        if(this.new_password != null && this.confirm_password != null){

          if(this.new_password == this.confirm_password){

            if(this.new_password.length < 8){
              this.notification = new Object()
              this.notification.error = "Senha precisa ter no minimo 8 caracteres!"
            }else{
              var response = await Axios.edit_password(this.token, this.new_password, this.confirm_password)

              this.notification = response
            }

          }else{
            this.notification = new Object()
            this.notification.error = "Senhas diferentes!"
          }

        }else{ 
          this.notification = new Object()
          this.notification.error = "Senha invalida!"
        }

      },

    },

  }

</script>

<style lang="scss" scoped>
  span{
    padding-left: 10px;
  }

  .align-items-center{
    height: 90vh;
  }
</style>