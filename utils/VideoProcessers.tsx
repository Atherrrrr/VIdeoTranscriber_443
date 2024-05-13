import type { LanguageMap } from "@/dataClasses/LanguageDictionary";
import type { AwsVideo } from "@/pages/dashboard";

export const formatDate = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  date.setHours(date.getHours() + 3); // Add 3 hours to the date object

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return {
    date: date.toLocaleDateString("en-US"),
    time: date.toLocaleTimeString("en-US", options).toUpperCase(),
  };
};

export const determineStatus = (video: AwsVideo) => {
  const languages = video.languages.split(", ");

  const allSubtitlesAvailable = languages.every((lang) => {
    switch (lang.trim()) {
      case "en":
        return video.srt_en;
      case "de":
        return video.srt_de;
      case "fr":
        return video.srt_fr;
      case "ar":
        return video.srt_ar;
      case "tr":
        return video.srt_tr;
      default:
        return false;
    }
  });

  return allSubtitlesAvailable ? "Analyzed" : "Processing";
};

export const getLanguageFullForm = (langCode: string): string => {
  const languageMap: LanguageMap = {
    en: "English",
    de: "German",
    ar: "Arabic",
    fr: "French",
    tr: "Turkish",
  };
  return langCode
    .split(", ")
    .map((code) => languageMap[code.trim()] ?? "Unknown Language") // Provide a fallback if the key isn't found
    .join(", ");
};
