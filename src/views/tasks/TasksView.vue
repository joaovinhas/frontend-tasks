<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>Tasks</h1>
    </main>
  </div>
</template>

<script>
  
  import Navbar from '@/components/NavbarComponent.vue'

  export default {
    name: 'TasksView',
    components: {
      Navbar,
    }
  }

</script>

<style lang="scss" scoped>

</style>