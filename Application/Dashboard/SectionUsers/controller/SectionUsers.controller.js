jQuery.sap.require("okul.Application.Dashboard.SectionServicejs.SectionService");
sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/Filter', "sap/ui/export/Spreadsheet", "sap/ui/model/Sorter"], function (Controller, Filter, Spreadsheet, Sorter) {
    "use strict";
    return Controller.extend("okul.Application.Dashboard.SectionUsers .controller.SectionUsers", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard/SectionUsers").attachPatternMatched(_this.onBeforeShow, _this);
        },
        searchTable: function (oEvent) {
            var _this = this
            _this.aFilters = [];
            var sQuery = oEvent.getSource().getValue();;
            if (sQuery && sQuery.length > 2) {
                var ufnm = new Filter("ufnm", sap.ui.model.FilterOperator.Contains, sQuery);
                var ulnm = new Filter("ulnm", sap.ui.model.FilterOperator.Contains, sQuery);
                var mail = new Filter("mail", sap.ui.model.FilterOperator.Contains, sQuery);
                _this.aFilters = [ufnm, ulnm, mail]
                var finalFilter = new Filter({
                    filters: _this.aFilters,
                    and: false
                })
                var filterTable = this.byId("iduserTable");
                var binding = filterTable.getBinding("rows");
                binding.filter(finalFilter, "Application");
            } else {
                var _this = this;
                _this.aFilters = [];
                var filterTable = this.byId("iduserTable");
                var binding = filterTable.getBinding("rows");
                binding.filter(_this.aFilters, "Application");
            }
        },
        getAllUser: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                } else {
                    var oTable2 = _this.getView().byId("iduserTable")
                    CreateComponent.showBusyIndicator();
                    SectionService.SectionReq({
                        SN: "Sections",
                        MN: "GETUS",
                        sid: oModel.oData.UserModel[0].sid
                    }).then(function (res) {
                        if (res == "None") {
                            debugger
                            oModel.setProperty("/alluser", [])
                            oModel.setProperty("/oRows", [])
                            CreateComponent.hideBusyIndicator();
                        } else if (res == "") {
                            debugger
                            oModel.setProperty("/alluser", [])
                            oModel.setProperty("/oRows", [])
                            CreateComponent.hideBusyIndicator();
                        } else {
                            debugger
                            oModel.setProperty("/alluser", res)
                            var oLength = oModel.oData.alluser.length;
                            var oActual = oLength / 10;
                            var oCalculation = (oActual % 1 == 0);
                            if (oCalculation == true) {
                                var oValue = oActual;
                            } else {
                                var oValue = parseInt(oActual) + 1;
                            }
                            oModel.setProperty("/oRows", oModel.oData.alluser.slice(0, 10));
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
                                    var oTotalData = oModel.getProperty("/alluser");
                                    var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
                                    oModel.setProperty("/oRows", oSelectedData);
                                    oTable2.clearSelection();
                                }
                            }).addStyleClass("paginatorStyle");
                            _this.getView().byId("page").addContent(oPaginator)
                            CreateComponent.hideBusyIndicator();
                        }
                    })
                }
            })
        },
        onBeforeShow: function (argument) {
            CreateComponent.showBusyIndicator();
            var _this = this;
            UseronLogin.onLogin().then(function (res) {
                _this.getAllUser();
                CreateComponent.hideBusyIndicator();
            })
        },
    });
});
