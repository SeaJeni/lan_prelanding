module.exports = {
  buildUrl(subdomain) {
    pattern = process.env.SUBDOMAIN_PATTERN;
    if (!subdomain || !pattern) return null;
    
    const url = pattern.replace("{subdomain}", subdomain);

    return url;
  }
};