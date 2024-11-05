"use client";
import { useState, useEffect } from "react";
import { getMonth } from "date-fns";

export type Season = "spring" | "summer" | "fall" | "winter";

export function useAutoSeason() {
  const [season, setSeason] = useState<Season>("spring");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectSeason = async () => {
      try {
        // Get user's hemisphere
        const position = await getCurrentPosition();
        const isNorthernHemisphere = position.coords.latitude >= 0;

        // Get current month and adjust for hemisphere
        const month = getMonth(new Date());
        const adjustedMonth = isNorthernHemisphere ? month : (month + 6) % 12;

        // Determine season
        let newSeason: Season;
        if (adjustedMonth >= 2 && adjustedMonth <= 4) newSeason = "spring";
        else if (adjustedMonth >= 5 && adjustedMonth <= 7) newSeason = "summer";
        else if (adjustedMonth >= 8 && adjustedMonth <= 10) newSeason = "fall";
        else newSeason = "winter";

        setSeason(newSeason);
      } catch (error) {
        // Default to Northern Hemisphere if geolocation fails
        // console.error(error);
        const month = getMonth(new Date());
        if (month >= 2 && month <= 4) setSeason("spring");
        else if (month >= 5 && month <= 7) setSeason("summer");
        else if (month >= 8 && month <= 10) setSeason("fall");
        else setSeason("winter");
      } finally {
        setIsLoading(false);
      }
    };

    detectSeason();

    // Check for season changes daily
    const interval = setInterval(detectSeason, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { season, isLoading, setSeason };
}

// Helper function to wrap geolocation API in a promise
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
