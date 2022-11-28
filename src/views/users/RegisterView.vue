<template>
  <div>
    <Navbar/>
    <main class="container">
      <div class="row align-items-center justify-content-center">
        
        <div>
          <Notification v-if="notification" :message="notification"/>
        
          <form class="col">
            <h2>Crie sua conta aqui!</h2>

              <div class="mb-3 row">
                <label class="col-form-label">Name</label>
                <div class="col">
                  <input v-model="username" type="text" class="form-control" placeholder="Digite seu nome aqui!" required="required">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-form-label">Email</label>
                <div class="col">
                  <input v-model="email" type="email" class="form-control" placeholder="Digite seu email aqui!" required="required">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-form-label">Senha</label>
                <div class="col">
                  <input v-model="password" type="password" class="form-control" placeholder="Digite uma senha aqui!" required="required">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-form-label">Confirmar Senha</label>
                <div class="col">
                  <input v-model="confirm_password" type="password" class="form-control" placeholder="Confirme sua senha aqui!" required="required">
                </div>
              </div>

              <button type="button" @click="register()" class="btn btn-primary">Cadastrar</button>

              <span>Já possui cadastro, logue <router-link to="/login">Aqui!</router-link></span>

          </form>
          <br/>
        </div>
      
      </div>

    </main>

  </div>
</template>

<script>

  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'
  import Notification from '@/components/NotificationComponent.vue'

  export default {
    name: 'RegisterView',
    data() {
      return {
        username: "",
        email:"",
        password:"",
        confirm_password: "",
        notification: "",
      }
    },
    components: {
      Navbar,
      Notification,
    },
    methods: {
      
      close_notification(){
        this.notification = ""
      },

      async register(){

        if(this.username != "" && this.email != "" && this.password != "" && this.confirm_password  != ""){

          if(this.password == this.confirm_password){

            if(this.password.length >= 8){

              var response = await Axios.register(this.username, this.email, this.password, this.confirm_password)

              if(response.email[0]){
                this.notification = new Object()
                this.notification.error = "Esse email já esta cadastrado!"
                
              }

              if(response.success){
                this.notification = response
              }
              
            }else{
              this.notification = new Object()
              this.notification.error = "A senha precisa ter no minimo 8 caracteres!"
            }
          
          }else{

            this.notification = new Object()
            this.notification.error = "Senhas diferentes!"

          }
        }else{

          this.notification = new Object()
          this.notification.error = "Preencha os campos!"

        }

      }
    }
  }

</script>

<style lang="scss" scoped>
  span{
    padding-left: 10px;
  }

  input{
    width: 100%;
  }

  form{
    flex: relative;
  }

  label{
    min-width: 70px;
  }

  .align-items-center{
    min-height: 90vh;
  }

</style>