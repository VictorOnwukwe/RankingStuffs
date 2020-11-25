<template>
  <div>
    <div style="margin:0 auto;">
      <!-- <div class="page-title">Demand List</div> -->
      <v-card outlined class="mt">
        <v-card-title
          class="grey lighten-4 pa-1 pl-4 title-text font-weight-medium"
        >
          Heads-Up</v-card-title
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
      <v-card outlined class="mt">
        <v-card flat tile>
          <v-card-title
            class="grey lighten-4 pa-1 pl-4 title-text font-weight-medium"
            >Add Demand Details</v-card-title
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
                    @keyup.enter="focus('comment')"
                    counter="150"
                    :rules="[
                      rules.maxLength(150),
                      rules.minLength(15, 'Title'),
                    ]"
                    solo
                    flat
                    color="brand"
                    background-color="grey lighten-3"
                    v-model="title"
                    id="title"
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
                    background-color="grey lighten-3"
                    solo
                    flat
                    placeholder="[Optional] Tell us why this list is important to you..."
                    v-model="comment"
                    counter="2500"
                    :rules="[rules.maxLength(2500, 'Comment')]"
                    no-resize
                    id="comment"
                  ></v-textarea>
                </v-flex>
                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Category
                  </p>
                  <v-autocomplete
                    item-text="name"
                    v-model="category"
                    :items="categories"
                    placeholder="Optional"
                    color="brand"
                    background-color="grey lighten-3"
                    solo
                    flat
                    id="category"
                  ></v-autocomplete>
                </v-flex>

                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Sub-Category
                  </p>
                  <v-autocomplete
                    :disabled="this.category == ''"
                    item-text="name"
                    v-model="subCategory"
                    :items="subCategories"
                    placeholder="Optional"
                    color="brand"
                    background-color="grey lighten-3"
                    solo
                    flat
                    id="subcategory"
                  ></v-autocomplete>
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
        <v-card-text v-if="submitted">
          <alert
            class="mt-4"
            :type="'success'"
            :value="submitted"
            :message="successMessage"
            @act="goCategory()"
          ></alert>
        </v-card-text>
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

let _ = require("lodash");

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
        user: this.user,
      };

      this.$store
        .dispatch("upload_pending_demand", upload)
        .then(() => {
          this.loading = false;
          this.submitted = true;
          this.tempCategory =
            upload.subCategory !== ""
              ? upload.category + "/" + upload.subCategory
              : upload.category == ""
              ? "Miscellaneous"
              : upload.category;
        })
        .catch((_) => {
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          this.loading = false;
        });
    },
    checkExistence: _.debounce(async function() {
      if (this.title == "") {
        return;
      }
      await this.$store
        .dispatch("fetch_list", this.id)
        .then((list) => {
          if (list) {
            this.existType = "list";
            this.existing = list;
            return true;
          }
          return false;
        })
        .then(async (exists) => {
          if (!exists) {
            await this.$store
              .dispatch("fetch_demand", this.id)
              .then((demand) => {
                this.existing = demand;
                if (demand) {
                  this.existType = "demand";
                } else {
                  this.getKeywords();
                }
              });
          }
        });
    }, 2500),
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
    },
    focus(elem) {
      document.querySelector("#" + elem).focus();
    },
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
      return this.categories.find((cat) => cat.name == this.category).subs;
    },
    id() {
      return this.encrypt(
        this.title
          .toLowerCase()
          .trim()
          .replace(/ /g, "-")
      );
    },
    successMessage() {
      return `Your demand has been submitted. You will be notified on completion of
        review. In the mean time, you could check out other
        ${this.tempCategory} lists.`;
    },
    user() {
      return {
        id: this.$store.getters.getUser.id,
        username: this.$store.getters.getUser.username,
      };
    },
  },
  watch: {
    authenticated() {
      this.authenticated ? (this.authDialog = false) : (this.authDialog = true);
    },
    title() {
      this.checkExistence();
    },
  },
  created() {
    this.$store.dispatch("set_loading", false);
    if (!this.authenticated) {
      this.authDialog = true;
    } else if (this.$route.query.searched) {
      this.title = this.$route.query.title;
    }
  },
};
</script>
