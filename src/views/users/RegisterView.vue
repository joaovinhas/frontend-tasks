<template>
  <div>
    <Navbar/>
    <main class="container">
      <div class="row align-items-center justify-content-center">
        
      <form class="col">
        <h2>Crie sua conta aqui!</h2>

          <div class="mb-3 row">
            <label class="col-auto col-form-label">Name</label>
            <div class="col-sm-10">
              <input v-model="username" type="text" class="form-control" placeholder="Digite seu nome aqui!" required="required">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-auto col-form-label">Email</label>
            <div class="col-sm-10">
              <input v-model="email" type="email" class="form-control" placeholder="Digite seu email aqui!" required="required">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-auto col-form-label">Senha</label>
            <div class="col-sm-10">
              <input v-model="password" type="password" class="form-control" placeholder="Digite uma senha aqui!" required="required">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-auto col-form-label">Confirmar Senha</label>
            <div class="col-sm-10">
              <input v-model="confirm_password" type="password" class="form-control" placeholder="Confirme sua senha aqui!" required="required">
            </div>
          </div>

          <button type="button" @click="register()" class="btn btn-primary">Cadastrar</button>

          <span>Já possui cadastro, logue <router-link to="/login">Aqui!</router-link></span>

      </form>
    
      </div>

    </main>

  </div>
</template>

<script>

  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'
  //import Notification from '@/components/NotificationComponent.vue'

  export default {
    name: 'RegisterView',
    data() {
      return {
        username: "",
        email:"",
        password:"",
        confirm_password: "",
        notification: false,
      }
    },
    components: {
      Navbar,
      //Notification,
    },
    methods: {
      register(){

        if(this.username != "" && this.email != "" && this.password != "" && this.confirm_password  != ""){

          if(this.password == this.confirm_password){

            var response = Axios.register(this.username, this.email, this.password, this.confirm_password)

            if(response.success){
              console.log(response.success)
            }
          
          }else{

            console.log("Senhas diferentes")

          }
        }else{

          console.log("Preencha os campos")

        }

      }
    }
  }

</script>

<style lang="scss" scoped>
  span{
    padding-left: 10px;
  }

  form{
    flex: relative;
  }

  .align-items-center{
    height: 90vh;
  }

</style>