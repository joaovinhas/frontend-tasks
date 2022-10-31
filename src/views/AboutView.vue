<template>
  <div class="about">
    <Navbar/>
    <main class="container">
      <h1>This is an about page</h1>
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