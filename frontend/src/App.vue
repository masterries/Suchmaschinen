<template>

  <div class="app" id="app">
    <meta name="referrer" content="no-referrer"/>
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

    <b-container name="body" class="bv-row body">
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
                    buttons
                    stacked
                    class="order"
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
                    buttons
                    class="order"
                  >
                    <b-radio value="normal">Relevance</b-radio>
                    <b-radio value="followers">Followers</b-radio>
                    <b-radio value="videos">Videos</b-radio>
                    <b-radio value="join_date">Join Date</b-radio> <!-- dachte es wär nice ein 2x2 block aus den radiobutton buttons zu haben, aber weiß noch nich wie... fänds cooler als einfach 3 stacked optionen -->
                  </b-form-radio-group>
                </b-form-group>
              </div>

              <div label="Filter">
                Filter
                <div name="categories-div" class="filter">
                  <b-input-group>
                    <template #prepend>
                      <b-dropdown id="dropdown-form-categories" text="Categories" ref="dropdown" class="m-2">
                        <b-form-group v-slot="{ ariaDescribedby }" >
                          <b-form-checkbox-group
                            id="checkbox-group-2"
                            v-model="filter"
                            @change="onSubmit()"
                            :aria-describedby="ariaDescribedby"
                            name="flavour-2"
                            stacked
                            switches
                          >
                            <b-form-checkbox value="10">{{this.categoryCount10}} - Musik</b-form-checkbox>
                            <b-form-checkbox value="24">{{this.categoryCount24}} - Entertainment</b-form-checkbox>
                            <b-form-checkbox value="20">{{this.categoryCount20}} - Gaming</b-form-checkbox>
                            <b-form-checkbox value="22">{{this.categoryCount22}} - People & Blogs</b-form-checkbox>
                            <b-form-checkbox value="26">{{this.categoryCount26}} - Howto & Style</b-form-checkbox>
                            <b-form-checkbox value="27">{{this.categoryCount27}} - Education</b-form-checkbox>
                            <b-form-checkbox value="1">{{this.categoryCount1}} - Film & Animation</b-form-checkbox>
                            <b-form-checkbox value="17">{{this.categoryCount17}} - Sports</b-form-checkbox>
                            <b-form-checkbox value="28">{{this.categoryCount28}} - Science & Technology</b-form-checkbox>
                            <b-form-checkbox value="23">{{this.categoryCount23}} - Comedy</b-form-checkbox>
                            <b-form-checkbox value="2">{{this.categoryCount2}} - Cars & Vehicles</b-form-checkbox>
                            <b-form-checkbox value="25">{{this.categoryCount25}} - News & Politics</b-form-checkbox>
                            <b-form-checkbox value="19">{{this.categoryCount19}} - Travel & Events</b-form-checkbox>
                            <b-form-checkbox value="15">{{this.categoryCount15}} - Pets & Animals</b-form-checkbox>
                          </b-form-checkbox-group>
                        </b-form-group>
                      </b-dropdown>
                    </template>
                    <b-input-group-append>
                      <b-button text="Reset" @click="resetCategoryFilters()">Reset</b-button>
                    </b-input-group-append>
                  </b-input-group>

                </div>

                <div name="country-div" class="filter">
                  <b-input-group>                  
                    <template #prepend>
                      <b-dropdown id="dropdown-form-countries" text="Countries" ref="dropdown" class="m-2">
                        <b-form-group v-slot="{ ariaDescribedby }">
                          <b-form-checkbox-group
                            id="checkbox-group-countries"
                            v-model="filterCountry"
                            @change="onSubmit()"
                            :aria-describedby="ariaDescribedby"
                            name="country"
                            stacked
                            switches
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
                        </b-form-group>
                      </b-dropdown>  
                    </template>
                    <b-input-group-append>
                      <b-button text="Reset" @click="resetCountryFilters()">Reset</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </div>                
              </div>

              

              <div name="datepicker-div"> <!-- possible other solution? https://innologica.github.io/vue2-daterange-picker -->
                <label for="range-dates">Range Dates</label>
                <b-form-datepicker id="datepicker1" v-model="date1" @input="onSubmit()" class="mb-2" :min="min" :max="max" :state="dateValidation1" />
                <b-form-datepicker id="datepicker2" v-model="date2" @input="onSubmit()" class="mb-2" :min="min" :max="max" :state="dateValidation2" />     
              </div>

              <div> <!-- maybe this is better: http://drewcovi.github.io/bootstrap-range/ -->
                <label for="range-videos">Range Videos</label>
                <!--<b-form-input id="range-videos" v-model="valueRangeVideos" @change="onSubmit()" type="range" min="0" max="1000000"></b-form-input>
                <div class="mt-2">Value: {{ valueRangeVideos }}</div>-->
                <b-input-group>
                  <template #prepend>
                    <b-input-group-text id="min" style="padding-right: 14px">min.</b-input-group-text>
                  </template>
                  <b-form-input v-model="videoLower" @change="onSubmit()" placeholder="min."/>
                </b-input-group>
                
                <b-input-group>
                  <template #prepend>
                    <b-input-group-text >max.</b-input-group-text>
                  </template>
                <b-form-input v-model="videoUpper" @change="onSubmit()" placeholder="max."/>
                </b-input-group>
              </div>

              <div>
                <label for="range-followers">Range Followers</label>
                <!--<b-form-input id="range-followers" v-model="valueRangeFollowers" @change="onSubmit()" type="range" min="0" max="1000000000"></b-form-input>
                <div class="mt-2">Value: {{ valueRangeFollowers }}</div>-->
                <b-input-group>
                  <template #prepend>
                    <b-input-group-text id="min" style="padding-right: 14px"> min.</b-input-group-text>
                  </template>
                  <b-form-input v-model="followersLower" @change="onSubmit()" placeholder="min."/>
                </b-input-group>
                
                <b-input-group>
                  <template #prepend>
                    <b-input-group-text >max.</b-input-group-text>
                  </template>
                  <b-form-input v-model="followersUpper" @change="onSubmit()" placeholder="max."/>
                </b-input-group>
              </div>

              <div class="range-pages">
                <label for="range-pages">Hits per page</label>
                <b-input-group>
                
                  <template #append>
                    <b-dropdown>
                      <b-dropdown-item @click="hitsDropdown(9)">9</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(12)">12</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(15)">15</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(18)">18</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(24)">24</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(30)">30</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(45)">45</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(60)">60</b-dropdown-item>
                      <b-dropdown-item @click="hitsDropdown(90)">90</b-dropdown-item>
                    </b-dropdown>
                  </template>
                    <b-form-input v-model="treffer" @change="onSubmit()" placeholder="Treffer Anzahl"/>
                </b-input-group>
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
                  first-number
        last-number
        >
          <template #ellipsis-text>
          </template>
          <template #page="{active ,page }">
            <b v-if="active">{{ page  }}</b>
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
        page:"0",
        treffer : "12",
        active:"",
        pmax : "2",
        categoryCount10 : "0",
        categoryCount24 : "0",
        categoryCount20 : "0",
        categoryCount22 : "0",
        categoryCount26 : "0",
        categoryCount27 : "0",
        categoryCount1 : "0",
        categoryCount17 : "0",
        categoryCount28 : "0",
        categoryCount23 : "0",
        categoryCount2 : "0",
        categoryCount25 : "0",
        categoryCount19 : "0",
        categoryCount15 : "0"
      }
    },



    methods: {
      onSubmit() {
        // TODO: NPM server

      console.log("sort: " + this.sort +" sortBy: "+ this.sortBy + " filters: " + this.filter);
      //placeholder Variable
      console.log(this.active)
      var page = window.location.href.split("#")[1]

      console.log(page)

        var datea = this.date1
        var dateb = this.date2

      if(this.date1 > this.date2){
         datea = this.date2
         dateb = this.date1
      }

        axios.get(host+":"+port+"/search?q="+this.searchQuery+"&order="+this.sort+"&by="+this.sortBy
                  +"&filter="+this.filter+"&videoRange="+this.videoLower+"-"+this.videoUpper+"&date="+datea+";"+dateb+
                  "&follower="+this.followersLower+"-"+this.followersUpper+"&country="+this.filterCountry+"&treffer="+this.treffer +"&page=" +page)
          .then((response) => {
             this.errors =[];
             //this.sugg = response.data[0]._source.Suggestion;
             //console.log(this.sugg);
            if (response.data.hits.hits === null) {
              this.searchResults = [];
            } else {
              this.searchResults = response.data.hits.hits;
            }
            this.pmax = response.data.aggregations.total.value / this.treffer
            this.categoryCount10 = response.data.aggregations.count10.value
            this.categoryCount24 = response.data.aggregations.count24.value
            this.categoryCount20 = response.data.aggregations.count20.value
            this.categoryCount22 = response.data.aggregations.count22.value
            this.categoryCount26 = response.data.aggregations.count26.value
            this.categoryCount27 = response.data.aggregations.count27.value
            this.categoryCount1 = response.data.aggregations.count1.value
            this.categoryCount17 = response.data.aggregations.count17.value
            this.categoryCount28 = response.data.aggregations.count28.value
            this.categoryCount23 = response.data.aggregations.count23.value
            this.categoryCount2 = response.data.aggregations.count2.value
            this.categoryCount25 = response.data.aggregations.count25.value
            this.categoryCount19 = response.data.aggregations.count19.value
            this.categoryCount15 = response.data.aggregations.count15.value
            console.log(this.pmax);
          })
          .catch((error) => {
            //window.alert("Backend not reachable on " + host + +  ":" + port, "Timeout");
            this.errors = error;
            if(error.message =="Network Error"){
              this.errors.name ="while Waiting for Response from BackendServer on "
              +host + ":" + port
            }
            this.searchResults = []
          })
      },

      resetCategoryFilters(){
        this.filter = [];
        this.onSubmit();
      },

      resetCountryFilters(){
        this.filterCountry = [];
        this.onSubmit();
      },

      hitsDropdown(value){
        this.treffer = value;
        this.onSubmit();
      },
    },

    beforeMount(){
      this.onSubmit();
    }
  }
</script>



<style >
  @import '/assets/reset.css';
</style>