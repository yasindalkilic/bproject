jQuery.sap.require("okul.Application.Dashboard.SystemSettings.SystemSettingsServicejs.SystemSettings");
jQuery.sap.require("okul.Application.Dashboard.SectionServicejs.SectionService");
jQuery.sap.require("okul.Servicejs.PluginsService");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
    "use strict";
    return Controller.extend("okul.Application.Dashboard.AddUser.controller.AddUser", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard/AddUser").attachPatternMatched(_this.onBeforeShow, _this);
        },
        validateEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        checkValidate: function () {
            var result = [false, ""]
            var _this = this
            if (!_this.validateEmail(oModel.oData.AddUser[0].email)) {
                result = [false, "email"];
            }
            else if (oModel.oData.AddUser[0].ufnm.trim() == "" || oModel.oData.AddUser[0].ufnm.trim().length < 3) {
                result = [false, "ufnm"];
            } else if (oModel.oData.AddUser[0].ulnm.trim() == "" || oModel.oData.AddUser[0].ulnm.trim().length < 2) {
                result = [false, "ulnm"];
            }
            else if (oModel.oData.AddUser[0].unm.trim() == "" || oModel.oData.AddUser[0].unm.trim().length < 3) {
                result = [false, "unm"];
            }
            else if (!oModel.oData.AddUser[0].utel.length || oModel.oData.AddUser[0].utel.split("_")[0].length != 11) {
                result = [false, "utel"];
            }
            else if (!oModel.oData.AddUser[0].upass.trim().length || oModel.oData.AddUser[0].upass.trim().length < 6) {
                result = [false, "upass"];
            } else if (_this.byId("tid").getSelectedKey() == "2") {
                if (!oModel.oData.AddUser[0].usno.length || oModel.oData.AddUser[0].usno.split("_")[0].length != 10) {
                    result = [false, "ogrno"];
                }
            }
            else {
                result = [true, "validate"]
            }
            return result;
        },
        onAddUser: function () {
            var _this = this
            if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "email") {
                sap.m.MessageToast.show("Email Adresi Geçersiz.");
            } else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "ufnm") {
                sap.m.MessageToast.show("Ad alanı Boş veya 3 karakterden Daha Az olamaz");
            }
            else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "ulnm") {
                sap.m.MessageToast.show("Soyad alanı Boş veya 2 karakterden Daha Az olamaz");
            }
            else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "unm") {
                sap.m.MessageToast.show("Kullanıcı Adı alanı Boş veya 3 karakterden Daha Az olamaz");
            }
            else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "utel") {
                sap.m.MessageToast.show("Telefon Numarası Alanı Geçersiz");
            } else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "upass") {
                sap.m.MessageToast.show("Şifre Alanı Boş veya 6 karakterden Daha Az Olamaz");
            } else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "ogrno") {
                sap.m.MessageToast.show("Öğrenci Numarasını 10 karakterden daha küçük olamaz");
            } else {
                _this.getAllWhereUser();
            }
        },
        getAllWhereUser: function () {
            var _this = this
            var data = {
                SN: "User",
                MN: "GAUW",
                uwhere: "unm=?",
                uparam: oModel.oData.AddUser[0].unm.toUpperCase(),
                mwhere: "mail=?",
                mparam: oModel.oData.AddUser[0].email,
                pwhere: "pnmbr=?",
                pparam: oModel.oData.AddUser[0].utel
            }
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    UserServices.UserReq(data).then(function (res) {
                        if (res == "haveUNM") {
                            sap.m.MessageToast.show("Bu Kullanıcı Adı Mevcut")
                        } else if (res == "haveM") {
                            sap.m.MessageToast.show("Bu Email Adresi  Mevcut")
                        } else if (res == "haveP") {
                            sap.m.MessageToast.show("Bu Telefon Numarası  Mevcut")
                        } else if (res == "") {
                            sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                        } else {
                            _this.SaveUserData();
                        }
                    })
                }
            })
        },
        SaveUserData: function () {
            CreateComponent.showBusyIndicator();
            var _this = this
            oModel.oData.AddUser[0].SN = "User"
            oModel.oData.AddUser[0].MN = "ADD"
            oModel.oData.AddUser[0].tid = _this.byId("tid").getSelectedKey();
            oModel.oData.AddUser[0].uauthr = _this.byId("autid").getSelectedKey();
            oModel.oData.AddUser[0].upass = md5(oModel.oData.AddUser[0].upass)
            oModel.oData.AddUser[0].sid = _this.byId("sections").getSelectedKey();
            oModel.oData.AddUser[0].quotaremain = _this.byId("tid").getSelectedKey() == "1" ? "" : oModel.oData.SysSettings[0].pjscontenjan;
            UserServices.UserReq(oModel.oData.AddUser[0]).then(function (res) {
                if (res == "SuccesAdd") {
                    sap.m.MessageToast.show("Kullanıcı Başarı İle Oluşturuldu");
                    _this.byId("usnoid").setVisible(false);
                    var data = [{
                        ufnm: "",
                        ulnm: "",
                        unm: "",
                        email: "",
                        utel: "",
                        upass: "",
                        upnt: "",
                        usno: "",
                        sid: ""
                    }]
                    oModel.setProperty("/AddUser", data)
                    CreateComponent.hideBusyIndicator();
                } else if (res == "") {
                    sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                } else {
                    sap.m.MessageToast.show("Kullanıcı Oluşturulurken Hata Meydana Geldi");
                    var data = [{
                        ufnm: "",
                        ulnm: "",
                        unm: "",
                        email: "",
                        utel: "",
                        upass: "",
                        upnt: "",
                        usno: ""
                    }]
                    oModel.setProperty("/AddUser", data)
                    CreateComponent.hideBusyIndicator();
                }
            })
        },
        onstudent: function (oEvent) {
            // var _this = this
            // debugger
            // if (_this.byId("tid").getSelectedKey() == "2") {
            //     _this.byId("usnoid").setVisible(true);
            // }
            // else {
            //     _this.byId("usnoid").setVisible(false);
            // }
        },
        onBeforeShow: function (argument) {
            UseronLogin.onLogin().then(function (res) {
                var filter = {
                    MN: "GET",
                    "SN": "Sections",
                }
                SectionService.SectionReq(filter).then(function (res) {
                    if (res != "None") {
                        oModel.setProperty("/section", res)
                    }
                })
                PluginService.PluginReq({ SN: "Authority", MN: "GETA" }).then(function (res) {
                    oModel.setProperty("/authority", res)
                })
                PluginService.PluginReq({ SN: "Title", MN: "GETT" }).then(function (res) {
                    oModel.setProperty("/title", res)
                })
                SystemService.getSystemSetting({ MN: "GETSYS", SN: "SystemSettings" }).then(function (res) {
                    if (res == "None") {
                        oModel.setProperty("/SysSettings", [])
                    } else if (res == "") {
                        sap.m.MessageToast.show("Beklenmeyen Hata Lütfen Daha Sonra Tekrar Deneyiniz")
                    } else {
                        oModel.setProperty("/SysSettings", res)
                    }
                })
                var data = [{
                    ufnm: "",
                    ulnm: "",
                    unm: "",
                    email: "",
                    utel: "",
                    upass: "",
                    upnt: "",
                    usno: ""
                }]
                oModel.setProperty("/AddUser", data)
            })
        },
    });
});