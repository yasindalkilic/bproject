sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/MessageToast', 'sap/m/Button', 'sap/m/Text', 'sap/m/GroupHeaderListItem', 'sap/viz/ui5/core/BaseChart'], function (Controller, JSONModel, Dialog, MessageToast, Button, Text, GroupHeaderListItem, BaseChart) {
    "use strict";
    var lid = ""
    var i = 20;
    var timeControl = ""
    var myControl = Controller.extend("okul.Application.RegisterCheck.controller.RegisterCheck", {
        onInit: function () {
            var _this = this;
            _this.getView().setModel(oModel);
            if (oModel.oData.userRegister == undefined) {
                UserServices.UserReq({ SN: "Register", MN: "DELALL" }).then(function (res) {
                })
                UseronLogin.outLogin();
            } else {
                lid = _this.byId("lid");
                timeControl = setInterval(_this.timerfunction, 1000)
            }
        },
        timerfunction: function () {
            var _this = this
            lid.setText(i--)
            if (lid.getText() == "0") {
                clearInterval(timeControl);
                if (oModel.oData.userRegister != undefined) {
                    if (oModel.oData.userRegister[0].rtrcode) {
                        UserServices.UserReq({ SN: "Register", MN: "DEL", key: oModel.oData.userRegister[0].rtrcode }).then(function (res) {
                        })
                    }
                } else {
                    UserServices.UserReq({ SN: "Register", MN: "DELALL" }).then(function (res) {
                    })
                }
                delete oModel.oData.userRegister
                lid.setText("")
                UseronLogin.outLogin();
            }
        },
        onPress: function () {
            CreateComponent.showBusyIndicator();
            var _this = this
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            if (oModel.oData.userRegister[0].rtrcode == _this.byId("codeInput").getValue()) {
                oModel.oData.userRegister[0].rttcno = md5(oModel.oData.userRegister[0].rttcno);
                var userData = {
                    SN: "User",
                    ufnm: oModel.oData.userRegister[0].rtnm,
                    ulnm: oModel.oData.userRegister[0].rtlnm,
                    utel: oModel.oData.userRegister[0].phone,
                    email: oModel.oData.userRegister[0].rtemail,
                    upnt: "",
                    tid: "2",
                    uauthr: "3",
                    usno: "",
                    sid: parseInt(oModel.oData.userRegister[0].sid),
                    unm: oModel.oData.userRegister[0].rtsno,
                    upass: oModel.oData.userRegister[0].rttcno,
                    MN: "ADD"
                }
                var filter = {
                    MN: "Del",
                    activationkey: oModel.oData.userRegister[0].rtrcode
                }
                UserServices.UserReq(userData).then(function (res) {
                    if (res == "None") {
                        sap.m.MessageToast.show("Kayıt eklenirken hata oluştu");
                        CreateComponent.hideBusyIndicator();
                    } else if (res == "") {
                        CreateComponent.hideBusyIndicator();
                        sap.m.MessageToast.show("Sunucuda Bir Hata Meydana Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin ")
                    } else {
                        UserServices.delRegister(filter).then(function (res) {
                            if (res[0].status == "SuccesDel") {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("Kayıt Başarıyla Gerçekleşti");
                                oRouter.navTo("Login");
                            } else if (res[0].status == "None") {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("Kayıt Gerçekleştirme Başarısız");
                                oRouter.navTo("Login");
                            } else {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("Sunucuda Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                            }
                        })
                    }
                })

            } else {
                sap.m.MessageToast.show("Kod Geçersiz !")
                CreateComponent.hideBusyIndicator();
            }
        },
    });
    return myControl;
});