<template>
  <div>
    <div style="margin:0 auto;">
      <div class="page-title">Demand List</div>
      <v-card flat class="grey lighten-3" tile>
        <v-card-title
          class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
        >
          Just A Tip</v-card-title
        >
        <v-card-text>
          <ul class="mt-4 ptd">
            <li class="subtitle-1 ptd">
              Make the viewers understand your request by stating a precise
              title.
            </li>
            <li class="subtitle-1 ptd">
              You can add a comment to clarify what you need to the viewers.
            </li>
            <li class="subtitle-1 ptd">
              Be sure to check if the list already exists.
            </li>
            <li class="subtitle-1 ptd">
              Be sure to check if the list is already on demand.
            </li>
          </ul>
        </v-card-text>
      </v-card>
      <v-card flat class="mt grey lighten-3" tile>
        <v-card flat tile>
          <v-card-title
            class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
            >Details</v-card-title
          >
        </v-card>
        <v-card-text class="mt-4">
          <v-container grid-list-md pa-0>
            <v-form v-model="valid">
              <v-layout wrap>
                <v-flex xs12>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Title
                  </p>
                  <v-text-field
                    @keyup="checkExistence()"
                    counter="150"
                    :rules="[rules.maxLength(150), rules.minLength(1, 'Title')]"
                    solo
                    flat
                    color="brand"
                    v-model="title"
                  ></v-text-field>
                </v-flex>

                <v-alert
                  v-if="existing.title"
                  :type="'warning'"
                  text
                  class="ml-1 mt-2 mb-6 ptd"
                  border="left"
                  :icon="false"
                  width="100%"
                >
                  <v-row class="mx-1" align-center>
                    <v-flex>
                      The {{ existType }}
                      {{ existType == "list" ? " of " : " for " }}
                      <span
                        class="ptd text-capitalize font-weight-medium no-deco underline"
                        >{{ existing.title }}&nbsp;</span
                      >already exists
                    </v-flex>
                    <v-flex shrink>
                      <v-btn
                        :to="'/' + existType + 's/' + existing.id"
                        color="warning darken-1"
                        outlined
                        class="ml-2"
                        >visit</v-btn
                      >
                    </v-flex>
                  </v-row>
                </v-alert>
                <v-flex xs12 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Comment
                  </p>
                  <v-textarea
                    color="brand"
                    solo
                    flat
                    placeholder="[Optional] Tell us why this list is important to you..."
                    v-model="comment"
                    class
                    no-resize
                  ></v-textarea>
                </v-flex>
                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Category
                  </p>
                  <v-select
                    item-text="name"
                    v-model="category"
                    :items="categories"
                    placeholder="Optional"
                    color="brand"
                    solo
                    flat
                  ></v-select>
                </v-flex>

                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Sub-Category
                  </p>
                  <v-select
                    :disabled="this.category == ''"
                    item-text="name"
                    v-model="subCategory"
                    :items="subCategories"
                    placeholder="Optional"
                    color="brand"
                    solo
                    flat
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <m-btn
            :loading="loading"
            :disabled="!valid || (existing !== false && existing !== undefined)"
            @click="demand()"
            >Submit</m-btn
          >
        </v-card-actions>
        <alert
          class="mt-4"
          :type="'success'"
          :value="submitted"
          :message="successMessage"
          @act="goCategory()"
        ></alert>
      </v-card>
    </div>
    <v-dialog persistent v-model="authDialog" max-width="500px">
      <v-card>
        <v-card-text class="py-0">
          <v-layout justify-center>
            <v-icon class="my-8" color="info" size="60">fa-info-circle</v-icon>
          </v-layout>
          <p>
            Dear User, for performance reasons, you are required to Login at
            this point in order to receive notifications. This is to enable us
            serve you better. Login or Signup to continue...
          </p>
        </v-card-text>
        <v-card-actions>
          <m-btn @click="goBack()" text>Back</m-btn>
          <v-spacer></v-spacer>
          <m-btn @click="setSignup(true)" text>Signup</m-btn>
          <m-btn @click="setLogin(true)" outlined>Login</m-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Rules from "../rules";
import keyword from "../../public/my-modules/generateKeywords";

export default {
  components: {},
  data() {
    return {
      title: "",
      comment: "",
      keywords: [],
      valid: false,
      rules: Rules,
      loading: false,
      authDialog: false,
      category: "",
      subCategory: "",
      existing: true,
      existType: "",
      timer: null,
      submitted: false,
      tempCategory: "",
      user: {
        id: this.$store.getters.getUser.id,
        username: this.$store.getters.getUser.username
      }
    };
  },
  methods: {
    async demand() {
      this.loading = true;
      let upload = {
        title: this.title.toLowerCase(),
        keywords: this.keywords,
        category: this.category,
        subCategory: this.subCategory,
        comment: this.comment,
        id: this.id,
        user: this.user
      };

      this.$store.dispatch("upload_pending_demand", upload).then(() => {
        this.loading = false;
        this.submitted = true;
        this.tempCategory =
          upload.subCategory !== ""
            ? upload.category + "/" + upload.subCategory
            : upload.category == ""
            ? "miscellaneous"
            : "/" + upload.category;
      });
    },
    async checkExistence() {
      if (this.title == "") {
        console.log("here");
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.$store
          .dispatch("fetch_list", this.id)
          .then(list => {
            if (list) {
              this.existType = "list";
              this.existing = list;
              return true;
            }
            return false;
          })
          .then(async exists => {
            if (!exists) {
              await this.$store
                .dispatch("fetch_demand", this.id)
                .then(demand => {
                  this.existing = demand;
                  if (demand) {
                    this.existType = "demand";
                  } else {
                    this.getKeywords();
                  }
                });
            }
          });
      }, 2500);
    },
    getKeywords() {
      this.keywords = keyword.generateKeywords(this.title);
    },
    setLogin(val) {
      this.$store.dispatch("set_login", val);
    },
    setSignup(val) {
      this.$store.dispatch("set_signup", val);
    },
    goBack() {
      this.$router.go(-1);
    },
    goCategory() {
      this.$router.push({ path: "/categories/" + this.tempCategory });
    }
  },
  computed: {
    semiAuthenticated() {
      return this.$store.getters.semiAuthenticated;
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    categories() {
      return this.$store.getters.categories;
    },
    subCategories() {
      if (this.category == "") {
        return;
      }
      return this.categories.find(cat => cat.name == this.category).subs;
    },
    id() {
      return this.title
        .toLowerCase()
        .trim()
        .replace(/ /g, "-");
    },
    successMessage() {
      return `Your list has been submitted. You will be notified on completion of
        review. In the mean time, you could check out other
        ${this.tempCategory} lists.`;
    }
  },
  watch: {
    authenticated() {
      this.authenticated ? (this.authDialog = false) : (this.authDialog = true);
    }
  },
  async created() {
    this.setLogin(false);
    this.setSignup(false);
    this.$store.dispatch("set_loading", false);
    if (this.$route.query.searched) {
      this.title = this.$route.query.title;
    }
    if (!this.authenticated) {
      this.authDialog = true;
    }
  }
};
</script>

<style scoped></style>
