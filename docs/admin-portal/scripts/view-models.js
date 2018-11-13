var vm = {};
(function() {
    vm.loginVM = function() {
        sessionStorage.setItem("authenticate", false);
        $("#btnLogin").click(function() {
            if (($("#txtUsername").val() === "admin" && $("#txtPassword").val() === "password")) {
                sessionStorage.setItem("authenticate", true);
                $.router.go("admin.dashboard");
            }
        });
    };
}());