<template>


<div id="app">
  <searchbar v-model="searchQuery" @input="onSubmit" v-on:click="onSubmit"/>
  
  <b-container marign-bot=20px>

<div>
    <b-form-group label="Order" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        v-model="sort"
        :aria-describedby="ariaDescribedby"
        name="radios-stacked-order"
        stacked
      >
        <b-radio value="asc">Ascending</b-radio>
        <b-radio value="desc">Descending</b-radio>
      </b-form-radio-group>
    </b-form-group>

    <b-form-group label="Order Value" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        v-model="sortBy"
        :aria-describedby="ariaDescribedby"
        name="radios-stacked-order-values"
        stacked
      >
        <b-radio value="normal">Relevance</b-radio>
        <b-radio value="followers">Followers</b-radio>
        <b-radio value="videos">Videos</b-radio>
      </b-form-radio-group>
    </b-form-group>
  </div>

<b-form-group label="Using sub-components:" v-slot="{ ariaDescribedby }">
      <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="filter"
        :aria-describedby="ariaDescribedby"
        name="flavour-2"
        stacked
      >
        <b-form-checkbox value="Music">Music</b-form-checkbox>
        <b-form-checkbox value="Entertainment">Entertainment</b-form-checkbox>
        <b-form-checkbox value="Gaming">Gaming</b-form-checkbox>
        <b-form-checkbox value="People_n_Blogs">People and Blogs</b-form-checkbox>
        <b-form-checkbox value="Howto_n_Style">Howto and Style</b-form-checkbox>
        <b-form-checkbox value="Education">Education</b-form-checkbox>
        <b-form-checkbox value="Film_and_Animation">Film and Animation</b-form-checkbox>
        <b-form-checkbox value="Sports">Sports</b-form-checkbox>
        <b-form-checkbox value="Science_n_Technology">Science and Technology</b-form-checkbox>
        <b-form-checkbox value="Comedy">Comedy</b-form-checkbox>
        <b-form-checkbox value="Autos_n_Vehicles">Autos_and_Vehicles</b-form-checkbox>
        <b-form-checkbox value="News_n_Politics">News and Politics</b-form-checkbox>
        <b-form-checkbox value="Travel_n_Events">Travel and Events</b-form-checkbox>
        <b-form-checkbox value="Pets_n_Animals">Pets and Animals</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>

  </b-container>
  
  <b-container>
    <b-card-group columns>
      
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

    </b-card-group>
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
    searchbar
  },

  metaInfo: {
    title: 'Suchmaschinen template'
  },

  data() {
    return {
      sort : "desc",
      searchQuery: '',
      searchResults: [],
      sortBy : "followers",
      filter : []
    }
  },

  



  

  methods: {
    onSubmit() {
      // TODO: NPM server
    console.log(this.sort +"  "+ this.sort2 +"  "+ this.sortBy + "  " + this.filter);


      axios.get('http://localhost:5050/search?q='+this.searchQuery+"&order="+this.sort+"&by="+this.sortBy+"&filter="+this.filter)
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
