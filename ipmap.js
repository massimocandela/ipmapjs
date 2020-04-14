var brembo = require('brembo');
var axios = require('axios');

var host = "https://ipmap-api.ripe.net/v1/";
var clientId = "ipmapjs";

var getData = function (url) {
    return axios({
        url,
        method: "GET",
        responseType: "json"
    })
        .then(data => data.data.data);
};

var getIXPs = function () {
    var url = brembo.build(host, {
        path: ["peeringdb", "ixps"],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getIXP = function (id) {
    var url = brembo.build(host, {
        path: ["peeringdb", "ixps", id],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getFacilities = function () {
    var url = brembo.build(host, {
        path: ["peeringdb", "facilities"],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getFacility = function (id) {
    var url = brembo.build(host, {
        path: ["peeringdb", "facilities", id],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getIXPsPeeringWithASN = function (asn) {
    var url = brembo.build(host, {
        path: ["peeringdb", "ixps", "peerings", asn],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getIXPFromIPs = function (ips) {

    var url = brembo.build(host, {
        path: ["peeringdb", "ixps"],
        params: {
            resources: ips.join(","),
            clientId
        }
    });

    return getData(url);
};

var getIXPFromIP = function (ip) {
    return getIXPFromIPs([ip])[ip];
};

var getASNsPeeringWithIXP = function (ixpId) {
    var url = brembo.build(host, {
        path: ["peeringdb", "ixps", ixpId, "peerings"],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getASNsHostedInFacility = function (facilityId) {
    var url = brembo.build(host, {
        path: ["peeringdb", "facilities", facilityId, "customers"],
        params: {
            clientId
        }
    });

    return getData(url);
};

var getFacilitiesHostingASN = function (asn) {
    var url = brembo.build(host, {
        path: ["peeringdb", "facilities", "customers", asn],
        params: {
            clientId
        }
    });

    return getData(url);
};


module.exports = {
    getIXPs,
    getIXP,
    getFacilities,
    getFacility,
    getIXPsPeeringWithASN,
    getIXPFromIP,
    getIXPFromIPs,
    getASNsPeeringWithIXP,
    getFacilitiesHostingASN,
    getASNsHostedInFacility
}



