jQuery.sap.require("okul.Application.Dashboard.SystemSettings.SystemSettingsServicejs.SystemSettings");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("okul.Application.Dashboard.SystemSettings.controller.SystemSettings", {
        onInit: function () {
            var _this = this
            oModel.setProperty("/enb", false);
            _this.passvalidate = ""
            var e = this;
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/SystemSettings").attachPatternMatched(e.onBeforeShow, e)
        },
        onShowPass: function (oEvent) {
            var _this = this;
            if (_this.byId("passid").getType() == "Text") {
                _this.byId("showid").setIcon("sap-icon://show");
                _this.byId("passid").setType("Password");
            } else {
                _this.openDialog();
                _this.byId("showid").setIcon("sap-icon://hide");
                _this.byId("passid").setType("Text");
            }
        },
        checkvalidateSys: function () {
            var _this = this
            var result = false
            if (!_this.validateEmail(oModel.oData.SysSettings[0].emailaddres)) {
                sap.m.MessageToast.show("Email Adresi Geçersiz");
            } else if (oModel.oData.SysSettings[0].emailpass.trim() == "") {
                sap.m.MessageToast.show("Şifre Alanı Zorunludur");
            }
            else if (isNaN(oModel.oData.SysSettings[0].pjscontenjan)) {
                sap.m.MessageToast.show("Kontenjan Alanı Sayı Girilmek Zorundadır");
            } else {
                result = true;
            }
            return result

        },
        validateEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        openDialog: function () {
            var _this = this
            if (_this.passvalidate) {
                _this.passvalidate.open(_this);
                return
            }
            _this.passvalidate = new sap.m.Dialog(
                {
                    contentWidth: "20%",
                    contentHeight: "20%",
                    stretchOnPhone: true,
                    showCloseButton: true
                }).addStyleClass(
                    "dialogHasFooter sapUiNoMargin sapUiNoContentPadding sapUiSizeCompact"
                )
            var bar = new sap.m.Bar({});
            bar.addContentMiddle(new sap.m.HBox({
                alignItems: sap.m.FlexAlignItems.Center,
                justifyContent: sap.m.FlexJustifyContent.Stretch,
                items: [
                    new sap.m.Text(
                        {
                            text: "Lütfen Şifrenizi Doğrulayın",
                            width: "150px"
                        }).addStyleClass("sapUiSmallMarginBegin")
                ]
            }).addStyleClass("sapUiNoMargin"))
            bar.addContentRight(
                new sap.m.Button({
                    icon: "sap-icon://sys-cancel",
                    text: "Kapat",
                    type: "Transparent",
                    press: function () {
                        _this.passvalidate.close();
                    }
                }).addStyleClass("sapUiNoMargin"))
            var lesarea = new sap.m.VBox({
                width: "100%",
                height: "100%",
                alignItems: sap.m.FlexAlignItems.Stretch,
                justifyContent: sap.m.FlexJustifyContent.Start,
                items: [
                    new sap.m.VBox({
                        width: "100%",
                        alignItems: sap.m.FlexAlignItems.Stretch,
                        justifyContent: sap.m.FlexJustifyContent.Start,
                        items: [
                            new sap.m.Input("unm", {
                                value: "{/UserModel/0/fullname}",
                                enabled: false

                            }),
                            new sap.m.Input("passw", {
                                value: "",
                                type: "Password",
                                placeholder: "Şifrenizi Giriniz"
                            }),
                        ]
                    }),
                    new sap.m.HBox({
                        width: "100%",
                        alignItems: sap.m.FlexAlignItems.Center,
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        items: [
                            new sap.m.Button({
                                text: "Onayla",
                                width: "90px",
                                type: "Unstyled",
                                press: function () {
                                    Servertime.getY().then(function (res) {
                                        if (res != new Date().toLocaleDateString().split(".")[2]) {
                                            sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                                        }
                                        else {
                                            if (sap.ui.getCore().byId("passw").getValue().trim() == "") {
                                                sap.m.MessageToast.show("Şifre Girilmek Zorundadır")
                                            } else {
                                                CreateComponent.showBusyIndicator();
                                                var data = {
                                                    pass: md5(sap.ui.getCore().byId("passw").getValue()),
                                                    MN: "GETPU",
                                                    SN: "User"
                                                }
                                                UseronLogin.onPass(data).then(function (res) {
                                                    if (res == true) {
                                                        sap.ui.getCore().byId("passw").setValue()
                                                        CreateComponent.hideBusyIndicator();
                                                        _this.passvalidate.close();
                                                    }
                                                    else {
                                                        sap.ui.getCore().byId("passw").setValue()
                                                        _this.byId("showid").setIcon("sap-icon://show");
                                                        _this.byId("passid").setType("Password");
                                                        CreateComponent.hideBusyIndicator();
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }).addStyleClass("sapUiSmallMarginBegin"),
                            new sap.m.Button({
                                text: "Vazgeç",
                                width: "90px",
                                type: "Unstyled",
                                press: function () {
                                    _this.passvalidate.close();
                                }
                            }).addStyleClass("sapUiSmallMarginEnd")
                        ]
                    })
                ]
            })
            _this.passvalidate.addContent(lesarea);
            _this.passvalidate.setCustomHeader(bar);
            _this.passvalidate.open();
        },
        setSysSetting: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    if (_this.checkvalidateSys() == false) {
                    } else {
                        CreateComponent.showBusyIndicator();
                        SystemService.getSystemSetting({
                            MN: "SETSYS", SN: "SystemSettings", "wset":
                                "pjscontenjan=?,emailaddres=?,emailpass=?",
                            param: [
                                oModel.oData.SysSettings[0].pjscontenjan,
                                oModel.oData.SysSettings[0].emailaddres,
                                oModel.oData.SysSettings[0].emailpass,
                                oModel.oData.SysSettings[0].ssid
                            ]
                        }).then(function (res) {
                            if (res == "None") {
                                oModel.setProperty("/SysSettings", [])
                            } else if (res == "") {
                                sap.m.MessageToast.show("Beklenmeyen Hata Lütfen Daha Sonra Tekrar Deneyiniz")
                            } else {
                                sap.m.MessageToast.show("Sistem Ayarları Güncellendi");
                                oModel.setProperty("/enb", false)
                                CreateComponent.hideBusyIndicator();
                                _this.getSystemSettings();
                            }
                        })
                    }
                }
            })
        },
        setEnb: function () {
            if (oModel.oData.enb == true) {
                oModel.setProperty("/enb", false);
            } else {
                oModel.setProperty("/enb", true);
            }
        },
        getSystemSettings: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    SystemService.getSystemSetting({ MN: "GETSYS", SN: "SystemSettings" }).then(function (res) {
                        if (res == "None") {
                            oModel.setProperty("/SysSettings", [])
                        } else if (res == "") {
                            sap.m.MessageToast.show("Beklenmeyen Hata Lütfen Daha Sonra Tekrar Deneyiniz")
                        } else {
                            oModel.setProperty("/SysSettings", res)
                        }
                    })
                }
            })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.getSystemSettings();
                Servertime.getY().then(function (e) {
                    e != (new Date).toLocaleDateString().split(".")[2] && sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                })
            })
        }
    })
});