<template>
  <div class="app" id="app">
    <div class="searchbar">
      <searchbar id="searchbar" v-model="searchQuery" @input="onSubmit" v-on:click="onSubmit"/>
      <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="errors.length !=0" width="150">
        <h4 class="alert-heading text-center"><b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill> 
             Oops! Something went wrong.</h4>
        <p class="text-center">{{errors.message}} {{errors.name}}</p>
        <p class="text-center">Request : {{errors.config.url}}</p>
      </div>
      <div class="alert alert-secondary" role="alert" v-if="sugg" Style="float: right;width: 12%;margin-top: -90px;">
        <p class="text-center">Suggestion:(W.I.P)</p>
        <p class="text-center"><strong>{{sugg}}</strong></p>
      </div>
    </div>

    <b-container name="body" class="bv-row">
      <b-row>
        <b-col cols="3">
          <div name="menu" class="menu">
            <b-container>
              <div name="order-div">
                <b-form-group label="Order" v-slot="{ ariaDescribedby }">
                  <b-form-radio-group
                    v-model="sort"
                    @change="onSubmit()"
                    :aria-describedby="ariaDescribedby"
                    name="radios-stacked-order"
                    stacked
                  >
                    <b-radio value="asc">Ascending</b-radio>
                    <b-radio value="desc">Descending</b-radio>
                  </b-form-radio-group>
                </b-form-group>
              </div>

              <div name="order-value-div">
                <b-form-group label="Order Value" v-slot="{ ariaDescribedby }" @change="onSubmit()">
                  <b-form-radio-group
                    v-model="sortBy"
                    @change="onSubmit()"
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

              <div name="categories-div">
                <b-form-group label="Categories" v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    id="checkbox-group-2"
                    v-model="filter"
                    @change="onSubmit()"
                    :aria-describedby="ariaDescribedby"
                    name="flavour-2"
                    stacked
                  >
                    <b-form-checkbox value="10">Music</b-form-checkbox>
                    <b-form-checkbox value="24">Entertainment</b-form-checkbox>
                    <b-form-checkbox value="20">Gaming</b-form-checkbox>
                    <b-form-checkbox value="22">People & Blogs</b-form-checkbox>
                    <b-form-checkbox value="26">Howto & Style</b-form-checkbox>
                    <b-form-checkbox value="27">Education</b-form-checkbox>
                    <b-form-checkbox value="1">Film & Animation</b-form-checkbox>
                    <b-form-checkbox value="17">Sports</b-form-checkbox>
                    <b-form-checkbox value="28">Science & Technology</b-form-checkbox>
                    <b-form-checkbox value="23">Comedy</b-form-checkbox>
                    <b-form-checkbox value="2">Cars & Vehicles</b-form-checkbox>
                    <b-form-checkbox value="25">News & Politics</b-form-checkbox>
                    <b-form-checkbox value="19">Travel & Events</b-form-checkbox>
                    <b-form-checkbox value="15">Pets & Animals</b-form-checkbox>
                  </b-form-checkbox-group>
                  <b-button pill>Reset filters</b-button> <!-- no funtionality atm -->
                </b-form-group>
              </div>

              <div name="country-div">
                <b-form-group label="Countries" v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    id="checkbox-group-countries"
                    v-model="filterCountry"
                    @change="onSubmit()"
                    :aria-describedby="ariaDescribedby"
                    name="country"
                    stacked
                  > 
                    <b-form-checkbox value="United States">United States</b-form-checkbox>
                    <b-form-checkbox value="Great-Britain">Great-Britain</b-form-checkbox>
                    <b-form-checkbox value="India">India</b-form-checkbox>
                    <b-form-checkbox value="Canada">Canada</b-form-checkbox>
                    <b-form-checkbox value="Russian Federation">Russian Federation</b-form-checkbox>
                    <b-form-checkbox value="Australia">Australia</b-form-checkbox>
                    <b-form-checkbox value="Germany">Germany</b-form-checkbox>
                    <b-form-checkbox value="Other">Other</b-form-checkbox>
                  </b-form-checkbox-group>
                  <b-button pill>Reset filters</b-button> <!-- no funtionality atm -->
                </b-form-group>
              </div>

              <div name="datepicker-div"> <!-- possible other solution? https://innologica.github.io/vue2-daterange-picker -->
                <b-form-datepicker id="datepicker1" v-model="date1" @change="onSubmit()" @context="onContext1" class="mb-2" today-button reset-button close-button :min="min" :max="max" :state="dateValidation1" />
                <b-form-datepicker id="datepicker2" v-model="date2" @change="onSubmit()" @context="onContext2" class="mb-2" today-button reset-button close-button :min="min" :max="max" :state="dateValidation2" />     
              </div>

              <div> <!-- maybe this is better: http://drewcovi.github.io/bootstrap-range/ -->
                <label for="range-videos">Range Videos</label>
                <!--<b-form-input id="range-videos" v-model="valueRangeVideos" @change="onSubmit()" type="range" min="0" max="1000000"></b-form-input>
                <div class="mt-2">Value: {{ valueRangeVideos }}</div>-->
                <b-form-input v-model="videoLower" @change="onSubmit()" placeholder="min."/>
                <b-form-input v-model="videoUpper" @change="onSubmit()" placeholder="max."/>
              </div>

              <div>
                <label for="range-followers">Range Followers</label>
                <!--<b-form-input id="range-followers" v-model="valueRangeFollowers" @change="onSubmit()" type="range" min="0" max="1000000000"></b-form-input>
                <div class="mt-2">Value: {{ valueRangeFollowers }}</div>-->
                <b-form-input v-model="followersLower" @change="onSubmit()" placeholder="min."/>
                <b-form-input v-model="followersUpper" @change="onSubmit()" placeholder="max."/>
              </div>

              <div>
                <label for="range-pages">Anzahl Treffer  und Seite</label>
                <!--<b-form-input id="range-followers" v-model="valueRangeFollowers" @change="onSubmit()" type="range" min="0" max="1000000000"></b-form-input>
                <div class="mt-2">Value: {{ valueRangeFollowers }}</div>-->
                <b-form-input v-model="treffer" @change="onSubmit()" placeholder="Treffer Anzahl"/>
                <b-form-input v-model="page" @change="onSubmit()" placeholder="Page Number"/>
              </div>

            </b-container>
          </div>
        </b-col>
        <b-col cols="9">
          <div name="result" float: right>
            <b-container>
              <div class ="row row-cols-1 row-cols-md-3">
              
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
                </div>
              
            </b-container>
          </div>
        </b-col>
      </b-row>

      <div class="pageselect">
        <b-pagination-nav
         @change="onSubmit()"
          :number-of-pages="pmax"
          base-url="#"
          class="mt-4"
          align="center"
        >
          <template #first-text><span class="text-success">First</span></template>
          <template #prev-text><span class="text-danger">Prev</span></template>
          <template #next-text><span class="text-warning">Next</span></template>
          <template #last-text><span class="text-info">Last</span></template>
          <template #ellipsis-text>
          </template>
          <template #page="{ page, active }">
            <b v-if="active">{{ page }}</b>
            <i v-else>{{ page }}</i>
          </template>
        </b-pagination-nav>
      </div>

      <div class="footer">
        <div id="button"/>
        <div id="container">
          <div id="cont"/>
          <div class="footer_center">
            <!-- img src=".\image\android-chrome-192x192.png" alt="Random Logo"> -->
            <h3>Vorlesung Suchmaschinen von B.Sc. Michael Siebers </h3>
            <h3>Seite Entwickelt von Patrick Ries (pari1012) und Kai Schwark (scka1066)</h3>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>




<script>
  import resultCard from './components/ResultCard.vue';
  import searchbar from './components/Searchbar.vue';
  import axios from 'axios';
  const host = "http://localhost";
  const port = "5050"

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
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const minDate = new Date("2000-01-01")
      const maxDate = new Date(today)

      return {
        sort : "desc",
        searchQuery: '',
        searchResults: [],
        sortBy : "followers",
        filter : [],
        filterCountry : [],
        errors :[],
        date1 : '2009-12-26',
        date2 : '2019-12-28',
        min: minDate,
        max: maxDate,
        valueRangeVideos : '',
        valueRangeFollowers : '',
        followersUpper : '10000000',
        followersLower : '1',
        videoLower : '1',
        videoUpper : '100000',
        sugg: "",
        page:"1",
        treffer : "12",
        pmax : "10"
      }
    },

    methods: {
      onSubmit() {
        // TODO: NPM server

      console.log("sort: " + this.sort +" sortBy: "+ this.sortBy + " filters: " + this.filter);
      //placeholder Variable


        axios.get(host+":"+port+"/search?q="+this.searchQuery+"&order="+this.sort+"&by="+this.sortBy
                  +"&filter="+this.filter+"&videoRange="+this.videoLower+"-"+this.videoUpper+"&date="+this.date1+";"+this.date2+
                  "&follower="+this.followersLower+"-"+this.followersUpper+"&country="+this.filterCountry+"&treffer="+this.treffer +"&page=" +this.page)
          .then((response) => {
             this.errors =[];
             this.sugg = response.data[0]._source.Suggestion;
             console.log(this.sugg);
            console.log(response )
            if (response.data === null) {
              this.searchResults = [];
            } else {
              this.searchResults = response.data;
            }
          })
          .catch((error) => {
            //window.alert("Backend not reachable on " + host + ":" + port, "Timeout");
            this.errors = error;
            if(error.message =="Network Error"){
              this.errors.name ="while Waiting for Response from BackendServer on "
              +host + ":" + port
            }
            this.searchResults = []
          })
      },

  //trying to display validation of the two dates but somethings off
      onContext1(context){
        if (context.date1 == null) {
          this.dateValidation1 = null
        }else{
          if (context.date1 > this.date2) {
            this.dateValidation1 = false
          }else{
            this.dateValidation1 = true
          }
        }      
      },

      onContext2(context){
        if (context.date2 == null) {
          this.dateValidation2 = null
        }else{
          if (context.date2 < this.date1) {
            this.dateValidation2 = false
          }else{
            this.dateValidation2 = true
          }
        }      
      }
    },

    beforeMount(){
      this.onSubmit();
    }
  }
</script>



<style >
  @import '/assets/reset.css';
</style>