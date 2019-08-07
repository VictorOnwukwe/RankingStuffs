import Swal from "sweetalert2";
import router from "./routers/router-main";

let functions = {
  showAuthenticationError: function() {
    // if (isLoggedIn) {
    //   return;
    // }
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true
    });

    Toast.fire({
      html:
        "<div>" +
        "<p>You have to login to perform this action</p>" +
        '<a id="login" style="margin:0.5em 0.5em; cursor:pointer" class="links">Login</a>' +
        '<a id="signup" style="margin:0.5em 0.5em; cursor:pointer" class="links">Signup</a>' +
        "</div>",
      onBeforeOpen: () => {
        const content = Swal.getContent();
        const $ = content.querySelector.bind(content);

        const login = $("#login");
        const signup = $("#signup");

        login.addEventListener("click", function() {
          router.push({ path: "/login" });
        });

        signup.addEventListener("click", function() {
          router.push({ path: "/signup" });
        });
      }
    });
  }
};

export default functions;
