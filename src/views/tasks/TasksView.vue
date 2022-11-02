<template>
  <div>
    <Navbar/>
    <main class="container">
      <h1>Suas Tasks Aqui!</h1>
      <div class="input-group mb-3">
        <input v-model="new_task" type="text" class="form-control" placeholder="Digite uma task aqui!" required="required">
        <div class="input-group-append">
          <button @click="new_task_add()" class="btn btn-outline-primary" type="button">Cadastrar task</button>
        </div>
      </div>

      <ChildTasks :all_tasks="tasks"/>

    </main>
  </div>
</template>

<script>
  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'
  import ChildTasks from '@/components/tasks/ChildTasksComponent.vue'

  export default {
    name: 'TasksView',
    components: {
      Navbar,
      ChildTasks,
    },
    data(){
      return{
        token: "",
        tasks:"",
        new_task: "",
      }
    },
    async created(){

      if(localStorage.token || sessionStorage.token){
        
        var response

        if(localStorage.token){
          
          this.token = localStorage.token

        }else{
          
          this.token = sessionStorage.token

        }

        response = await Axios.all_tasks(this.token)

        if(response.root_tasks == null){
          console.log("Nenhuma tasks encontrada!")
        }else{
          this.tasks = response
        }
        
      }else{
        this.$router.push('/login')
      }

    },
    methods:{
      async new_task_add(){

        var response = await Axios.create_task(this.token, this.new_task)

        if(response.success){
          console.log(response.success)
        }else{
          console.log("Erro ao criar a task!")
        }

      }
    }
  }

</script>

<style lang="scss" scoped>

</style>