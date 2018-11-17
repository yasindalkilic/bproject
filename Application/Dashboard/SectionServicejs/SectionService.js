jQuery.sap.require("okul.AllRequest.AllRequest");
var SectionService = {
    SectionReq:function(json){
        var deferred = new Promise(function (resolve, reject) {
            AllRequest.POST(json).then(function (res) {
                resolve(res);
            })
        })
        return deferred;
    },
    // get: function (json) {
    //     var deferred = new Promise(function (resolve, reject) {
    //         $.ajax({
    //             type: "POST",
    //             url: "/okul/AllService/ServiceReq.php",
    //             datatype: 'application/json',
    //             data: json,
    //             success: function (data, status, xhr) {
    //                 if (!data.length) {
    //                     resolve(data.status);
    //                 } else {
    //                     resolve(data);
    //                 }
    //             },
    //             error: function (data, status, xhr) {
    //                 resolve("")
    //             }
    //         });
    //     });
    //     return deferred;
    // },
    // add: function (json) {
    //     var deferred = new Promise(function (resolve, reject) {
    //         $.ajax({
    //             type: "POST",
    //             url: "/okul/AllService/ServiceReq.php",
    //             datatype: 'application/json',
    //             data: json,
    //             success: function (data, status, xhr) {
    //                 if (!data.length) {
    //                     resolve(data.status);
    //                 } else {
    //                     resolve(data);
    //                 }
    //             },
    //             error: function (data, status, xhr) {
    //                 resolve("")
    //             }
    //         });
    //     });
    //     return deferred;
    // }
}