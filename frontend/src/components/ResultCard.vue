<template>
<div class ="col mb-4">
  <div class ="card">
    <img :src="`${content._source.picture_url}`" class="card-img-top">
    <div class ="card-body"> 
      <h5 class="card-title">{{content._source.title}} </h5>
      <div class="card-text"> 
    
    Follower : {{content._source.followers}} <br>
    Join Date : {{content._source.join_date}} <br>
    Videos : {{content._source.videos}} <br>
    Category : {{content._source.category_name}} <br>
   <!--  !-->

      
      <p v-if="content._source.country !== undefined " > Country : {{content._source.country}} </p>
      <p v-else> <br></p>
</div>

    </div>



  </div></div>
</template>

<script>
export default {

  name: 'ResultCard',

  props: {
    number: Number,
    content: undefined
  }
}
</script>
