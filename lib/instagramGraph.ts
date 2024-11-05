// lib/instagramGraph.ts
export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  children?: {
    data: Array<{
      id: string;
      media_type: string;
      media_url: string;
    }>;
  };
}

export class InstagramGraphService {
  private static readonly GRAPH_API_URL = "https://graph.facebook.com/v18.0";
  private static readonly ACCESS_TOKEN = process.env.INSTAGRAM_GRAPH_TOKEN;
  private static readonly INSTAGRAM_BUSINESS_ID =
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  static async getMedia(limit: number = 12): Promise<InstagramPost[]> {
    try {
      if (!this.ACCESS_TOKEN || !this.INSTAGRAM_BUSINESS_ID) {
        throw new Error("Instagram Graph API credentials not configured");
      }

      // Get media from Instagram Graph API
      const response = await fetch(
        `${this.GRAPH_API_URL}/${this.INSTAGRAM_BUSINESS_ID}/media` +
          `?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,media_type}` +
          `&limit=${limit}` +
          `&access_token=${this.ACCESS_TOKEN}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Graph API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Process and filter media items
      const posts: InstagramPost[] = await Promise.all(
        data.data.map(async (item: any) => {
          // For carousel albums, get the first image
          if (item.media_type === "CAROUSEL_ALBUM" && item.children?.data) {
            const firstImage = item.children.data.find(
              (child: any) => child.media_type === "IMAGE"
            );
            if (firstImage) {
              item.media_url = firstImage.media_url;
              item.media_type = "IMAGE";
            }
          }
          return item;
        })
      );

      // Filter to only include posts with images
      return posts.filter((post) => post.media_type === "IMAGE");
    } catch (error) {
      console.error("Error fetching Instagram media:", error);
      throw error;
    }
  }

  // Helper method to get user profile info
  static async getProfile(): Promise<{
    username: string;
    media_count: number;
    profile_picture_url: string;
  }> {
    try {
      const response = await fetch(
        `${this.GRAPH_API_URL}/${this.INSTAGRAM_BUSINESS_ID}` +
          "?fields=username,media_count,profile_picture_url" +
          `&access_token=${this.ACCESS_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Instagram profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      throw error;
    }
  }
}
