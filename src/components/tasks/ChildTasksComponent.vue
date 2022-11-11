<template>

  <li :style="{'margin-left': `${depth * 30}px`}" class="list-group-item list-group-item-dark">
    <div v-if="!show_edit && !show_add" class="row">
      
      <div @click="expanded = !expanded" class="col">
        <span v-if="hasChildren" class="type">[ {{expanded ? '&#45;' : '&#43;'}} ]</span>
        {{tasks.task}}
      </div>

      <div class="col-sm-auto">
        
        <div class="btn-group" role="group">
          <button @click="show_add = !show_add" type="button" class="btn btn-primary">Add</button>
          <button @click="show_edit = !show_edit; show_task_edit(tasks.task)" type="button" class="btn btn-secondary">Editar</button>
          <button @click="show_modal = !show_modal" type="button" class="btn btn-danger">Delete</button>
        </div>
      
      </div>

    </div>

    <div v-if="show_add" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="new_task" required="required" placeholder="Digite a sua task aqui!">
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="add_task(new_task, tasks.id)" type="button" class="btn btn-primary">Salvar</button>
        <button @click="show_add = !show_add" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

    <div v-if="show_edit" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="task_edit" required="required">
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="edit_task(tasks.id, task_edit)" type="button" class="btn btn-primary">Salvar</button>
        <button @click="show_edit = !show_edit" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

   <Modal v-if="show_modal" @close="show_modal = false" :task="tasks"/>

  </li>
  <div v-if="expanded">
      
    <ChildTasksComponent
      v-for="child in tasks.children"
      :key="child.task"
      :node="child"
      :depth="depth + 1"
    />

  </div>

</template>

<script>
  
  import Axios from '@/api/api.js';
  import Modal from '@/components/ModalComponent.vue'

  export default {
    name: 'ChildTasksComponent',
    props:{
      node: Object,
      depth: {
        type:Number,
        default: 0,
      }
    },
    data(){
      return{
        token:"",
        tasks:"",
        new_task:"",
        task_edit:"",
        expanded: false,
        show_add: false,
        show_edit: false,
        show_modal: false,
      }
    },
    async created(){
      this.tasks = this.node

      if(localStorage.token || sessionStorage.token){

        if(localStorage.token){
          
          this.token = localStorage.token
          this.username = localStorage.username

        }else if(sessionStorage.token){
          
          this.token = sessionStorage.token
          this.username = sessionStorage.username

        }

        var check = await Axios.check_user(this.token)

        if(check.user.status == "block"){

          this.$router.push('/login')

        }
        
      }else{
        this.$router.push('/login')
      }

    },
    components: {
      Modal,
    },
    computed: {
      hasChildren(){
        return this.tasks.children
      }
    },
    methods:{

      reload_component(){
        this.$router.push("/tasks")
      },

      async add_task(new_task, id_parent){

        var response = await Axios.create_task(this.token, new_task, id_parent)
        
        if(response.success){
          console.log(response.success)
          this.reload_component()
        }else{
          console.log("Erro ao criar a task!")
          console.log(response.error)
        }

      },

      async edit_task(id_task, edit_edited){
        
        var response = await Axios.edit_task(this.token, id_task, edit_edited)
        console.log(response)

        if(response){
          this.reload_component()
        }

      },

      show_task_edit(task){

        this.task_edit = task
      },

    },
  } 

</script>

<style lang="scss" scoped>

</style>