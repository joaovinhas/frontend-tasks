<template>

  <div class="modal-backdrop">
    <div class="row align-items-center justify-content-center">

      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Salvando alterações! </h5>
            <button @click="close" type="button" class="close" aria-label="Fechar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Tem certeza que desaja salvar as alterações!.<br/>
            As tasks apagadas não terão como ser recuperadas!
          </div>
          <div class="modal-footer">
            <button @click="close" type="button" class="btn btn-danger">Cancelar</button>
            <button @click="save_tasks()" type="button" class="btn btn-success">Salvar</button>
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
    data(){
      return{
        token:"",
      }
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
      
      save_tasks(){
        this.$parent.salvar_tasks()
      },
      
      close() {
        this.$emit('close');
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