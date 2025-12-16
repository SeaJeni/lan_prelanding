module.exports = {
  /**
   * @param {String} subdomain
   * @returns {String|Null} subdomain with domain
   */
  addSubdomain(subdomain) {
    return subdomain ? `${subdomain}.${process.env.MAIN_DOMAIN}` : null;
  },

  /**
   * @param {String} subdomain
   * @param {String} prefix
   * @returns {String|Null} url
   */
  buildUrl(subdomain, prefix) {
    let domain = this.addSubdomain(subdomain);
    if (!domain || !prefix) return null;

    return `${prefix}.${domain}`;
  },

  /**
   * @param req
   * @returns {String|Null} subdomain
   */
  getSubdomain(req) {
    if (!req || !req.headers.host) return null;

    const rawHost = req.headers.host;
    const host = rawHost.split(':')[0];

    const pattern = `${process.env.URL_PREFIX}.{subdomain}.${process.env.MAIN_DOMAIN}`;
    if (!pattern) return null;

    const escaped = pattern.replace(/\./g, "\\.");
    const regex = new RegExp(
        escaped.replace("{subdomain}", "([a-z0-9-]+)")
    );

    const match = host.match(regex);
    return match ? match[1] : null;
  }
};