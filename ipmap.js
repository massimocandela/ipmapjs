const brembo = require('brembo');
const axios = require('axios');
const batchPromises = require('batch-promises');


const host = "https://ipmap-api.ripe.net/v1/";
const clientId = "ipmapjs";

const getData = function (url) {
    return axios({
        url,
        method: "GET",
        responseType: "json"
    })
        .then(data => data.data.data);
};

const getIXPs = function () {
    const url = brembo.build(host, {
        path: ["peeringdb", "ixps"],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getIXP = function (id) {
    const url = brembo.build(host, {
        path: ["peeringdb", "ixps", id],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getFacilities = function () {
    const url = brembo.build(host, {
        path: ["peeringdb", "facilities"],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getFacility = function (id) {
    const url = brembo.build(host, {
        path: ["peeringdb", "facilities", id],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getIXPsPeeringWithASN = function (asn) {
    const url = brembo.build(host, {
        path: ["peeringdb", "ixps", "peerings", asn],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getIXPFromIPs = function (ips) {

    const url = brembo.build(host, {
        path: ["peeringdb", "ixps"],
        params: {
            resources: ips.join(","),
            clientId
        }
    });

    return getData(url);
};

const getIXPFromIP = function (ip) {
    return getIXPFromIPs([ip])[ip];
};

const getASNsPeeringWithIXP = function (ixpId) {
    const url = brembo.build(host, {
        path: ["peeringdb", "ixps", ixpId, "peerings"],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getASNsHostedInFacility = function (facilityId) {
    const url = brembo.build(host, {
        path: ["peeringdb", "facilities", facilityId, "customers"],
        params: {
            clientId
        }
    });

    return getData(url);
};

const getFacilitiesHostingASN = function (asn) {
    const url = brembo.build(host, {
        path: ["peeringdb", "facilities", "customers", asn],
        params: {
            clientId
        }
    });

    return getData(url);
};

const isAnycast = function (ips) {
    return _getGeolocation(ips)
        .then(data => {
            for (let ip in data) {
                if (data[ip]){
                    data[ip] = (!!data[ip] && !!data[ip].isAnycast);
                }
            }
            return data;
        })
        .then(out => {
            return (typeof(ips) === "string") ? out[ips] : out;
        });
};


const getGeolocation = function (ips) {
    return _getGeolocation(ips)
        .then(data => {
            for (let ip in data) {
                if ((!!data[ip] && !!data[ip].isAnycast)){
                    data[ip] = null;
                }
            }
            return data;
        })
        .then(out => {
            return (typeof(ips) === "string") ? out[ips] : out;
        });
}

const _getGeolocation = function (ips) {
    const listOfIps = (typeof(ips) === "string") ? [ips] : [...new Set(ips)]
    const parallelFactor = 1;
    const fraction = Math.ceil(listOfIps.length / parallelFactor);
    const chunks = [...Array(fraction).keys()].map(n => listOfIps.slice(n * parallelFactor, (n + 1) * parallelFactor));
    let out = {};

    for (let ip of listOfIps) {
        out[ip] = null;
    }

    return batchPromises(1, chunks, ips => {
        const url = brembo.build(host, {
            path: ["locate", "all"],
            params: {
                resources: ips.join(",")
            }
        });

        return axios({
            url,
            method: "GET",
            responseType: "json"
        })
            .then(rawData => {
                const data = rawData.data.data;
                const contributions = rawData.data.metadata.service.contributions;

                for (let ip in contributions) {
                    const anycast = (contributions[ip].engines || []).filter(i => i.engine === "simple-anycast").map(i => i.metadata);
                    const isAnycast = anycast.some(i => !!i.anycast);

                    out[ip] = isAnycast ? { isAnycast } : data[ip] || null;
                }
            })
    })
        .then(() => out);
}


module.exports = {
    isAnycast,
    getGeolocation,
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
