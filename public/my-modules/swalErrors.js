import Swal from "sweetalert2";

let functions = {
  showAuthenticationError: function() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "warning",
      html:
        '<div style="margin-left:8px" class="alert-font">You have to login to perform this action</div>'
    });
  }
};

export default functions;
