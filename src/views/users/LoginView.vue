<template>
  <div>
    <Navbar/>
    <main class="container">
      <div class="row align-items-center justify-content-center">

        <div class="col">
          <Notification v-if="notification" :message="notification"/>

          <form class="col">
            <h2>Logue aqui!</h2>

              <div class="mb-3 row">
                <label class="col-sm-1 col-form-label">Email</label>
                <div class="col-sm-11">
                  <input v-model="email" type="email" class="form-control" placeholder="Digite seu email aqui!">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-1 col-form-label">Senha</label>
                <div class="col-sm-11">
                  <input v-model="password" type="password" class="form-control" placeholder="Digite sua senha aqui!">
                </div>
              </div>

              <div class="form-check">
                <input v-model="logged" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Manter logado
                </label>
              </div><br/>

              <button @click="login()" type="button" class="btn btn-primary">Logar</button>

              <span>Não possui cadastro, crie seu cadastro <router-link to="/register">Aqui!</router-link></span>

          </form>

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
    name: 'LoginView',
    components: {
      Navbar,
      Notification,
    },
    data() {
      return {
        username: "",
        email:"",
        password:"",
        token: "",
        logged:false,
        notification:'',
      }
    },
    methods: {

      close_notification(){
        this.notification = ""
      },

      async login(){

        if(this.email == "" && this.password == ""){
          this.notification = new Object()
          this.notification.error = "Preencha os campos!"
        }else{

          var response = await Axios.login(this.email, this.password)

          if(response.access_token){

            if(this.logged){

              localStorage.username = response.username
              localStorage.token = response.access_token
              localStorage.logged = this.logged

            }else{

              sessionStorage.username = response.username
              sessionStorage.token = response.access_token

            }

            this.$router.push("/dashboard")

          }else if(response.error){

            this.notification = response

          }else{

            this.notification = new Object()
            this.notification.error = "Erro ao fazer login!"

          }

        }

      }

    }
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