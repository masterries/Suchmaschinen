<template>


  <div id="app">

    

<select v-model ="sort"  @change="onSubmit()">
    <option >desc</option>
    <option >asc</option>
</select>
<select v-model ="sortBy"  @change="onSubmit()">
    <option >videos</option>
    <option >followers</option>

</select>
    <searchbar v-model="searchQuery" @input="onSubmit" v-on:click="onSubmit"/>

    <b-container>
      
      <template v-if="searchResults.length > 0">
        <result-card
        
          v-for="(item, index) in searchResults"
          :key="`resultCard-${index}`"
          :number="index + 1"
          :content="item"
        />
      </template>

      <template v-else>
        <div class="text-secondary text-center">Keine Ergebnisse!</div>
      </template>

    </b-container>
  </div>

 
</template>



<script>
import resultCard from './components/ResultCard.vue';
import searchbar from './components/Searchbar.vue';
import axios from 'axios';

export default {
  name: 'App',

  components: {
    resultCard,
    searchbar,
  },

  metaInfo: {
    title: 'Suchmaschinen template'
  },

  data() {
    return {
      sort : "desc",
      searchQuery: '',
      searchResults: [],
      sortBy : "followers"

    }
  },

  



  

  methods: {
    onSubmit() {
      // TODO: NPM server




      axios.get('http://localhost:5050/search?q='+this.searchQuery+"&order="+this.sort+"&by="+this.sortBy)
        .then((response) => {
          console.log(response)
          if (response.data === null) {
            this.searchResults = [];
          } else {
            this.searchResults = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
          this.searchResults = []
        })
    }
  }
}
</script>
