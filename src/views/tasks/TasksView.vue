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

      <div v-if="tasks.root_tasks">
        <ChildTasks
         v-for="(child, index) in c_tasks" :key="index"
         :node="child"
        />
      </div>
      <div v-else>
        Nenhuma task encontrada!
      </div>

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
        c_tasks:"",
        new_task: "",
      }
    },
    async created(){

      if(localStorage.token || sessionStorage.token){

        if(localStorage.token){
          
          this.token = localStorage.token

        }else{
          
          this.token = sessionStorage.token

        }

        var check = await Axios.check_user(this.token)

        if(check.user.status != "block"){

          var response = await Axios.all_tasks(this.token)

          if(response.root_tasks == null){
            console.log("Nenhuma tasks encontrada!")
          }else{
            
            this.tasks = response

            this.childtasks()

            this.c_tasks = this.tasks.root_tasks
          }

        }else{
          this.$router.push('/login')
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

      },

      childtasks(){

        if(this.tasks.child_tasks.lenght != 0){

          for(let i = 0; i < this.tasks.root_tasks.length; i++){

            for(let x = 0; x < this.tasks.child_tasks.length; x++){

              if(this.tasks.root_tasks[i].id == this.tasks.child_tasks[x].id_parent){

                this.child_tasks(this.tasks.child_tasks[x], this.tasks.child_tasks)

                if(this.tasks.root_tasks[i].children){

                  this.tasks.root_tasks[i].children.push(this.tasks.child_tasks[x])

                }else{

                  this.tasks.root_tasks[i].children = Object.assign([this.tasks.child_tasks[x]])
                
                }

              }

            }

          }

        }
      },

      child_tasks(root_tasks, child_tasks){

        for(let i = 0; i < child_tasks.length; i++){

          if(root_tasks.id == child_tasks[i].id_parent){

            this.child_tasks(child_tasks[i], this.tasks.child_tasks)

            root_tasks.children = Object.assign([child_tasks[i]])

          }

        }

        return root_tasks
      },

    }
  }

</script>

<style lang="scss" scoped>

</style>