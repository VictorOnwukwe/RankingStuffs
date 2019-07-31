import Swal from "sweetalert2";


let functions = {
  showAuthenticationError: function() {
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

        login.addEventListener("click", function(){
          this.$router.push({ path: "/login" });
        });

        signup.addEventListener("click", function(){
          this.$router.push({ path: "/signup" });
        });
      }
    });
  }
};

export default functions;
