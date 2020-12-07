<template>
  <div>
    <credit :credit="credit">
      <div
        class="cover"
        :style="{
          backgroundImage: 'url(' + require('../assets/' + name + '.jpg') + ')',
        }"
      >
        <div class="tint">
          <h1 class="text-capitalize stl mb-2">
            <router-link to="/categories" class="no-deco b-link brighten-1"
              >Categories</router-link
            >
            /
            <span class="white--text">{{ category.name }}</span>
          </h1>
          <router-link
            :to="
              '/categories/' + category.name + '/' + encryptCategory(sub.name)
            "
            v-for="(sub, index) in category.subs"
            :key="index"
            class="stl brighten-1 no-deco"
            >{{ sub.name }}({{ sub.list_count }})&nbsp;&nbsp;
          </router-link>
        </div>
      </div>
    </credit>

    <div style="display:flex">
      <div class="mt-8 mx-auto brand--text" style="max-width:400px">
        <sorter v-if="newF" @change="refetch" :options="options"></sorter>
      </div>
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
          ? 'No List in this category'
          : 'No Demand in this category'
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
import MugenScroll from "vue-mugen-scroll";
import Sorter from "../components/Sorter";
import DisplayDemands from "../components/DisplayDemands";
import PhotoCredit from "../components/PhotoCredit";
import imageLinks from "../my-modules/js/image-links";
export default {
  components: {
    Sorter,
    DisplayDemands,
    MugenScroll,
    credit: PhotoCredit,
  },
  data() {
    return {
      lists: [],
      demands: [],
      fetching: false,
      sort: "lists",
      sortBy: "Random",
      complete: false,
      newF: true,
    };
  },
  methods: {
    fetchLists() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_category_lists", {
          category: this.$route.params.id,
          limit: 20,
          sortBy: this.sortBy,
        })
        .then((lists) => {
          this.lists = lists;
          this.fetching = false;
        })
        .catch((_) => {
          this.fetching = false;
        });
    },
    fetchMoreLists() {
      if (this.complete || this.lists.length == 0) {
        return;
      }
      this.fetching = true;
      this.$store
        .dispatch("fetch_category_lists", {
          category: this.$route.params.id,
          limit: 20,
          sortBy: this.sortBy,
          lastDoc: this.lists[this.lists.length - 1],
        })
        .then((lists) => {
          this.lists = this.lists.concat(lists);
          this.fetching = false;
          if (lists.length == 0) {
            this.complete = true;
          }
        })
        .catch((_) => {
          this.fetching = false;
        });
    },
    fetchDemands() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_category_demands", {
          category: this.$route.params.id,
          limit: 20,
          sortBy: this.sortBy,
        })
        .then((query) => {
          this.demands = query.docs;
          this.fetching = false;
        })
        .catch((_) => {
          this.fetching = false;
        });
    },
    fetchMoreDemands() {
      if (this.complete || this.demands.length == 0) {
        return;
      }
      this.fetching = true;
      this.$store
        .dispatch("fetch_category_demands", {
          category: this.$route.params.id,
          limit: 20,
          sortBy: this.sortBy,
          lastDoc: this.demands[this.demands.length - 1],
        })
        .then((query) => {
          this.demands = this.demands.concat(query.docs);
          this.fetching = false;
          if (query.docs.length == 0) {
            this.complete = true;
          }
        })
        .catch((_) => {
          this.fetching = false;
        });
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
      }
    },
    encryptCategory(name) {
      return name.replace(/\//g, "zzsl");
    },
    decryptCategory(name) {
      return name.replace(/%sl/g, "/");
    },
  },
  computed: {
    category() {
      let category = this.$store.getters.categories.find((category) => {
        return category.name == this.$route.params.id;
      });
      return category;
    },
    options() {
      return [
        {
          label: "Lists",
          value: "lists",
          sorts: ["Random", "Top Rated", "Popular", "Newest", "Oldest"],
        },
        {
          label: "Demands",
          value: "demands",
          sorts: [
            "Random",
            "Most Demanded",
            "Least Demanded",
            "Newest",
            "Oldest",
          ],
        },
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
    },
  },
  watch: {
    category() {
      this.complete = false;
      this.newF = true;
      this.fetching = false;
      this.lists = this.demands = [];
      if (this.sort == "lists") {
        this.fetchLists();
      } else {
        this.fetchDemands();
      }
    },
  },
  created() {
    this.fetchLists();
  },
};
</script>
<style scoped>
.cover {
  width: calc(100% + 2em);
  min-height: 60vh;
  background-size: cover;
  background-position: center center;
  display: flex;
  position: relative;
  background-repeat: no-repeat;
  margin-top: -2em;
  margin-left: -1em;
}
.tint {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  bottom: 0em;
  left: 2em;
  padding: 1em;
}
@media (min-width: 600px) {
  .cover {
    height: 70vh;
    width: 100vw;
  }
}
@media (min-width: 960px) {
  .cover {
    width: 100vw;
    margin-left: -1.5em;
  }
}
@media (min-width: 1240px) {
  .cover{
    margin-left: calc((100vw - 1200px) * -0.5);
    /* width: calc(100% + ((100vw - 1200px) * 0.5)); */
    width: 100vw;
    height:80vh;
  }
  .tint{
    left: calc((100vw - 1200px) * 0.5);
  }
}
.b-link {
  color: rgba(255, 255, 255, 0.5);
}
/* .b-link:hover {
  color: var(--accent);
} */
</style>
