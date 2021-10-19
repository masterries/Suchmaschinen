<template>
  <b-card :img-src="`${content._source.picture_url}`" 
  :title="`${content._source.title} ${content._source.country}`"
 
  img-alt="Image"
  img-left
  class="mb-3"
            img-height="150"
          img-width="150"
  :sub-title="`${content._source.category_name}`"
   tag="article">

     <b-card-text maxlength= 100>
    Follower : {{content._source.followers}} <br>
    Join Date : {{content._source.join_date}} <br>
    Videos : {{content._source.videos}} <br>
    <p v-if="content._source.country !== undefined " > Country : {{content._source.country}} </p>
    </b-card-text>

    <b-button :href="`${content._source.profile_url}`" variant="primary">Go to {{content._source.title}} on Youtube</b-button>

  </b-card>

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
