<template>
  <div>
    <div style="margin:0 auto;">
      <div class="page-title">Demand List</div>
      <v-card outlined tile class="mb-2 grey lighten-3">
        <v-card-title class="title top-bar pl-2 pa-1">Just A Tip</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <ul class="mt-4 primary-text-dark">
            <li
              class="subtitle-1"
            >Make the viewers understand your request by stating a precise title.</li>
            <li class="subtitle-1">You can add a comment to clarify what you need to the viewers.</li>
            <li class="subtitle-1">Be sure to check if the list already exists.</li>
            <li class="subtitle-1">Be sure to check if the list is already on demand.</li>
          </ul>
        </v-card-text>
      </v-card>
      <v-card outlined tile class="mb-2 grey lighten-3">
        <v-card-title class="title top-bar pa-1">Type</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-checkbox
            prepend-icon="fa-user-secret"
            color="brand"
            v-model="anonymous"
            label="Post as Anonymous"
          ></v-checkbox>
        </v-card-text>
      </v-card>
      <v-card outlined tile class="grey lighten-3">
        <v-card flat tile>
          <v-card-title class="top-bar title pl-2 pa-1">3. Demand</v-card-title>
        </v-card>
        <v-divider></v-divider>
        <v-card-text class="mt-4">
          <v-container grid-list-md pa-0>
            <v-form v-model="valid">
              <v-layout wrap>
                <v-flex xs12>
                  <p class="text-capitalize font-weight-medium grey--text text--darken-2">Title</p>
                  <v-text-field
                    @blur="getKeywords()"
                    counter="100"
                    :rules="[rules.maxLength(100),rules.minLength(1, 'Title')]"
                    solo
                    flat
                    color="brand"
                    v-model="title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 mt-n2>
                  <p class="text-capitalize font-weight-medium grey--text text--darken-2">Comment</p>
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
                  <p class="text-capitalize font-weight-medium grey--text text--darken-2">Category</p>
                  <v-select item-text="name" v-model="category" :items="categories" placeholder="Optional" color="brand" solo flat></v-select>
                </v-flex>

                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >Sub-Category</p>
                  <v-select :disabled="this.category == ''" item-text="name" v-model="subCategory" :items="subCategories" placeholder="Optional" color="brand" solo flat></v-select>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :dark="valid"
            :loading="loading"
            :disabled="!valid"
            class="brand darken-1 white--text"
            @click="demand()"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-dialog persistent v-model="authDialog" max-width="500px">
      <v-card>
        <v-card-text class="pa-2">
          <v-layout justify-center>
            <v-icon class="my-8" color="info" size="60">fa-info-circle</v-icon>
          </v-layout>
          <p>Dear User, for performance reasons, you are required to Login at this point in order to receive notifications. This is to enable us serve you better. Login or Signup to continue...</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="goBack()" text color="brand">Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="setSignup(true)" outlined color="brand">Signup</v-btn>
          <v-btn @click="setLogin(true)" dark class="brand">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Rules from "../rules";
import UploadImage from "./UploadImage";
import keyword from "../../public/my-modules/generateKeywords";

export default {
  components: {
    "upload-image": UploadImage
  },
  data() {
    return {
      title: "",
      comment: "",
      keywords: [],
      anonymous: false,
      valid: false,
      rules: Rules,
      loading: false,
      authDialog: false,
      category: "",
      subCategory: ""
    };
  },
  methods: {
    demand() {
      let auth = !this.semiAuthenticated;
      this.loading = true;
      let upload = {
        title: this.title,
        anonymous: this.anonymous,
        keywords: this.keywords,
        category: this.category,
        subCategory: this.subCategory
      };
      this.comment !== ""
        ? (upload = { comment: this.comment, ...upload })
        : null;

      this.$store.dispatch("demand_list", upload).then(() => {
        this.loading = false;
        this.title = this.comment = "";
      });
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
    }
  },
  computed: {
    semiAuthenticated() {
      return this.$store.getters.semiAuthenticated;
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    categories(){
      return this.$store.getters.categories;
    },
    subCategories(){

      if(this.category == ""){
        return;
      }
      return this.categories.find(cat => cat.name == this.category).subs;
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

<style scoped>
</style>