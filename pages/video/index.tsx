import React, { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Subtitles, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import axios from "axios";
import { SUBTITLES_PATH, VIDEO_PATH } from "@/utils/Apihelper";
import LANGUAGE_DICTIONARY from "@/dataClasses/LanguageDictionary";
import { useSnackbar } from "@/store/snackbar";

const DEFAULT_LANG = "en";

const VideoPage: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const snackbar = useSnackbar();
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [subtitlesLang, setSubtitlesLang] = useState(DEFAULT_LANG);
  const [videoId, setVideoId] = useState("");
  const [subtitlesUrlMap, setSubtitlesUrlMap] = useState({});
  const [fileName, setFileName] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [subtitles, setSubtitles] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const queryVideoId = decodeURIComponent(router.query.videoId as string);
      const fileName = decodeURIComponent(router.query.fileName as string);
      const languagesString = decodeURIComponent((router.query.languages as string) || "");

      setVideoId(queryVideoId);
      setFileName(fileName);
      setAvailableLanguages(languagesString ? languagesString.split(",") : ["en"]);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (videoId) {
      fetchVideoUrl(videoId);
      fetchSubtitlesForAllLanguages(videoId);
    }
  }, [videoId]);

  const fetchVideoUrl = async (id) => {
    try {
      const response = await axios.get(VIDEO_PATH, { params: { id } });
      console.log("currentVideoUrl, ", response.data.body);
      setCurrentVideoUrl(response.data.body);
    } catch (error) {
      console.error("Failed to fetch video URL:", error);
      snackbar("error", "Failed to load video. Please try again later.");
    }
  };

  const fetchSubtitlesForAllLanguages = async (id) => {
    const newSubtitlesUrlMap = {};
    setIsLoading(true); // Assuming there's a state to track loading

    for (const lang of availableLanguages) {
      try {
        const response = await axios.get(SUBTITLES_PATH, { params: { id, lang } });
        const vttUrl = await fetchAndConvertSubtitles(response.data.body);
        if (vttUrl) {
          newSubtitlesUrlMap[lang] = vttUrl;
        }
      } catch (error) {
        console.error(`Failed to fetch subtitles for language ${lang}:`, error);
        snackbar("error", `Failed to load subtitles for language ${lang}. Please try again later.`);
      }
    }

    setSubtitlesUrlMap(newSubtitlesUrlMap); // Update state
    setIsLoading(false);

    // Now call fetchTranscript for the selected language
    fetchTranscript(newSubtitlesUrlMap[subtitlesLang]);
  };

  const fetchTranscript = async (subtitlesUrl) => {
    if (!subtitlesUrl) {
      console.error("No subtitles URL provided");
      return;
    }

    try {
      console.log("subtitlesUrl in fetchTranscript =", subtitlesUrl);
      const response = await axios.get(subtitlesUrl, {
        responseType: "blob", // Handle the response as a Blob
      });
      const subtitlesBlob = response.data;
      const reader = new FileReader();

      reader.onload = () => {
        const subtitlesText = reader.result;
        parseSubtitles(subtitlesText); // Function to parse subtitles text
      };

      reader.readAsText(subtitlesBlob);
    } catch (error) {
      console.error("Failed to fetch Transcript:", error);
      snackbar("error", "Failed to load Transcript. Please try again later.");
    }
  };

  useEffect(() => {
    if (subtitlesUrlMap[subtitlesLang]) {
      // Only call if URL exists
      fetchTranscript(subtitlesUrlMap[subtitlesLang]);
    }
  }, [subtitlesLang, subtitlesUrlMap]);

  const srtToVtt = (srtData) => {
    const vttData =
      "WEBVTT\n\n" +
      srtData
        .replace(/\r/g, "")
        .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
        .replace(/^\d+\s/gm, "");
    return vttData;
  };

  const fetchAndConvertSubtitles = async (url) => {
    try {
      const response = await fetch(url);
      const srtText = await response.text();
      const vttText = srtToVtt(srtText);
      const blob = new Blob([vttText], { type: "text/vtt" });
      const vttUrl = URL.createObjectURL(blob);
      console.log("New vtt made");
      return vttUrl;
    } catch (error) {
      console.error("Error fetching or converting Transcript:", error);
      return null;
    }
  };

  const parseSubtitles = (vttString: string) => {
    const parsed = [];
    const lines = vttString.split("\n");
    lines.forEach((line, index) => {
      if (line.includes("-->")) {
        const timeRange = line.split("-->")[0].trim();
        const formattedTime = formatVTTTime(timeRange.split(".")[0]);
        parsed.push({ time: formattedTime, text: "" });
      } else if (
        line.trim() !== "" &&
        !line.startsWith("WEBVTT") &&
        !line.startsWith("NOTE") &&
        !line.startsWith("STYLE")
      ) {
        if (parsed.length > 0) {
          // Check if the trimmed line is not just numbers
          if (!/^\d+$/.test(line.trim())) {
            parsed[parsed.length - 1].text += line.trim() + " ";
          }
        }
      }
    });
    setSubtitles(parsed);
  };

  const formatVTTTime = (timeString: string) => {
    // VTT time is usually in hh:mm:ss.mmm format, so we strip milliseconds and ensure proper hh:mm:ss format
    const parts = timeString.split(":");
    if (parts.length === 3) {
      return parts[0] + ":" + parts[1] + ":" + parts[2].split(",")[0]; // Remove milliseconds
    }
    return timeString; // Return original if format is unexpected
  };

  // Function to handle language change
  const changeLanguage = (event: SelectChangeEvent<string>) => {
    setSubtitlesLang(event.target.value as string);
    console.log("Language changed to:", event.target.value);
  };

  return (
    <>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <IconButton
            onClick={() => router.push("/dashboard")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              marginRight: "auto", // Pushes the button to the left
            }}
          >
            <ArrowBack style={{ fill: "#FFF" }} />
          </IconButton>
          <Typography variant="h3" align="center" gutterBottom sx={{ flexGrow: 1, mt: 2 }}>
            {fileName}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={8}>
            {!isLoading && (
              <Box sx={{ width: "100%", position: "relative", paddingTop: "56.25%" }}>
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", borderRadius: "15px" }}
                    url={currentVideoUrl}
                    playing={false}
                    controls={true}
                    config={{
                      file: {
                        attributes: { crossOrigin: "anonymous" },
                        tracks: [
                          {
                            kind: "subtitles",
                            src: subtitlesUrlMap[subtitlesLang] || "",
                            srcLang: subtitlesLang,
                            label:
                              LANGUAGE_DICTIONARY[subtitlesLang.toUpperCase()] ||
                              subtitlesLang.toUpperCase(),
                            default: true,
                          },
                        ],
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="language-select-label">Subtitle Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={subtitlesLang}
                label="Subtitle Language"
                onChange={changeLanguage}
              >
                {availableLanguages.length > 0 ? (
                  availableLanguages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {LANGUAGE_DICTIONARY[lang] || lang}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="en">English</MenuItem> // Fallback option if availableLanguages is empty
                )}
              </Select>
            </FormControl>
            {subtitles.length > 0 && (
              <Paper
                elevation={3}
                sx={{ maxHeight: 500, overflow: "auto", padding: theme.spacing(2) }}
              >
                <Typography variant="h6" gutterBottom>
                  <Subtitles
                    sx={{
                      mr: 1,
                      mb: 0.5,
                      verticalAlign: "bottom",
                      fill: theme.palette.primary.main,
                    }}
                  />
                  Transcript Overview
                </Typography>
                {subtitles.map((subtitle, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1, marginBottom: 1 }}>
                    <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                      {subtitle.time}:
                    </Typography>
                    <Typography variant="body1" component="span">
                      {subtitle.text.trim()}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default VideoPage;
