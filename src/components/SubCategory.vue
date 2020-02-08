<template>
  <div>
    <credit :credit="credit">
      <div
        class="cover"
        :style="{
          backgroundImage: 'url(' + require('../assets/' + name + '.jpg') + ')'
        }"
      >
        <div class="tint">
          <h1 class="text-capitalize ptl">
            <router-link to="/categories" class="no-deco b-link"
              >Categories</router-link
            >
            /
            <router-link
              :to="`/categories/${category.name}`"
              class="no-deco b-link"
            >
              {{ category.name }}
            </router-link>
            / <span class="">{{ subCategory.name }}</span>
          </h1>
          <router-link
            :to="
              '/categories/' + category.name + '/' + encryptCategory(sub.name)
            "
            v-for="(sub, index) in category.subs"
            :key="index"
            class="stl brighten-1 no-deco"
            :class="{
              'accent--text font-weight-bold': sub.name == subCategory.name
            }"
            >{{ sub.name }}({{ sub.list_count }})&nbsp;&nbsp;
          </router-link>
        </div>
      </div>
    </credit>
    <div class="mt-12" style="max-width:400px">
      <sorter @change="refetch" :options="options"></sorter>
    </div>
    <div class="mt-12">
      <display-lists v-if="sort == 'lists'" :lists="lists"></display-lists>
      <display-demands
        v-if="sort == 'demands'"
        :demands="demands"
      ></display-demands>
    </div>
    <empty
      v-if="
        (sort == 'lists' && lists.length == 0 && !fetching) ||
          (sort == 'demands' && demands.length == 0 && !fetching)
      "
      :message="
        sort == 'lists'
          ? 'No List in this subcategory'
          : 'No Demand in this subcategory'
      "
      :height="'13em'"
      :icon="'far fa-frown'"
      :iconSize="'5em'"
    ></empty>
    <mugen-scroll
      :handler="fetchMore"
      :should-handle="!fetching"
      :threshold="0"
    >
      <list-loading v-if="!complete && fetching"></list-loading
    ></mugen-scroll>
  </div>
</template>
<script>
import Sorter from "./Sorter";
import DisplayDemands from "./DisplayDemands";
import MugenScroll from "vue-mugen-scroll";
import PhotoCredit from "./PhotoCredit";
import imageLinks from "../../public/my-modules/image-links";
export default {
  components: {
    Sorter,
    DisplayDemands,
    MugenScroll,
    credit: PhotoCredit
  },
  data() {
    return {
      lists: [],
      demands: [],
      fetching: false,
      sort: "lists",
      sortBy: "Random",
      complete: false
    };
  },
  methods: {
    fetchLists() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_subcategory_lists", {
          category: this.$route.params.category,
          subCategory: this.$route.params.subcategory,
          limit: 20,
          sortBy: this.sortBy
        })
        .then(lists => {
          this.lists = this.lists.concat(lists);
          this.fetching = false;
        })
        .catch(_ => {});
    },
    fetchMoreLists() {
      if (this.complete || this.lists.length == 0) {
        return;
      }
      this.fetching = true;
      this.$store
        .dispatch("fetch_subcategory_lists", {
          category: this.$route.params.category,
          subCategory: this.$route.params.subcategory,
          limit: 20,
          sortBy: this.sortBy,
          lastDoc: this.lists[this.lists.length - 1]
        })
        .then(lists => {
          this.lists = this.lists.concat(lists);
          this.fetching = false;
          if (lists.length == 0) {
            this.complete = true;
          }
        })
        .catch(_ => {});
    },
    fetchDemands() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_subcategory_demands", {
          category: this.$route.params.category,
          subCategory: this.$route.params.subcategory,
          limit: 20,
          sortBy: this.sortBy
        })
        .then(query => {
          this.demands = query.docs;
          this.fetching = false;
        })
        .catch(_ => {});
    },
    fetchMoreDemands() {
      if (this.complete || this.demands.length == 0) {
        return;
      }
      this.fetching = true;
      this.$store
        .dispatch("fetch_subcategory_demands", {
          category: this.$route.params.category,
          subCategory: this.$route.params.subcategory,
          limit: 20,
          sortBy: this.sortBy,
          lastDoc: this.demands[this.demands.length - 1]
        })
        .then(query => {
          this.demands = this.demands.concat(query.docs);
          this.fetching = false;
          if (query.docs.length == 0) {
            this.complete = true;
          }
        })
        .catch(_ => {});
    },
    refetch(vals) {
      this.complete = false;
      this.sort = vals.choice;
      this.sortBy = vals.subChoice;
      this.lists = [];
      this.demands = [];
      if (this.sort == "lists") {
        this.fetchLists();
      } else {
        this.fetchDemands();
      }
    },
    fetchMore() {
      if (this.sort == "lists") {
        this.fetchMoreLists();
      } else if (this.sort == "demands") {
        this.fetchMoreDemands();
      } else {
        console.log("Unregistered Command");
      }
    },
    encryptCategory(name) {
      return name.replace(/\//g, "zzsl");
    },
    decryptCategory(name) {
      return name.replace(/%sl/g, "/");
    }
  },
  computed: {
    category() {
      let category = this.$store.getters.categories.find(category => {
        return category.name == this.$route.params.category;
      });
      return category;
    },
    subCategory() {
      let subCategory = this.category.subs.find(sub => {
        return this.encryptCategory(sub.name) == this.$route.params.subcategory;
      });
      return subCategory;
    },
    sub() {
      return this.$route.params.subcategory;
    },
    options() {
      return [
        {
          label: "Lists",
          value: "lists",
          sorts: ["Random", "Top Rated", "Popular", "Newest", "Oldest"]
        },
        {
          label: "Demands",
          value: "demands",
          sorts: [
            "Random",
            "Most Demanded",
            "Least Demanded",
            "Newest",
            "Oldest"
          ]
        }
      ];
    },
    name() {
      let data = this.$vuetify.breakpoint.xs
        ? this.category.name + "-low"
        : this.category.name;
      return data.replace(/ /g, "");
    },
    credit() {
      let result =
        imageLinks[
          this.category.name
            .toLowerCase()
            .replace(/\&/g, "_")
            .replace(/ /g, "")
        ];
      return result;
    }
  },
  watch: {
    sub() {
      this.lists = this.demands = [];
      if (this.sort === "lists") {
        this.fetchLists();
      } else {
        this.fetchDemands();
      }
    }
  },
  created() {
    this.fetchLists();
  }
};
</script>
<style scoped>
.cover {
  width: calc(100% + 1em);
  min-height: 60vh;
  background-size: 100% auto;
  display: flex;
  position: relative;
  background-repeat: repeat-y;
  margin-top: -2em;
  margin-left: -0.5em;
}
@media (min-width: 600px) {
  .cover {
    min-height: 70vh;
    width: calc(100% + 1em);
    margin-left: -1em;
  }
}
.tint {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  bottom: 0em;
  left: 2em;
  padding: 1em;
}
.b-link {
  color: white;
}
.b-link:hover {
  color: var(--accent);
}
</style>
