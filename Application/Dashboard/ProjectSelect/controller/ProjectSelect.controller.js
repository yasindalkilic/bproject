jQuery.sap.require("okul.Application.Project.PprojectServicejs.ProjectOnLessonService");
jQuery.sap.require("okul.Servicejs.ActiveProjectService");
jQuery.sap.require("okul.Application.Dashboard.SystemSettings.SystemSettingsServicejs.SystemSettings");
sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/Filter', "sap/ui/export/Spreadsheet", "sap/ui/model/Sorter"], function (Controller, Filter, Spreadsheet, Sorter) {
    "use strict";
    return Controller.extend("okul.Application.Dashboard.ProjectSelect.controller.ProjectSelect", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard/ProjectSelect").attachPatternMatched(_this.onBeforeShow, _this);
        },
        rightClick: function (oEvent) {
            var _this = this
            var sPath = oEvent.getSource()._getBindingContext().sPath
            var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
            if (oEvent.getSource().mProperties.text == "İlgili Projeler") {
                var param = "#/Lesson/LessonOnProject?LID=" + oModel.oData.oRows[oIndex].lid;
                _this.onGetLesson(param)
            } else if (oEvent.getSource().mProperties.text == "Dersi Görüntüle") {
                var param = "#/Lesson/LessonUd?LID=" + oModel.oData.oRows[oIndex].lid;
                _this.onGetLesson(param)
            }
            else if (oEvent.getSource().mProperties.text == "Dersi Sil") {
                sap.m.MessageBox.confirm("Bu Dersi  ve Bu Derse Bağlı Projeleri Silmek İstediğinize Emin Misiniz ?", {
                    title: "Kayıt Sil",
                    icon: sap.m.MessageBox.Icon.WARNING,
                    actions: ["Evet", "Hayır"],
                    onClose: function (oAction) {
                        if (oAction === "Evet") {
                            debugger
                            Servertime.getY().then(function (res) {
                                if (res != new Date().toLocaleDateString().split(".")[2]) {
                                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                                }
                                else {
                                    CreateComponent.showBusyIndicator(_this, "idlessonTable")

                                    LessonService.lessonReq({ SN: "Lesson", "MN": "DEL", where: "lid=?", allparam: [oModel.oData.oRows[oIndex].lid] }).then(function (res) {
                                        if (res == "SuccesDel") {
                                            sap.m.MessageToast.show("Ders Başarıyla Silindi")
                                            _this.allLesson();
                                            CreateComponent.hideBusyIndicator(_this, "idlessonTable")
                                        } else if (res == "None") {
                                            sap.m.MessageToast.show("Kayıt Silinirken Hata Gerçekleşti")
                                            CreateComponent.hideBusyIndicator(_this, "idlessonTable")
                                        }
                                    })
                                }
                            })
                        } else { CreateComponent.hideBusyIndicator(_this, "idlessonTable") }
                    }
                })
            }
        },
        onGetLesson: function (param) {
            window.open(param);
        },
        searchTable: function (oEvent) {
            var _this = this
            _this.aFilters = [];
            var sQuery = oEvent.getSource().getValue();;
            if (sQuery && sQuery.length > 2) {
                var lnm = new Filter("lnm", sap.ui.model.FilterOperator.Contains, sQuery);
                var lclass = new Filter("lclass", sap.ui.model.FilterOperator.Contains, sQuery);
                var lcntn = new Filter("lcntn", sap.ui.model.FilterOperator.Contains, sQuery);
                _this.aFilters = [lnm, lclass, lcntn]
                var finalFilter = new Filter({
                    filters: _this.aFilters,
                    and: false
                })
                var filterTable = this.byId("idlessonTable");
                var binding = filterTable.getBinding("rows");
                binding.filter(finalFilter, "Application");
            } else {
                var _this = this;
                _this.aFilters = [];
                var filterTable = this.byId("idlessonTable");
                var binding = filterTable.getBinding("rows");
                binding.filter(_this.aFilters, "Application");
            }
        },
        changePaginator: function (oEvent) {
            var _this = this
            CreateComponent.tablaPaginator(_this, 'idactivesproject', "allProject", 'footerToolbar', parseInt(oEvent.getSource().getSelectedKey()));
        },
        getActiveProject: function () {
            var _this = this
            Servertime.getY().then(function (res) {
                if (res != new Date().toLocaleDateString().split(".")[2]) {
                    sap.m.MessageToast.show("Lütfen Bilgisayarınızın Tarih Ve Saatini Güncelleyiniz.")
                }
                else {
                    CreateComponent.showBusyIndicator();
                    ActiveProject.ActiveProjReq({
                        SN: "ActiveProject",
                        MN: "GETLP"
                    }).then(function (res) {
                        if (res == "None") {
                            CreateComponent.hideBusyIndicator();
                            oModel.setProperty("/allProject", []);
                            oModel.setProperty("/oRows", []);
                        } else if (res == "") {
                            CreateComponent.hideBusyIndicator();
                            sap.m.MessageToast.show("Sunucuda Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin.")
                        } else {
                            CreateComponent.hideBusyIndicator();
                            var pjid = [];
                            res.filter(function (x) {
                                if (!pjid.includes(x.pjid)) {
                                    pjid.push(x.pjid);
                                }
                            })
                            pjid.sort()
                            var projdata = []
                            var data = _.groupBy(res, 'pjid')
                            for (let index = 0; index < pjid.length; index++) {
                                var lnm = ""
                                for (let j = 0; j < data[pjid[index]].length; j++) {
                                    if (data[pjid[index]].length - 1 == j) {
                                        lnm += data[pjid[index]][j].lnm
                                        data[pjid[index]].splice(1, data[pjid[index]].length)

                                    } else {
                                        lnm += data[pjid[index]][j].lnm + ","
                                    }
                                }
                                data[pjid[index]][0].lnm = ""
                                data[pjid[index]][0].lnm = lnm
                                projdata.push(
                                    data[pjid[index]][0]
                                )
                            }
                            oModel.setProperty("/allProject", projdata)
                            CreateComponent.tablaPaginator(_this, 'idactivesproject', "allProject", 'footerToolbar', parseInt(_this.byId("rid").getSelectedKey()));
                        }
                    })
                }
            })
        },
        selectionChange: function (oEvent) {
            debugger
            var i = parseInt(oModel.oData.SysSettings[0].pjscontenjan);
            var selected = oEvent.getSource().getSelectedIndices();
            for (let index = 0; index < selected.length; index++) {
                if (oEvent.oSource.isIndexSelected(selected[index])) {
                    i--
                } else {
                    i++
                }
            }
            oModel.oData.SysSettings[0].pjscontenjan = i;
            oModel.refresh()
            // 
            // var selected=oEvent.getSource()._oSelection.aSelectedIndices.length;
            // if(selected.length<oEvent.getSource()._oSelection.aSelectedIndices.length)
            // = oModel.oData.SysSettings[0].pjscontenjan - oEvent.getSource()._oSelection.aSelectedIndices.length;
            // oModel.refresh();
        },
        onBeforeShow: function (argument) {
            var _this = this;
            UseronLogin.onLogin().then(function (res) {
                SystemService.getSystemSetting({ MN: "GETSYS", SN: "SystemSettings" }).then(function (res) {
                    if (res == "None") {
                        oModel.setProperty("/SysSettings", [])
                    } else if (res == "") {
                        sap.m.MessageToast.show("Beklenmeyen Hata Lütfen Daha Sonra Tekrar Deneyiniz")
                    } else {
                        oModel.setProperty("/SysSettings", res)
                    }
                })
                _this.getActiveProject();
            })
        },
    });
});
