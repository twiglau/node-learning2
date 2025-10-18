export const PROTOCOL_REGEX = /^(.*?):\/\//;

export function getDBType(url: string) {
  const matches = url.match(PROTOCOL_REGEX);

  const protocol = matches ? matches[1] : 'file';

  return protocol === 'file' ? 'sqlite' : protocol;
}
