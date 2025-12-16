const axios = require('axios');
const Logger = require('../helpers/logger');

const API = process.env.HETZNER_API_URL;

class HostingApi {
    static async createSubdomain(subdomain) {
        const zoneId = process.env.HETZNER_ZONE_ID;
        const domain = process.env.MAIN_DOMAIN;
        const ip = process.env.SERVER_IP;

        const fqdn = `${subdomain}.${domain}`;

        Logger.info({ step: 'dns_check', fqdn }, 'Checking DNS record');

        const records = await axios.get(
            `${API}/records`,
            {
                params: { zone_id: zoneId },
                headers: HostingApi.headers(),
            }
        );

        const exists = records.data.records.find(
            (r) => r.type === 'A' && r.name === subdomain
        );

        if (exists) {
            Logger.info({ step: 'dns_exists', fqdn }, 'DNS record already exists');
            return;
        }

        Logger.info({ step: 'dns_create', fqdn, ip }, 'Creating DNS record');

        await axios.post(
            `${API}/records`,
            {
                zone_id: zoneId,
                type: 'A',
                name: subdomain,
                value: ip,
                ttl: 60,
            },
            {
                headers: HostingApi.headers(),
            }
        );

        Logger.info({ step: 'dns_created', fqdn }, 'DNS record created');
    }

    static headers() {
        return {
            'Auth-API-Token': process.env.HETZNER_DNS_TOKEN,
            'Content-Type': 'application/json',
        };
    }
}

module.exports = HostingApi;
