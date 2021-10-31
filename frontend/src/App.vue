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

                        <b-form-group v-slot="{ ariaDescribedby }"  >


                          <b-form-checkbox-group
                            id="checkbox-group-2"
                            v-model="filter"
                          
                            :aria-describedby="ariaDescribedby"
                            name="flavour-2"
                            stacked
                            switches
                            @change="onSubmit()"
                          >
                            <b-form-checkbox value="10"><span style="display:inline-block; width: 130px;">  Musik        </span>{{categoryCount10}} </b-form-checkbox>
                            <b-form-checkbox value="24"><span style="display:inline-block; width: 130px;">  Entertainment    </span>{{categoryCount24}}</b-form-checkbox>
                            <b-form-checkbox value="20"><span style="display:inline-block; width: 130px;">  Gaming            </span>{{categoryCount20}}</b-form-checkbox>
                            <b-form-checkbox value="22"><span style="display:inline-block; width: 130px;">  People & Blogs    </span>{{categoryCount22}}</b-form-checkbox>
                            <b-form-checkbox value="26"><span style="display:inline-block; width: 130px;">  Howto & Style     </span>{{categoryCount26}}</b-form-checkbox>
                            <b-form-checkbox value="27"><span style="display:inline-block; width: 130px;">  Education         </span>{{categoryCount27}}</b-form-checkbox>
                            <b-form-checkbox value="1"> <span style="display:inline-block; width: 130px;">  Film & Animation </span>{{categoryCount1}}</b-form-checkbox>
                            <b-form-checkbox value="17"><span style="display:inline-block; width: 130px;">  Sports            </span>{{categoryCount17}}</b-form-checkbox>
                            <b-form-checkbox value="28"><span style="display:inline-block; width: 130px;">  Science & Tech    </span>{{categoryCount28}}</b-form-checkbox>
                            <b-form-checkbox value="23"><span style="display:inline-block; width: 130px;">  Comedy            </span>{{categoryCount23}}</b-form-checkbox>
                            <b-form-checkbox value="2"> <span style="display:inline-block; width: 130px;">  Cars & Vehicles  </span>{{categoryCount2}}</b-form-checkbox>
                            <b-form-checkbox value="25"><span style="display:inline-block; width: 130px;">  News & Politic    </span>{{categoryCount25}} </b-form-checkbox>
                            <b-form-checkbox value="19"><span style="display:inline-block; width: 130px;">  Travel & Event </span>{{categoryCount19}}</b-form-checkbox>
                            <b-form-checkbox value="15"><span style="display:inline-block; width: 130px;">  Pets & Animals </span>{{categoryCount15}}</b-form-checkbox>
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
                <b-form-datepicker id="datepicker1" v-model="date1" @input="onSubmit()" class="mb-2" :min="min" :max="max" />
                <b-form-datepicker id="datepicker2" v-model="date2" @input="onSubmit()" class="mb-2" :min="min" :max="max" />     
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
import resultCard from "./components/ResultCard.vue";
import searchbar from "./components/Searchbar.vue";
import axios from "axios";
const host = "http://localhost";
const port = "5050";

export default {
  name: "App",

  components: {
    resultCard,
    searchbar,
  },

  metaInfo: {
    title: "Suchmaschinen template",
  },

  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minDate = new Date("2000-01-01");
    const maxDate = new Date(today);

    return {
      sort: "desc",
      searchQuery: "",
      searchResults: [],
      sortBy: "followers",
      filter: [],
      filterCountry: [],
      errors: [],
      date1: "2009-12-26",
      date2: "2019-12-28",
      min: minDate,
      max: maxDate,
      valueRangeVideos: "",
      valueRangeFollowers: "",
      followersUpper: "10000000",
      followersLower: "1",
      videoLower: "1",
      videoUpper: "100000",
      sugg: "",
      page: "0",
      treffer: "12",
      active: "",
      pmax: "2",
      maxRes: 9999,
      buckets: [],
      categoryCount10: "0",
      categoryCount24: "0",
      categoryCount20: "0",
      categoryCount22: "0",
      categoryCount26: "0",
      categoryCount27: "0",
      categoryCount1: "0",
      categoryCount17: "0",
      categoryCount28: "0",
      categoryCount23: "0",
      categoryCount2: "0",
      categoryCount25: "0",
      categoryCount19: "0",
      categoryCount15: "0",
    };
  },

  methods: {
    onSubmit() {
      // TODO: NPM server

      console.log(
        "sort: " +
          this.sort +
          " sortBy: " +
          this.sortBy +
          " filters: " +
          this.filter
      );
      //placeholder Variable
      console.log(this.active);
      var page = window.location.href.split("#")[1];

      console.log(page);

      var datea = this.date1;
      var dateb = this.date2;

      if (this.date1 > this.date2) {
        datea = this.date2;
        dateb = this.date1;
      }

      axios
        .get(
          host +
            ":" +
            port +
            "/search?q=" +
            this.searchQuery +
            "&order=" +
            this.sort +
            "&by=" +
            this.sortBy +
            "&filter=" +
            this.filter +
            "&videoRange=" +
            this.videoLower +
            "-" +
            this.videoUpper +
            "&date=" +
            datea +
            ";" +
            dateb +
            "&follower=" +
            this.followersLower +
            "-" +
            this.followersUpper +
            "&country=" +
            this.filterCountry +
            "&treffer=" +
            this.treffer +
            "&page=" +
            page
        )
        .then((response) => {
          if(response.data == "Error"){
            this.errors = response;
             this.errors.name =
              "While Waiting for Response from BackendServer on " +
              host +
              ":" +
              port + " Malforming Parameters";
              this.searchResults = [];

          }else{
             this.errors = [];
          console.log(response);
          //this.sugg = response.data[0]._source.Suggestion;
          //console.log(this.sugg);
          console.log(response.data)
          

          if (response.data.hits.hits === null) {
            this.searchResults = [];
          } else {
            this.searchResults = response.data.hits.hits;
          }
          this.pmax = response.data.aggregations.total.value / this.treffer;
          if (response.data.aggregations.total.value % this.treffer > 0) {
            this.pmax += 1;
          }
          if (response.data.aggregations.total.value > this.maxRes) {
            this.pmax = this.maxRes / this.treffer;
          }
          this.buckets = response.data.aggregations.totalCat.buckets;
          this.updateBuckets();
            
          }
         

        })

        .catch((error) => {
          //window.alert("Backend not reachable on " + host + +  ":" + port, "Timeout");
          this.errors = error;
          if (error.message == "Network Error") {
            this.errors.name =
              "while Waiting for Response from BackendServer on " +
              host +
              ":" +
              port;
          }
          this.searchResults = [];
        });
    },

    resetCategoryFilters() {
      this.filter = [];
      this.onSubmit();
    },

    updateBuckets() {
      this.categoryCount10= 0;
      this.categoryCount24= 0;
      this.categoryCount20= 0;
      this.categoryCount22= 0;
      this.categoryCount26= 0;
      this.categoryCount27= 0;
     this.categoryCount1= 0;
      this.categoryCount17= 0;
      this.categoryCount28= 0;
      this.categoryCount23= 0;
     this.categoryCount2= 0;
      this.categoryCount25= 0;
      this.categoryCount19= 0;
      this.categoryCount15= 0;

      this.buckets.forEach((element) => {
        switch (element.key) {
          case 10:
            this.categoryCount10 = element.doc_count;
            break;
          case 24:
            this.categoryCount24 = element.doc_count;
            break;
          case 20:
            this.categoryCount20 = element.doc_count;
            break;
          case 22:
            this.categoryCount22 = element.doc_count;
            break;
          case 26:
            this.categoryCount26 = element.doc_count;
            break;
          case 27:
            this.categoryCount27 = element.doc_count;
            break;
          case 1:
            this.categoryCount1 = element.doc_count;
            break;
          case 17:
            this.categoryCount17 = element.doc_count;
            break;
          case 28:
            this.categoryCount28 = element.doc_count;
            break;
          case 23:
            this.categoryCount23 = element.doc_count;
            break;
          case 2:
            this.categoryCount2 = element.doc_count;
            break;
          case 25:
            this.categoryCount25 = element.doc_count;
            break;
          case 19:
            this.categoryCount19 = element.doc_count;
            break;
          case 15:
            this.categoryCount15 = element.doc_count;
            break;
        }
      });
    },

    resetCountryFilters() {
      this.filterCountry = [];
      this.onSubmit();
    },

    hitsDropdown(value) {
      this.treffer = value;
      this.onSubmit();
    },
  },

  beforeMount() {
    this.onSubmit();
  },
};
</script>



<style >
@import "/assets/reset.css";
</style>