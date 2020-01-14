<template>
  <div id="main" class>
    <div style="margin:0 auto;">
      <!-- <div class="page-title">Create List</div> -->
      <v-card
        flat
        style="border: 1px solid var(--brand)"
        class="grey lighten-3 mt-4"
        v-if="true"
        tile
      >
        <!-- <v-card style="position:sticky; top:4.5em; z-index:3" tile flat> -->
        <v-card-title
          class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
        >
          Heads-Up
        </v-card-title>
        <!-- <v-divider></v-divider> -->
        <!-- </v-card> -->
        <v-card-text class="mt-4">
          <ul class="ptd">
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

      <v-card flat class="mt grey lighten-3" tile v-if="!$route.query.demanded">
        <!-- <v-card tile flat style="position:sticky; top:4.5em;z-index:3"> -->
        <v-card-title
          class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
          >Type</v-card-title
        >
        <!-- <v-divider></v-divider> -->
        <!-- </v-card> -->
        <v-card-text class="mt-4">
          <div :class="{ 'compact left': $vuetify.breakpoint.xs }">
            <v-layout column>
              <v-radio-group
                prepend-icon="fa-universal-access"
                color="accent"
                class="mr-10"
                v-model="list.personal"
                @change="setTypes()"
              >
                <template v-slot:prepend>
                  <v-icon size="2.5em" :color="!list.personal ? 'green' : null"
                    >fa-universal-access</v-icon
                  >
                </template>
                <v-radio color="accent" :value="false">
                  <template v-slot:label>
                    <div class="ptd">
                      <span class="font-weight-bold ptd">General</span> - List
                      can be seen by everybody
                    </div>
                  </template>
                </v-radio>
                <v-radio color="accent" :value="true">
                  <template v-slot:label>
                    <div class="ptd">
                      <span class="font-weight-bold ptd">Personal</span> - List
                      can only be seen in your profile
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <v-radio-group
                :disabled="!list.personal"
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
                    <div :class="list.personal ? 'ptd' : 'htd'">
                      <span
                        class="font-weight-bold"
                        :class="list.personal ? 'ptd' : 'htd'"
                        >Votable</span
                      >
                      - List can be voted on by everybody
                    </div>
                  </template>
                </v-radio>
                <v-radio color="accent" :value="false">
                  <template v-slot:label>
                    <div :class="list.personal ? 'ptd' : 'htd'">
                      <span
                        class="font-weight-bold"
                        :class="list.personal ? 'ptd' : 'htd'"
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
              :disabled="!list.personal"
              v-model="list.selfModerated"
            >
              <template v-slot:prepend>
                <v-icon
                  size="2.5em"
                  class="mr-1"
                  :color="list.selfModerated ? 'green' : null"
                  >fa-lock</v-icon
                >
              </template>
              <template v-slot:label>
                <div :class="list.personal ? 'ptd' : 'htd'">
                  <span
                    class="font-weight-bold"
                    :class="list.personal ? 'ptd' : 'htd'"
                    >Self Moderated</span
                  >
                  - List can only be moderated by you
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-card-text>
      </v-card>

      <v-card flat class="mt grey lighten-3" tile>
        <!-- <v-card flat tile style="position:sticky; top:4.5em; z-index:3;"> -->
        <v-card-title
          class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
          >Details</v-card-title
        >
        <!-- <v-divider></v-divider> -->
        <!-- </v-card> -->
        <v-card-text class="mt-4">
          <v-container grid-list-md pa-0>
            <v-form class="compact-form" v-model="valid">
              <v-layout wrap>
                <v-flex xs12>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Title
                  </p>
                  <v-text-field
                    validate-on-blur
                    :readonly="$route.query.demanded ? true : false"
                    :rules="[rules.maxLength(150), rules.minLength(1, 'Title')]"
                    counter="150"
                    small
                    color="brand"
                    class="text-capitalize"
                    flat
                    solo
                    v-model="list.title"
                    @keyup="checkExistence()"
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

                <v-flex xs12 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Description
                  </p>
                  <v-textarea
                    no-resize
                    solo
                    flat
                    color="brand"
                    v-model="list.description"
                    style="width:100%"
                    counter="1000"
                    :rules="[rules.maxLength(1000)]"
                  ></v-textarea>
                </v-flex>

                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Category
                  </p>
                  <v-autocomplete
                    :items="categories"
                    item-text="name"
                    class="text-capitalize"
                    placeholder="Optional"
                    color="brand"
                    solo
                    flat
                    v-model="list.category"
                  ></v-autocomplete>
                </v-flex>

                <v-flex xs6 mt-n2>
                  <p
                    class="text-capitalize font-weight-medium grey--text text--darken-2"
                  >
                    Sub-Category
                  </p>
                  <v-autocomplete
                    :disabled="list.category == ''"
                    :items="subCategories"
                    item-text="name"
                    placeholder="Optional"
                    class="text-capitalize"
                    color="brand"
                    solo
                    flat
                    v-model="list.subCategory"
                  ></v-autocomplete>
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
                </v-flex>-->
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
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card flat class="mt grey lighten-3" tile>
        <!-- <v-card flat tile style="position:sticky; top:4.5em; z-index:3"> -->
        <v-card-title
          class="grey lighten-2 pa-1 pl-4 title-text font-weight-medium"
          >Add Items</v-card-title
        >
        <!-- <v-divider></v-divider> -->
        <!-- </v-card> -->
        <v-card-text class="mt-4">
          <v-container grid-list-md pa-0>
            <AddItem
              class="item"
              :multi="true"
              v-for="(item, index) in list.items"
              :key="itemIndex[index]"
              :propItem="item"
              :parentLength="0"
              :index="index"
              :id="'item' + (index + 1)"
              @receiveItem="setItem"
              @receiveComment="setItemComment"
              @setValid="setValid"
              @oneUp="oneUp"
              :rImage="list.items[index].image"
            ></AddItem>

            <div v-if="list.items.length <= 9" id="plus-button">
              <v-icon color="grey" size="3em" @click="addItem()"
                >mdi-plus-circle</v-icon
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
import AddItem from "./AddItem";
import Rules from "../rules";
import { setTimeout } from "timers";
export default {
  components: {
    AddItem
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
          { name: "" }
        ],
        personal: false,
        votable: true,
        selfModerated: false,
        keywords: [],
        preview_image: false,
        category: "",
        subCategory: "",
        user: {
          id: this.$store.getters.getUser.id,
          username: this.$store.getters.getUser.username
        }
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
      timer: null
    };
  },

  methods: {
    async setKeywords() {
      if (this.list.title == "") {
        return;
      }
      this.list.keywords = this.generateKeywords(this.list.title);
    },

    setTypes() {
      if (!this.list.personal) {
        this.list.votable = true;
        this.list.selfModerated = false;
      }
      this.setKeywords();
    },

    async checkExistence() {
      if (this.list.title == "") {
        this.existing = true;
        return;
      }
      console.log("checking");
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.$store.dispatch("fetch_list", this.id).then(list => {
          this.existing = list;
          if (!this.existing) {
            this.list.keywords = this.setKeywords(this.list.title);
          }
        });
      }, 2500);
    },

    async upload() {
      this.loading = true;
      setTimeout(async () => {
        let other;
        this.$route.query.demanded
          ? (other = { demanded: true, demand_id: this.$route.query.id })
          : null;
        if (this.list.personal) {
          await this.$store
            .dispatch("upload_list", { ...other, ...this.list, id: this.id })
            .then(list_id => {
              this.$router.push({ path: "/lists/" + list_id });
            });
        } else {
          await this.$store
            .dispatch("upload_pending_list", {
              ...other,
              ...this.list,
              id: this.id
            })
            .then(uploaded => {
              this.listSubmitted = uploaded;
              this.tempCategory =
                this.list.subCategory !== ""
                  ? this.list.category + "/" + this.list.subCategory
                  : this.list.category == ""
                  ? "miscellaneous"
                  : this.list.category;
              this.list = {
                title: "",
                description: "",
                items: [
                  { name: "" },
                  { name: "" },
                  { name: "" },
                  { name: "" },
                  { name: "" }
                ],
                personal: false,
                votable: true,
                selfModerated: false,
                keywords: [],
                preview_image: false,
                category: "",
                subCategory: ""
              };

              this.loading = false;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        }
      }, 500);
    },
    goCategory() {
      this.$router.push({ path: "/categories/" + this.tempCategory });
    },
    scrollTo(offset, target) {
      this.$vuetify.goTo(document.getElementById(target), {
        offset: offset
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
      if (!this.list.preview_image && item.image) {
        this.preview_image == item.image;
      }
    },
    setItemComment(index, comment) {
      this.list.items[index].comment = comment;
    },

    fetchCategories() {
      this.$store.dispatch("fetch_categories").then(result => {
        this.categories = result.map(category => category.name);
      });
    },
    pushTag() {
      if (this.userTags[this.userTags.length - 2] == " ") {
        return;
      }
      this.tags = this.userTags.split(" ");
      this.tags = this.tags.filter(tag => tag != " " && tag != "");
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

      // setTimeout(() => {
      //   this.scrollTo(110, 'item' + (index));
      // }, 1);
    }
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
      return this.categories.find(cat => cat.name == this.list.category).subs;
    },
    successMessage() {
      return `Your list has been submitted. You will be notified on completion of
        review. In the mean time, you could check out other
        ${this.tempCategory} lists.`;
    },
    id() {
      if (this.list.personal) {
        return (this.list.user.id + "-" + this.list.title.toLowerCase())
          .trim()
          .replace(/ /g, "-");
      } else {
        return this.list.title
          .toLowerCase()
          .trim()
          .replace(/ /g, "-");
      }
    }
  },
  watch: {
    authenticated() {
      this.authenticated ? (this.authDialog = false) : (this.authDialog = true);
    }
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
  }
};
</script>

<style scoped>
.item {
  position: relative;
}

.item + .item {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}

ol {
  counter-reset: my-awesome-counter;
  list-style: none;
}

ol > li {
  margin: 0 0 0.5em 0;
  counter-increment: my-awesome-counter;
  position: relative;
}

ol > li::before {
  content: counter(my-awesome-counter);
  color: black;
  opacity: 0.65;
  font-size: 1.2em;
  position: absolute;
  --size: 1.5em;
  left: calc(-1.25 * var(--size));
  line-height: var(--size);
  width: var(--size);
  height: var(--size);
  top: 0.1em;
  /* background: black; */
  border-radius: 50%;
  text-align: center;
  /* box-shadow: 1px 1px 0 #999; */
}

.radio {
  appearance: none;
  display: inline-block;
  position: relative;
}
.compact {
  transform: scale(0.875);
}
.left {
  transform-origin: left;
}
</style>
