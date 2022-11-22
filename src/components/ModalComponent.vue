<template>

  <div class="modal-backdrop">
    <div class="row align-items-center justify-content-center">

      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Tem certeza que quer deletar essa task! </h5>
            <button @click="close" type="button" class="close" aria-label="Fechar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Você esta deletando a task: {{task.task}}.<br/>
            Isso vai apagar as suas subtasks tambem!
          </div>
          <div class="modal-footer">
            <button @click="close" type="button" class="btn btn-secondary">Cancelar</button>
            <button @click="del_task(task.id)" type="button" class="btn btn-danger">Deletar</button>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>

  import Axios from '@/api/api.js';

  export default {
    name: 'ModalComponent',
    props:{
      task: Object,
    },
    data(){
      return{
        token:"",
      }
    },
    components: {
    },
    async created(){

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
    methods: {
      notifications_child(notification){
        this.$parent.notifications_child(notification)
      },

      reload_component(){
        this.$parent.reload_component()
      },
      
      close() {
        this.$emit('close');
      },

      async del_task(id_task){
        
        var response = await Axios.del_task(this.token, id_task)
        
        if(response.success){
          this.notifications_child(response)
          this.reload_component()
        }else{
          this.notifications_child(response)
        }

      },

    },
  }
</script>

<style lang="scss" scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
  }

  .row{
     display: flex;
     width: 100%;
     height: 100%;
     margin-left: 0px;
  }

</style>