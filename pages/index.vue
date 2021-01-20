<script>
export default {
  async fetch({ store, redirect }) {
    if (store.getters['items/categories'].length === 0) {
      await store.dispatch('items/fetchCategories')
    }
    redirect(`/${store.getters['items/categories'][0].id}`)
  },
  computed: {
    categories() {
      return this.$store.getters['items/categories']
    },
  },
  methods: {
    openCategory(id) {
      this.$router.push(`${id}`)
    },
  },
}
</script>
