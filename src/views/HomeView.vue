<template>
  <div class="home">
    <Navbar/>
    <main class="container">

      <p>Bem Vindo ao Tasks, essa aplicação tem como finalidade ajudar você a lembrar e organizar suas tarefas durante o seu dia a dia, tornando uma pessoa mais produtiva.</p>
      <p>Cadastre-se já clicando <router-link to="/register">Aqui!</router-link></p>

    </main>
  </div>
</template>

<script>

import Navbar from '@/components/NavbarComponent.vue'

export default {
  name: 'HomeView',
  components: {
    Navbar,
  }
}
</script>
