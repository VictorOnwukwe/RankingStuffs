import vuex from "vuex";
import Vue from "vue";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority, userInfo } from "os";
import { async } from "q";
import swalErrors from "../public/my-modules/swalErrors";
import { stat } from "fs";
import { METHODS } from "http";
import createPersistedState from "vuex-persistedstate";
import { isNull } from "util";

let moment = require("moment");

Vue.use(vuex);
