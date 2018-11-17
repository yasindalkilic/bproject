jQuery.sap.require("okul.Application.Login.LoginServicejs.LoginService");
jQuery.sap.require("okul.Servicejs.SessionService");
var UseronLogin = {
    onLogin: function () {
        var deferred = new Promise(function (resolve, reject) {
            var st = sessionStorage.getItem("UNM");
            var ls = localStorage.getItem("UNM")
            if (st && ls) {
                if (st == ls) {
                    UseronLogin.onUserControl(JSON.parse(base64._utf8_decode(localStorage.getItem("UNM")))).then(function (res) {
                        if (res == false) {
                            UseronLogin.outLogin()
                        } else {
                            UseronLogin.CheckSession().then(function (res) {
                                if (res) {
                                    UseronLogin.getUserLayout(JSON.parse(base64._utf8_decode(localStorage.getItem("UNM")))[0].tid).then(function (res) {
                                        oModel.setProperty("/userLayout", res);
                                    })
                                    resolve(res)
                                } else {
                                    UseronLogin.outLogin()
                                }
                            })
                        }
                    })
                }
            } else {
                UseronLogin.outLogin()
            }
        })
        return deferred;
    },
    getUserLayout: function (param) {
        var deferred = new Promise(function (resolve, reject) {
            UserServices.UserReq({ "tid": param, SN: "User", MN: "GETUL" }).then(function (res) {
                if (res == "None") {
                    resolve(false);
                    sap.m.MessageToast.show("Layout Bulunamadı!");
                } else {
                    resolve(res);
                }
                resolve(false)
            })
        })
        return deferred;
    },
    onUserControl: function (param) {
        var deferred = new Promise(function (resolve, reject) {
            UserServices.UserReq({ "name": param[0].unm, "MN": "GET", 'SN': 'User' }).then(function (res) {
                if (res == "None") {
                    resolve(false);
                    sap.m.MessageToast.show("Kullanıcı Adı Veya Şifre Yanlış");
                } else {
                    res.forEach(element => {
                        element.fullname = element.ufnm + " " + element.ulnm;
                    });
                    oModel.setProperty("/UserModel", res);
                    localStorage.setItem("UNM", base64._utf8_encode(JSON.stringify(res)));
                    sessionStorage.setItem("UNM", base64._utf8_encode(JSON.stringify(res)))
                    resolve(true);
                }
                resolve(false)
            })
        })
        return deferred;
    },
    CheckSession: function () {
        var deferred = new Promise(function (resolve, reject) {
            SessionService.getSession({ SN: "Session", MN: "GETS" }).then(function (res) {
                if (res) {
                    resolve(true)
                } else {
                    sap.m.MessageToast.show("Oturumunuz Düştü !");
                    resolve(false)
                }
            })
        })
        return deferred;
    },
    outLogin: function () {
        CreateComponent.hideBusyIndicator();
        localStorage.clear();
        sessionStorage.clear();
        window.open("/okul/#/Login", "_self");
    },
    onLoginControl: function (param) {
        localStorage.clear();
        sessionStorage.clear();
        var deferred = new Promise(function (resolve, reject) {
            loginService.getUserData(param).then(function (res) {
                if (res == "None") {
                    sap.m.MessageToast.show("Kullanıcı Adı Veya Şifre Yanlış");
                } else {
                    res.forEach(element => {
                        element.fullname = element.ufnm + " " + element.ulnm;
                    });
                    oModel.setProperty("/UserModel", res);
                    localStorage.setItem("UNM", base64._utf8_encode(JSON.stringify(res)));
                    sessionStorage.setItem("UNM", base64._utf8_encode(JSON.stringify(res)))
                    resolve(true);
                }
                resolve(false)
            })
        })
        return deferred;
    }
}