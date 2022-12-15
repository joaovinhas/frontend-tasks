<template>
  <div class="about">
    <Navbar/>
    <main class="container">
      <p>Esta aplicação web foi criada com o intuito de aprendizagem e com a finalidade de ajudar a organizar e lembrar das suas tarefas.</p>
    </main>
  </div>
</template>

<script>

import Navbar from '@/components/NavbarComponent.vue'

export default {
  name: 'AboutdView',
  components: {
    Navbar,
  }
}

</script>

<style lang="scss" scoped>

</style>