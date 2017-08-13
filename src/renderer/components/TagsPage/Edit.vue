<template>
    <div>
        <jawn v-if="loading"></jawn>
        <div v-show="!loading">
            <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedTag}} successfully</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="tags">
                <!--have class for selected tag; also, have action that commits selected tag -->
                <span class="tag" 
                    v-for="(tag, index) in tags" 
                    :key="tag.id"
                    v-on:click="selectTag(index)"
                    v-bind:class="tagClass(index)"
                    >{{tag.name}}</span>
            </div>
            <div class="field" v-if="selectedTag">
                <label class="label">Name</label>
                <div class="control">
                    <input v-model="selectedTag.name" class="input" type="text" placeholder="Edit Tag Name">
                </div>
                <div class="tags has-addons">
                    <span class="tag">ID</span>
                    <span class="tag is-dark">{{ selectedTag.id }}</span>
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button v-on:click="save()" class="button is-info">Save Changes</button>
                </div>
                <div class="control">
                    <button v-on:click="del()" class="button is-danger">Delete Tag</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Jawn from 'vue-loading-spinner/src/components/Jawn';

export default {
    components: {
        Jawn
    },
    data: function() {
        return {
            editSuccess: false,
            isError: false,
            selectedTags: Array(this.$store.state.Tags.tags.length).fill(false),
            selectedTag: null
        }
    },
    methods: {
        selectTag(index) {
            this.selectedTags.fill(false);
            this.selectedTags.splice(index, 1, true);
            this.selectedTag = Object.assign({}, this.tags[index]);
        },
        tagClass(index) {
            return this.selectedTags[index] ?
                {'is-primary': true, 'is-medium': true} :
                {};
        },
        save() {
            this.$store.dispatch('editTag', this.selectedTag)
                .then((editedTag) => {
                    this.editSuccess = true;
                    this.isError = false;
                    this.editAction = 'edited';
                    this.editedTag = editedTag;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.isError = true;
                })
                .then(() => {
                    this.selectedTag = null;
                    this.selectedTags = Array(this.$store.state.Tags.tags.length).fill(false);
                });
        },
        del() {
            this.$store.dispatch('deleteTag', this.selectedTag.id)
                .then((deletedTag) => {
                    this.editSuccess = true;
                    this.isError = false;
                    this.editAction = 'deleted';
                    this.editedTag = deletedTag;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.isError = true;
                })
                .then(() => {
                    this.selectedTag = null;
                    this.selectedTags = Array(this.$store.state.Tags.tags.length).fill(false);
                });
        }
    },
    computed: {
        tags() {
            return this.$store.state.Tags.tags;
        },
        loading() {
            return this.$store.state.Loading.loading;
        }
    }
}
</script>

<style scoped>

</style>
