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
                placeholder="Search ..."
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



</style>
