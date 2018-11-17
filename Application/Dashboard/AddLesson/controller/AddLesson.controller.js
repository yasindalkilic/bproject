jQuery.sap.require("okul.Application.Dashboard.LessonServicejs.LessonService");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
    "use strict";
    return Controller.extend("okul.Application.Dashboard.AddLesson.controller.AddLesson", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard/AddLesson").attachPatternMatched(_this.onBeforeShow, _this);
        },
        onBeforeShow: function (argument) {
            UseronLogin.onLogin().then(function (res) {
                oModel.setProperty("/lessonAddModel", {
                    lnm: "",
                    lcntn: "",
                    lcode: "",
                })
            })
        },
        validateData: function () {
            var _this = this
            if (oModel.oData.lessonAddModel.lnm.trim() == "") {
                sap.m.MessageToast.show("Ders Adı Girilmek Zorundadır")
            } else if (oModel.oData.lessonAddModel.lcntn.trim() == "") {
                sap.m.MessageToast.show("Ders İçeriği Girilmek Zorundadır")
            } else if (oModel.oData.lessonAddModel.lcode.trim() == "") {
                sap.m.MessageToast.show("Ders Kodu Girilmek Zorundadır")
            }
            else {
                _this.onAddLesson();
            }
        },
        onAddLesson: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    CreateComponent.showBusyIndicator();
                    var filter = {
                        lcode: oModel.oData.lessonAddModel.lcode,
                        lnm: oModel.oData.lessonAddModel.lnm.toUpperCase(),
                        lcntn: oModel.oData.lessonAddModel.lcntn.toUpperCase(),
                        lclass: _this.byId("addlessclass").getSelectedKey(),
                        uid: oModel.oData.UserModel[0].uid,
                        MN: "ADD",
                        SN: "Lesson",
                        lperiod: _this.byId("addless").getSelectedKey(),
                        sid: oModel.oData.UserModel[0].sid
                    }
                    LessonService.lessonReq({ SN: "Lesson", MN: "GETWHERE", "where": "lnm=? OR lcode", allparam: [oModel.oData.lessonAddModel.lnm, oModel.oData.lessonAddModel.lcode], field: "lesson" }).then(function (res) {
                        if (res != "None" && res != "") {
                            sap.m.MessageToast.show("Bu Ders Veya Ders Kodu Daha Önce Girildi")
                            CreateComponent.hideBusyIndicator();
                        } else if (res == "") {
                            sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                            CreateComponent.hideBusyIndicator();

                        } else {
                            LessonService.lessonReq(filter).then(function (res) {
                                if (res[0].status == "None") {
                                    sap.m.MessageToast.show("Ders Eklenirken Bir Hata Oluştu");
                                    CreateComponent.hideBusyIndicator();
                                } else if (res == "") {
                                    sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                                    CreateComponent.hideBusyIndicator();
                                }
                                else {
                                    sap.m.MessageToast.show("Ders Başaryıla Eklendi");
                                    oModel.setProperty("/lessonAddModel", {
                                        lnm: "",
                                        lcntn: "",
                                        lcode: ""
                                    })
                                    _this.byId("addless").setSelectedKey("");
                                    CreateComponent.hideBusyIndicator();

                                }
                            })
                        }
                    })
                }
            });
        }
    })
});