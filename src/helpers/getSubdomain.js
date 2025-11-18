module.exports = {
    getSubdomain(req) {
        
    if (!req || !req.headers.host) return null;

    const rawHost = req.headers.host;         
    const host = rawHost.split(':')[0];       

    const pattern = process.env.SUBDOMAIN_PATTERN;
    if (!pattern) return null;

    const escaped = pattern.replace(/\./g, "\\.");
    const regex = new RegExp(
      escaped.replace("{subdomain}", "([a-z0-9-]+)")
    );

    const match = host.match(regex);
    return match ? match[1] : null;
  }
};