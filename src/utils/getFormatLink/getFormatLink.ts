const getFormatLink = (link: string): string => {
  const prefixes = ['https://www.', 'http://www.', 'https://', 'http://', 'www.'];

  for (const prefix of prefixes) {
    if (link.startsWith(prefix)) {
      return link.substring(prefix.length);
    }
  }
  return link;
};

export default getFormatLink;
