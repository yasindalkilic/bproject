jQuery.sap.require("okul.Servicejs.UserService");
jQuery.sap.require("okul.Application.Register.RegisterServicejs.RegisterService");
sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/Filter', "sap/ui/export/Spreadsheet", "sap/ui/model/Sorter"], function (Controller, Filter, Spreadsheet, Sorter) {
    "use strict";
    return Controller.extend("okul.Application.Dashboard.AcceptUsers.controller.AcceptUsers", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard/AcceptUsers").attachPatternMatched(_this.onBeforeShow, _this);
        },
        searchTable: function (oEvent) {
            var _this = this
            _this.aFilters = [];
            var sQuery = oEvent.getSource().getValue();;
            if (sQuery && sQuery.length > 2) {
                var rtnm = new Filter("rtnm", sap.ui.model.FilterOperator.Contains, sQuery);
                var rtlnm = new Filter("rtlnm", sap.ui.model.FilterOperator.Contains, sQuery);
                var rtsno = new Filter("rtsno", sap.ui.model.FilterOperator.Contains, sQuery);
                var rttcno = new Filter("rttcno", sap.ui.model.FilterOperator.Contains, sQuery);
                _this.aFilters = [rtnm, rtlnm, rtsno, rttcno]
                var finalFilter = new Filter({
                    filters: _this.aFilters,
                    and: false
                })
                var filterTable = this.byId("idacceptusers");
                var binding = filterTable.getBinding("rows");
                binding.filter(finalFilter, "Application");
            } else {
                var _this = this;
                _this.aFilters = [];
                var filterTable = this.byId("idacceptusers");
                var binding = filterTable.getBinding("rows");
                binding.filter(_this.aFilters, "Application");
            }
        },
        tablePagination: function () {
            var _this = this
            var oTable2 = _this.getView().byId("idacceptusers")
            var oLength = oModel.oData.acceptuser.length;
            var oActual = oLength / 10;
            var oCalculation = (oActual % 1 == 0);
            if (oCalculation == true) {
                var oValue = oActual;
            } else {
                var oValue = parseInt(oActual) + 1;
            }
            oModel.setProperty("/oRows", oModel.oData.acceptuser.slice(0, 10));
            oTable2.bindRows("/oRows");
            if (sap.ui.getCore().byId('pa') != undefined) {
                sap.ui.getCore().byId('pa').destroy();
            }
            var oPaginator = new sap.ui.commons.Paginator("pa", {
                numberOfPages: oValue,
                page: function (oEvent) {
                    var oValue = oEvent;
                    var oTargetPage = oEvent.getParameter("targetPage");
                    var oTargetValue = oTargetPage * 10;
                    var oSourceValue = oTargetValue - 10;
                    var oModel = sap.ui.getCore().getModel();
                    var oTotalData = oModel.getProperty("/acceptuser");
                    var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
                    oModel.setProperty("/oRows", oSelectedData);
                    oTable2.clearSelection();
                }
            }).addStyleClass("paginatorStyle");
            _this.getView().byId("page").addContent(oPaginator)
        },
        getAcceptUser: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    CreateComponent.showBusyIndicator();
                    RegisterService.RegisterReq({ SN: "Register", MN: "GET", where: "sid=?", param: [oModel.oData.UserModel[0].sid] }).then(function (res) {
                        if (res == "None") {
                            CreateComponent.hideBusyIndicator();
                            oModel.setProperty("/acceptuser", []);
                            oModel.setProperty("/oRows", []);
                        }
                        else if (res == "") {
                            CreateComponent.hideBusyIndicator();
                            oModel.setProperty("/acceptuser", []);
                            oModel.setProperty("/oRows", []);
                            sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                        } else {
                            CreateComponent.hideBusyIndicator();
                            oModel.setProperty("/acceptuser", res)
                            _this.tablePagination();
                        }
                    })
                }
            })
        },
        delRegister: function () {
            debugger
            RegisterService.RegisterReq().then(function (res) {
                if(res){
                    debugger
                }
            })
        },
        AddUser: function () {
            var _this = this
            var data = []
            var Table = _this.byId("idacceptusers");
            if (this.byId("idacceptusers").getSelectedIndices().length > 0) {
                var selected = Table.getSelectedIndices();
                for (let index = 0; index < Table.getSelectedIndices().length; index++) {
                    var spath = this.byId("idacceptusers").getRows()[selected[index]]._getBindingContext().sPath
                    data.push({
                        SN: "User",
                        ufnm: oModel.getProperty(spath).rtnm,
                        ulnm: oModel.getProperty(spath).rtlnm,
                        utel: oModel.getProperty(spath).phone,
                        email: oModel.getProperty(spath).rtemail,
                        upnt: "",
                        tid: "2",
                        uauthr: "3",
                        usno: oModel.getProperty(spath).rtsno,
                        sid: parseInt(oModel.getProperty(spath).sid),
                        unm: oModel.getProperty(spath).rtsno,
                        upass: md5(oModel.getProperty(spath).rttcno),
                        MN: "ADDRU"
                    })
                }
                UserServices.UserReq({ MN: "ADDRU", SN: "User", userdata: data }).then(function (res) {
                    if (res == "SuccesAdd") {
                        _this.delRegister();
                    } else if (res == "") {
                        sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyiniz")
                    } else if (res == "None") {
                        sap.m.MessageToast.show("Bilinmeyen Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyiniz")
                    }
                })
            }
            else {
                sap.m.MessageToast.show("Seçili Kayıt Bulunamadı")
            }
        },
        onBeforeShow: function (argument) {
            var _this = this;
            UseronLogin.onLogin().then(function (res) {
                _this.getAcceptUser();
            })
        },
    });
});
