<template>

  <li :style="{'margin-left': `${depth * 30}px`}" class="list-group-item list-group-item-dark">

    {{node.task}}

  </li>
  <ChildTasksComponent
    v-for="child in node.children"
    :key="child.task"
    :node="child"
    :depth="depth + 1"
  />

</template>

<script>
  
  export default {
    name: 'ChildTasksComponent',
    props:{
      node: Object,
      depth: {
        type:Number,
        default: 0,
      }
    },
    components: {

    },
  } 

</script>

<style lang="scss" scoped>

</style>