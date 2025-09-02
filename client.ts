import { Jellyfin } from "@jellyfin/sdk";
export const jellyfin = new Jellyfin({
  clientInfo: {
    name: "Music Cards",
    version: "1.0.0"
  },
  deviceInfo: {
    name: "Music Cards",
    id: "music-cards"
  }
});