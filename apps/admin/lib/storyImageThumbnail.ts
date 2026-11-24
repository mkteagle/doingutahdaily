import { lookup } from "node:dns/promises";
import type { IncomingMessage } from "node:http";
import { get } from "node:https";
import ipaddr from "ipaddr.js";
import sharp from "sharp";
import { isStoryImageUrl, storyImageUrl } from "./storyImageUrl";

const maxDownloadBytes = 12 * 1024 * 1024;
const redirectStatuses = [301, 302, 303, 307, 308];
const globalIpv6 = ipaddr.parseCIDR("2000::/3");

async function requestImage(url: URL, signal: AbortSignal) {
  if (!isStoryImageUrl(url.href) || url.port) throw new Error("Expected a public HTTPS image URL.");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = await lookup(hostname, { all: true, order: "ipv4first" });
  const target = addresses.find(({ address }) => {
    const ip = ipaddr.process(address);
    return ip.range() === "unicast" && (ip.kind() === "ipv4" || ip.match(globalIpv6));
  });
  if (!target) throw new Error("The image host has no public address.");

  // Pin the checked address for this connection while TLS still verifies the URL hostname.
  return new Promise<IncomingMessage>((resolve, reject) => {
    const request = get(url, {
      agent: false,
      family: target.family,
      lookup: (_hostname, options, callback) => {
        if (options.all) callback(null, [target]);
        else callback(null, target.address, target.family);
      },
      headers: { Accept: "image/avif,image/webp,image/*" },
      signal,
    }, resolve);
    request.on("error", reject);
  });
}

async function readImage(initialUrl: URL) {
  const signal = AbortSignal.timeout(8_000);
  let url = initialUrl;
  for (let hop = 0; hop <= 3; hop++) {
    const response = await requestImage(url, signal);
    try {
      if (redirectStatuses.includes(response.statusCode ?? 0) && response.headers.location) {
        url = new URL(response.headers.location, url);
        continue;
      }
      if (response.statusCode !== 200 || Number(response.headers["content-length"]) > maxDownloadBytes) {
        throw new Error("The image could not be downloaded.");
      }

      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of response) {
        size += chunk.length;
        if (size > maxDownloadBytes) throw new Error("The image is too large to preview.");
        chunks.push(chunk);
      }
      return Buffer.concat(chunks, size);
    } finally {
      response.destroy();
    }
  }
  throw new Error("The image URL redirected too many times.");
}

export async function loadStoryImageThumbnail(source: string) {
  if (!isStoryImageUrl(source)) throw new Error("Expected an HTTPS image URL or site path.");
  const bytes = await readImage(new URL(storyImageUrl(source)));
  const image = sharp(bytes, { limitInputPixels: 45_000_000 });
  const { format, autoOrient } = await image.metadata();
  if (!format || !["jpeg", "png", "webp", "gif", "heif"].includes(format) || !autoOrient.width || !autoOrient.height) {
    throw new Error("The URL did not return a supported photo.");
  }

  const thumbnail = await image.rotate().resize(720, 720, { fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  return { data: thumbnail.toString("base64"), width: autoOrient.width, height: autoOrient.height };
}
