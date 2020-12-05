<template>
  <div id="main" class="mt">
    <div style="margin:0 auto;">
      <!-- <div class="page-title">Create List</div> -->
      <alert
        v-if="authenticated"
        :icon="'$vuetify.icons.user-unverified'"
        :type="'error'"
        :message="
          'You have not verified your email address. Without verification you cannot create a list. Please check your email and verify within the next 24 hours'
        "
        :action="false"
        :value="!verified"
        bigIcon
      ></alert>
      <v-card outlined>
        <div class="card-title">
          Heads Up
        </div>
        <v-card-text class="my-4 px-3">
          <ul class="ptd">
            <li class="subtitle-1">
              General lists should be relatable to the public. They should
              contain content that people know well enough to vote on
            </li>
            <li class="subtitle-1">
              List titles should be as specific and timeless as possible. (i.e.
              "Best movies of 2020" as opposed to "best movies of this year")
            </li>
            <li class="subtitle-1">
              Be sure to check if a list already exists before creating yours.
            </li>
            <li class="subtitle-1">
              Be sure to check if a list is already on demand in order to
              receive credit for creation.
            </li>
          </ul>
        </v-card-text>
      </v-card>

      <v-card outlined class="mt-10" v-if="!$route.query.demanded">
        <div class="card-title">
          List Type
        </div>
        <v-card-text class="px-3">
          <div :class="{ 'compact left': $vuetify.breakpoint.xs }">
            <v-layout column>
              <v-radio-group
                color="accent"
                class="ml-2"
                v-model="list.type"
                @change="setTypes()"
              >
                <template v-slot:prepend>
                  <v-icon
                    size=""
                    class="mr-2 mt-1"
                    :class="{
                      'green--text text--darken-1': list.type == 'general',
                      'green--text text--lighten-1': list.type == 'factual',
                    }"
                    >$vuetify.icons.people</v-icon
                  >
                </template>
                <v-radio color="accent" value="general">
                  <template v-slot:label>
                    <div class="ptd">
                      <span class="font-weight-medium ptd">General</span> - List
                      is public, votable, and can be moderated by other users
                    </div>
                  </template>
                </v-radio>
                <v-radio color="accent" value="personal">
                  <template v-slot:label>
                    <div class="ptd">
                      <span class="font-weight-medium ptd">Personal</span> -
                      List is private, and customizable by you
                      <span class="caption"
                        >(it only displays on your profile)</span
                      >
                    </div>
                  </template>
                </v-radio>
                <v-radio color="accent" value="factual">
                  <template v-slot:label>
                    <div class="ptd">
                      <span class="font-weight-medium ptd">Factual</span> - List
                      is public, non-votable, and can't be moderated by other
                      users
                      <span class="caption"
                        >(should contain objective, factual / statistical
                        info)</span
                      >
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <v-radio-group
                :disabled="list.type !== 'personal'"
                color="accent"
                v-model="list.votable"
              >
                <template v-slot:prepend>
                  <v-icon size="2.5em" :color="list.votable ? 'green' : null"
                    >mdi-swap-vertical-bold</v-icon
                  >
                </template>
                <v-radio color="accent" :value="true">
                  <template v-slot:label>
                    <div :class="list.type == 'personal' ? 'ptd' : 'htd'">
                      <span
                        class="font-weight-medium"
                        :class="list.type == 'personal' ? 'ptd' : 'htd'"
                        >Votable</span
                      >
                      - List can be voted on by everybody
                    </div>
                  </template>
                </v-radio>
                <v-radio color="accent" :value="false">
                  <template v-slot:label>
                    <div :class="list.type == 'personal' ? 'ptd' : 'htd'">
                      <span
                        class="font-weight-medium"
                        :class="list.type == 'personal' ? 'ptd' : 'htd'"
                        >Non-Votable</span
                      >
                      - List cannot be voted on by anybody
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-layout>
            <v-checkbox
              color="accent"
              :disabled="list.type !== 'personal'"
              v-model="list.selfModerated"
            >
              <template v-slot:prepend>
                <v-icon
                  size="1.8em"
                  class="mr-3 ml-1 mt-n1"
                  :color="list.selfModerated ? 'green' : null"
                  >fa-lock</v-icon
                >
              </template>
              <template v-slot:label>
                <div :class="list.type == 'personal' ? 'ptd' : 'htd'">
                  <span
                    class="font-weight-medium"
                    :class="list.type == 'personal' ? 'ptd' : 'htd'"
                    >Self Moderated</span
                  >
                  - List can only be moderated by you
                  <span class="caption"
                    >(i.e. only you can add items to the list)</span
                  >
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-card-text>
      </v-card>

      <v-card outlined class="mt-10">
        <div class="card-title">
          List Details
        </div>
        <v-card-text class="mt-5">
          <v-container grid-list-md pa-0>
            <v-form
              class="compact-form"
              ref="form"
              v-model="valid"
              @input="listSubmitted = false"
            >
              <v-layout wrap>
                <v-flex xs12>
                  <div style="position: relative">
                    <v-text-field
                      validate-on-blur
                      :readonly="$route.query.demanded ? true : false"
                      :rules="[
                        rules.maxLength(150, 'Title'),
                        rules.minLength(15, 'Title'),
                      ]"
                      counter="150"
                      small
                      color="brand"
                      class="text-capitalize"
                      outlined
                      v-model="list.title"
                      id="title"
                      label="Title*"
                      @keyup.enter="focus('description')"
                      @focus="showSearch = true"
                      @blur="showSearch = false"
                    ></v-text-field>
                    <div
                      v-show="showSearch"
                      style="position:absolute;z-index:2;box-shadow: 2px 2px 10px rgba(0,0,0,.5);top:4.5em;width:100%"
                    >
                      <search-display
                        :keyword="list.title"
                        :creation="true"
                      ></search-display>
                    </div>
                  </div>
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
                      The List of
                      <span
                        class="ptd text-capitalize font-weight-medium no-deco underline"
                        >{{ existing.title }}&nbsp;</span
                      >already exists
                    </v-flex>
                    <v-flex shrink>
                      <v-btn
                        :to="'/lists/' + existing.id"
                        color="warning darken-1"
                        outlined
                        class="ml-2"
                        >visit</v-btn
                      >
                    </v-flex>
                  </v-row>
                </v-alert>

                <v-flex xs12>
                  <!-- <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Description / Note
                  </p> -->
                  <v-textarea
                    no-resize
                    color="brand"
                    outlined
                    v-model="list.description"
                    style="width:100%"
                    counter="2500"
                    :rules="[rules.maxLength(2500, 'Description')]"
                    id="description"
                    label="Description / Note"
                  ></v-textarea>
                </v-flex>

                <v-flex xs6>
                  <!-- <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Category
                  </p> -->
                  <v-autocomplete
                    :items="categories"
                    item-text="name"
                    class="text-capitalize"
                    color="brand"
                    label="Category"
                    outlined
                    flat
                    v-model="list.category"
                  >
                    <template v-slot:no-data>
                      <v-layout class="px-2">
                        <v-icon class="mr-2 grey--text">far fa-frown</v-icon>
                        <span>Oops! This is new to us...</span>
                      </v-layout>
                    </template>
                  </v-autocomplete>
                </v-flex>

                <v-flex xs6>
                  <v-autocomplete
                    :disabled="list.category == ''"
                    :items="subCategories"
                    item-text="name"
                    class="text-capitalize"
                    color="brand"
                    label="Sub-Category"
                    outlined
                    flat
                    v-model="list.subCategory"
                  >
                    <template v-slot:no-data>
                      <v-layout class="px-2">
                        <v-icon class="mr-2 grey--text">far fa-frown</v-icon>
                        <span>Oops! This is new to us...</span>
                      </v-layout>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <!-- <v-flex xs12 mt-n5>
                  <v-textarea
                    @keyup.space="pushTag()"
                    @keyup.delete="pushTag()"
                    v-model="userTags"
                    outlined
                    :rows="1"
                    placeholder="Separate with space"
                    no-resize
                    label="Tags"
                    color="brand"
                    class
                  ></v-textarea>
                </v-flex>
                <v-flex>
                  <v-layout wrap class="mt-n9">
                    <v-chip
                      v-for="(tag, i) in tags"
                      :key="i"
                      close
                      class="mr-2 mt-2"
                      >{{ tag }}</v-chip
                    >
                  </v-layout>
                </v-flex> -->
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card outlined class="mt-10">
        <!-- <v-card flat tile style="position:sticky; top:4.5em; z-index:3"> -->
        <div class="card-title">
          List Items
        </div>
        <!-- <v-divider></v-divider> -->
        <!-- </v-card> -->
        <v-card-text class="mt-4 pt-8">
          <v-container grid-list-md pa-0>
            <AddItem
              :multi="true"
              v-for="(item, index) in list.items"
              :key="itemIndex[index]"
              :parentLength="0"
              :index="index"
              :id="'item' + (index + 1)"
              ref="item"
              @receiveItem="setItem"
              @receiveComment="setItemComment"
              @setValid="setValid"
              @oneUp="oneUp"
              @delete="deleteItem"
              :creation="true"
            ></AddItem>

            <div v-if="list.items.length <= 9" id="plus-button">
              <v-icon color="grey darken-1" @click="addItem()"
                >$vuetify.icons.plus-circle</v-icon
              >
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <m-btn
            :disabled="!valid || invalidItems > 0 || existing !== false"
            :loading="loading"
            @click="upload()"
            >Submit</m-btn
          >
        </v-card-actions>
      </v-card>
      <alert
        class="mt-4"
        :type="'success'"
        :action="'Go'"
        :value="listSubmitted"
        :message="successMessage"
        @act="goCategory()"
      ></alert>
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
import AddItem from "../components/AddItem";
import Rules from "../rules";
import { setTimeout } from "timers";
import SearchDisplay from "../components/ListAndDemandSearch";
let _ = require("lodash");
export default {
  components: {
    AddItem,
    SearchDisplay,
  },
  data() {
    return {
      list: {
        title: "",
        description: "",
        items: [
          { name: "" },
          { name: "" },
          { name: "" },
          { name: "" },
          { name: "" },
        ],
        type: "general",
        votable: true,
        selfModerated: false,
        keywords: [],
        preview_image: false,
        category: "",
        subCategory: "",
      },
      n: 0,
      userTags: "",
      tags: [],
      valid: false,
      rules: Rules,
      loading: false,
      preview_updated: false,
      authDialog: false,
      invalidItems: 5,
      itemIndex: [0, 1, 2, 3, 4],
      listSubmitted: false,
      tempCategory: "",
      existing: true,
      showSearch: false,
    };
  },

  methods: {
    async setKeywords() {
      this.list.keywords = this.generateKeywords(this.list.title);
    },

    setTypes() {
      if (this.list.type == "general") {
        this.list.votable = true;
        this.list.selfModerated = false;
      } else if (this.list.type == "factual") {
        this.list.votable = false;
        this.list.selfModerated = true;
      }
      this.setKeywords();
    },

    checkExistence: _.debounce(async function() {
      if (this.list.title == "") {
        this.existing = true;
        return;
      }
      await this.$store.dispatch("fetch_list", this.id).then((list) => {
        this.existing = list;
        if (!this.existing) {
          this.setKeywords();
        }
      });
    }, 2000),

    async upload() {
      if (!this.verified) {
        this.$store.dispatch("set_snackbar", {
          show: true,
          message: "Sorry. Your email has not been verified.",
          type: "error",
        });
        return;
      }
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      let other;
      this.$route.query.demanded
        ? (other = { demanded: true, demand_id: this.$route.query.id })
        : {};
      let $this = this;
      if (this.list.type == "personal") {
        await this.$store
          .dispatch("upload_list", {
            ...other,
            ...this.list,
            id: this.id,
            user: this.user,
          })
          .then((list_id) => {
            this.$router.push({ path: "/lists/" + list_id });
          })
          .catch((_) => {
            this.loading = false;
          });
      } else {
        await this.$store
          .dispatch("upload_pending_list", {
            ...other,
            ...this.list,
            id: this.id,
            user: this.user,
          })
          .then((uploaded) => {
            $this.listSubmitted = uploaded;
            $this.tempCategory =
              $this.list.subCategory !== ""
                ? $this.list.category + "/" + $this.list.subCategory
                : $this.list.category == ""
                ? "Miscellaneous"
                : $this.list.category;
            $this.list = {
              ...$this.list,
              ...{
                title: "",
                description: "",
                type: "general",
                votable: true,
                selfModerated: false,
                keywords: [],
                preview_image: false,
                category: "",
                subCategory: "",
              },
            };

            for (let i = 0; i < $this.list.items.length; i++) {
              $this.$refs.item[i].deleteItem();
            }

            $this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
            this.$store.dispatch("set_snackbar", {
              show: true,
              message: "sorry. An error occured",
              type: "error",
            });
          });
      }
    },
    goCategory() {
      this.$router.push({ path: "/categories/" + this.tempCategory });
    },
    scrollTo(offset, target) {
      this.$vuetify.goTo(document.getElementById(target), {
        offset: offset,
      });
    },

    addItem() {
      this.list.items.push({ name: "" });
      this.itemIndex.push(this.itemIndex.length);
      this.invalidItems++;

      setTimeout(() => {
        this.scrollTo(110, "item" + this.list.items.length);
      }, 1);
    },

    setItem(index, item) {
      this.list.items[index] = item;
    },
    setItemComment(index, comment) {
      this.list.items[index].comment = comment;
    },

    fetchCategories() {
      this.$store.dispatch("fetch_categories").then((result) => {
        this.categories = result.map((category) => category.name);
      });
    },
    pushTag() {
      if (this.userTags[this.userTags.length - 2] == " ") {
        return;
      }
      this.tags = this.userTags.split(" ");
      this.tags = this.tags.filter((tag) => tag != " " && tag != "");
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
    setValid(isValid) {
      isValid ? this.invalidItems-- : this.invalidItems++;
    },
    oneUp(index) {
      if (index == 0) {
        return;
      }
      let med;
      let medInd;
      medInd = this.itemIndex[index - 1];
      this.itemIndex[index - 1] = this.itemIndex[index];
      this.itemIndex[index] = medInd;
      med = this.list.items[index - 1];
      this.list.items[index - 1] = this.list.items[index];
      this.list.items[index] = med;
      let medL;
      medL = this.list.items;
      this.list.items = [];
      this.list.items = medL;
    },
    deleteItem(index, valid) {
      if (this.list.items.length < 6) {
        return;
      }
      this.list.items.splice(index, 1);
      if (!valid) {
        this.invalidItems--;
      }
    },
    focus(elem) {
      document.querySelector("#" + elem).focus();
    },
  },
  computed: {
    authenticated() {
      return this.$store.getters.authenticated;
    },
    categories() {
      return this.$store.getters.categories;
    },
    subCategories() {
      if (this.list.category == "") {
        return;
      }
      return this.categories.find((cat) => cat.name == this.list.category).subs;
    },
    successMessage() {
      return `Your list has been submitted. You will be notified on completion of
        review. In the mean time, you could check out other
        ${this.tempCategory} lists.`;
    },
    id() {
      let data;
      if (this.list.type == "personal") {
        data = (this.list.user.id + "-" + this.list.title.toLowerCase())
          .trim()
          .replace(/ /g, "-");
      } else {
        data = this.list.title
          .toLowerCase()
          .trim()
          .replace(/ /g, "-");
      }

      return this.encrypt(data);
    },
    user() {
      return {
        id: this.$store.getters.getUser.id,
        username: this.$store.getters.getUser.username,
      };
    },
    verified() {
      return this.$store.getters.verified;
    },
  },
  watch: {
    authenticated() {
      this.authenticated ? (this.authDialog = false) : (this.authDialog = true);
    },
    "list.title"() {
      this.checkExistence();
    },
  },
  created: function() {
    this.$store.dispatch("set_loading", false);
    if (this.$route.query.title) {
      this.list.title = this.$route.query.title;
    }

    if (this.$route.query.demanded) {
      this.setKeywords();
    }
    if (!this.authenticated) {
      this.authDialog = true;
    }
  },
};
</script>

<style scoped>
#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
  transform: scale(1.7);
}
.compact {
  transform: scale(0.875);
}
.left {
  transform-origin: left;
}
.card-title {
  font-size: 1.2em;
  font-weight: bold;
  position: absolute;
  top: -0.8em;
  left: 0px;
  background-color: white;
  padding: 0 8px;
  margin-left: 12px;
}
</style>
