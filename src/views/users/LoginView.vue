<template>
  <div>
    <Navbar/>
    <main class="container">
      <div class="row align-items-center justify-content-center">
        
      <form class="col">
        <h2>Logue aqui!</h2>

          <div class="mb-3 row">
            <label class="col-sm-1 col-form-label">Email</label>
            <div class="col-sm-11">
              <input type="email" class="form-control" placeholder="Digite seu email aqui!">
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-1 col-form-label">Senha</label>
            <div class="col-sm-11">
              <input type="password" class="form-control" placeholder="Digite sua senha aqui!">
            </div>
          </div>

          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
              Manter logado
            </label>
          </div><br/>

          <button class="btn btn-primary">Logar</button>

          <span>Não possui cadastro, crie seu cadastro <router-link to="/register">Aqui!</router-link></span>

      </form>
    
      </div>

    </main>
  </div>
</template>

<script>
  
  import Navbar from '@/components/NavbarComponent.vue'

  export default {
    name: 'LoginView',
    components: {
      Navbar,
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