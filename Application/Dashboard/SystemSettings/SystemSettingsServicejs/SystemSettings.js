jQuery.sap.require("okul.AllRequest.AllRequest");
var SystemService = {
    getSystemSetting: function (json) {
        var deferred = new Promise(function (resolve, reject) {
            AllRequest.POST(json).then(function (res) {
                resolve(res);
            })
        })
        return deferred;
    }
}


