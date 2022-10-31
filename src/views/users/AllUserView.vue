<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>All Users</h1>
    </main>
  </div>
</template>

<script>
  
  import Navbar from '@/components/NavbarComponent.vue'

  export default {
    name: 'RegisterView',
    components: {
      Navbar,
    }
  }

</script>

<style lang="scss" scoped>

</style>