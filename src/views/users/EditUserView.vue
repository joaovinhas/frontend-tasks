<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>Edit User</h1>
    </main>
  </div>
</template>

<script>
  
  import Navbar from '@/components/NavbarComponent.vue'

  export default {
    name: 'EditUserView',
    components: {
      Navbar,
    }
  }

</script>

<style lang="scss" scoped>

</style>