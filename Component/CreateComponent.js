CreateComponent = {
    showBusyIndicator: function (_this, createId, iDelay) {
        iDelay = iDelay == null ? 0 : iDelay;
        if (createId) {
            var multiInput = sap.ui.getCore().byId(createId);
            if (_this) {
                multiInput = _this.getView().byId(createId);
            }
            multiInput.setBusyIndicatorDelay(iDelay);
            multiInput.setBusy(true);
        } else sap.ui.core.BusyIndicator.show(iDelay);
    },
    hideBusyIndicator: function (_this, createId) {
        if (createId) {
            var multiInput = sap.ui.getCore().byId(createId);
            if (_this) {
                multiInput = _this.getView().byId(createId);
            }
            multiInput.setBusy(false);
        } else sap.ui.core.BusyIndicator.hide();
    },
}