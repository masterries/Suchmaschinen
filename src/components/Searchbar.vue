<template>
  <b-navbar type="light" variant="light" class="mb-4 pr-0 pl-0">
    <b-container class="px-3">
      <b-form @click="onSubmit" class="d-flex w-100">
        <div class="flex-fill">

          <b-input-group >
            <template #prepend>
              <b-input-group-text>
                <b-icon icon="search" aria-hidden="true" />
              </b-input-group-text>
            </template>

            <div class="flex-fill">
              <b-form-input
                placeholder="Search term"
                :value="value"
                @input="onQueryInput"
                size="lg"
                autofocus
                autocomplete="off"
                class="searchbar-input"
              />
            </div>
          </b-input-group>
        </div>

        <b-button
          variant="success"
          size="lg"
          class="ml-2"
          type="submit"
        >
          Search
        </b-button>

      </b-form>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'Searchbar',

  props: {
    value: String
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('submit');
    },

    onQueryInput(event) {
      this.$emit('input', event)
    }
  }
}
</script>

<style scoped>
.searchbar-input {
  padding-right: 2em;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
section{
  text-align:center;
}
.footer #button{
	width:35px;
	height:35px;
	border: #727172 12px solid;
	border-radius:35px;
	margin:0 auto;
	position:relative;
	-webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
}
.footer #button:hover{
	width:35px;
	height:35px;
	border: #3A3A3A 12px solid;
	-webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
	position:relative;
}
.footer {
	bottom:0;
	left:0;
	position:fixed;
    width: 100%;
    height: 2em;
    overflow:hidden;
    margin:0 auto;
	-webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
	z-index:999;
}
.footer:hover {
	-webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
	height: 10em;
}
.footer #container{
	margin-top:5px;
	width:100%;
height:100%;
  position:relative;
  top:0;
  left:0;
	background: #3A3A3A;
}
.footer #cont{
  position:relative;
  top:-45px;
  right:190px;
	width:150px;
	height:auto;
	margin:0 auto;
}
.footer_center{
	width:500px;
	float:left;
  text-align:center;
}
.footer h3{
	font-family: 'Helvetica';
	font-size: 30px;
	font-weight: 100;
	margin-top:70px;
	margin-left:40px;
}
</style>
