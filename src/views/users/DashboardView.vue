<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>Dashboard</h1>
    </main>
  </div>
</template>

<script>

import Navbar from '@/components/NavbarComponent.vue'

export default {
  name: 'DashboardView',
  components: {
    Navbar,
  }
}

</script>

<style lang="scss" scoped>

</style>