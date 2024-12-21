import { supabase } from './supabase';

const CLOUDFLARE_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_STREAM_DOMAIN = import.meta.env.VITE_CLOUDFLARE_STREAM_DOMAIN;

export async function getUploadUrl(): Promise<{ uploadUrl: string; uid: string }> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds: 3600,
        requireSignedURLs: false,
      }),
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0]?.message || 'Failed to get upload URL');
  }

  return {
    uploadUrl: result.result.uploadURL,
    uid: result.result.uid,
  };
}

export async function getVideoDetails(uid: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0]?.message || 'Failed to get video details');
  }

  // Construct the HLS URL using the Stream domain
  const playbackUrl = `https://${CLOUDFLARE_STREAM_DOMAIN}/${uid}/manifest/video.m3u8`;
  const thumbnailUrl = `https://${CLOUDFLARE_STREAM_DOMAIN}/${uid}/thumbnails/thumbnail.jpg`;

  return {
    ...result.result,
    playback: {
      ...result.result.playback,
      hls: playbackUrl
    },
    thumbnail: thumbnailUrl
  };
}