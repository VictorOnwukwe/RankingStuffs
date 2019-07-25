<template>
  <div>
    <v-layout>
      <v-flex xs12 mt-3>
        <v-card class="pa-0">
          

          <v-card-title primary-title>
            <v-layout>
                <v-flex xs-2>
                    <v-img :src="item.image" class="mb-2 mr-2" max-width="200px" contain></v-img>
                </v-flex>
                <v-flex xs-10>
                <div>
                <h2 class="headline mb-0">{{item.title}}</h2>
                <div>{{ item.about }}</div>
                </div>
                </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-actions>
              <div id="bottom-nav">
                <v-icon @click="addVote()" color="primary">mdi-thumb-up</v-icon>
              </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <div id="comments">
        <p>This is the first comment</p>
        <p>This is the second comment</p>
        <p>This is the third comment</p>
        <div id="comment_container">
        <v-textarea id="comment_box" v-model="user_comment"></v-textarea>
        <v-btn @click="addComment()">Add comment</v-btn>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    list_id: String
  },
  data() {
    return {
        user_comment: ''
    };
  },

  methods: {
      addComment(){
          this.$store.dispatch('add_comment', {item_id: this.item.id, list_id: this.list_id, comment: this.user_comment});
      },

      addVote(){
        this.$store.dispatch('add_vote', {item_id: this.item.id, list_id: this.list_id});
      }
  }
};
</script>

<style>
#comments{
    background-color: white;
    padding: 1em 1em;
}

#comment_container{
    
}

#comment_box{
    width: 100%;
    background-color: var(--primary);
}

#bottom-nav{
  width: 100%;
  background-color: brown;
  height: 3em;
  display: flex;
  justify-content: center;
}
</style>
