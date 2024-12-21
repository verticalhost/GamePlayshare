import { CLOUDFLARE_CONFIG } from './config';

export async function getUploadUrl(): Promise<{ uploadUrl: string; uid: string }> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.ACCOUNT_ID}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_CONFIG.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600,
          requireSignedURLs: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0]?.message || 'Failed to get upload URL');
    }

    return {
      uploadUrl: result.result.uploadURL,
      uid: result.result.uid,
    };
  } catch (error: any) {
    console.error('Error getting upload URL:', error);
    throw new Error('Failed to initialize upload. Please try again.');
  }
}

export async function getVideoDetails(uid: string) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.ACCOUNT_ID}/stream/${uid}`,
      {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_CONFIG.API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0]?.message || 'Failed to get video details');
    }

    const playbackUrl = `https://${CLOUDFLARE_CONFIG.STREAM_DOMAIN}/${uid}/manifest/video.m3u8`;
    const thumbnailUrl = `https://${CLOUDFLARE_CONFIG.STREAM_DOMAIN}/${uid}/thumbnails/thumbnail.jpg`;

    return {
      ...result.result,
      playback: {
        ...result.result.playback,
        hls: playbackUrl
      },
      thumbnail: thumbnailUrl
    };
  } catch (error: any) {
    console.error('Error getting video details:', error);
    throw new Error('Failed to get video information. Please try again.');
  }
}