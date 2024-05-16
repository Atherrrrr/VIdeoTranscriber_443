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
  Button,
} from "@mui/material";
import { Subtitles, ArrowBack, CloudDownload } from "@mui/icons-material";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import axios from "axios";
import { SUBTITLES_PATH, VIDEO_PATH } from "@/hooks/Apihelper";
import LANGUAGE_DICTIONARY from "@/dataClasses/LanguageDictionary";
import { useSnackbar } from "@/store/snackbar";
import { accessTokenAtom } from "@/store/store";
import { useAtom } from "jotai";

const DEFAULT_LANG = "en";

interface SubtitlesUrlMap {
  [key: string]: string;
}

interface Subtitle {
  time: string;
  text: string;
}

const VideoPage: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const snackbar = useSnackbar();
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [subtitlesLang, setSubtitlesLang] = useState(DEFAULT_LANG);
  const [videoId, setVideoId] = useState("");
  const [subtitlesUrlMap, setSubtitlesUrlMap] = useState<SubtitlesUrlMap>({});
  const [fileName, setFileName] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken] = useAtom(accessTokenAtom);

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

  const fetchVideoUrl = async (id: string) => {
    try {
      const response = await axios.get(VIDEO_PATH, {
        params: { id },
        headers: {
          Authorization: accessToken,
        },
      });
      setCurrentVideoUrl(response.data.body);
    } catch (error) {
      console.error("Failed to fetch video URL:", error);
      snackbar("error", "Failed to load video. Please try again later.");
    }
  };

  const fetchSubtitlesForAllLanguages = async (id: string) => {
    const newSubtitlesUrlMap: SubtitlesUrlMap = {};
    setIsLoading(true);

    const fetchPromises = availableLanguages.map(async (lang) => {
      try {
        const response = await axios.get(`${SUBTITLES_PATH}?id=${id}&lang=${lang}`, {
          headers: {
            Authorization: accessToken,
          },
        });
        const vttUrl = await fetchAndConvertSubtitles(response.data.body);
        if (vttUrl) {
          newSubtitlesUrlMap[lang] = vttUrl;
        }
      } catch (error) {
        console.error(`Failed to fetch subtitles for language ${lang}:`, error);
        snackbar("error", `Failed to load subtitles for language ${lang}. Please try again later.`);
      }
    });

    await Promise.all(fetchPromises); // Wait for all subtitles to be fetched and converted
    setSubtitlesUrlMap(newSubtitlesUrlMap);
    setIsLoading(false);

    // Optionally fetch the transcript for the initially selected language
    fetchTranscript(newSubtitlesUrlMap[subtitlesLang]);
  };

  const fetchTranscript = async (subtitlesUrl: string) => {
    if (!subtitlesUrl) {
      console.error("No subtitles URL provided");
      return;
    }

    try {
      console.log("subtitlesUrl in fetchTranscript =", subtitlesUrl);
      const response = await axios.get(subtitlesUrl, {
        responseType: "blob",

        headers: {
          Authorization: accessToken,
        },
      });
      const subtitlesBlob = response.data;
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          const subtitlesText = reader.result;
          parseSubtitles(subtitlesText); // Function to parse subtitles text
        } else {
          console.error("Failed to read subtitles as text.");
          snackbar("error", "Failed to process subtitles file.");
        }
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

  const srtToVtt = (srtData: string) => {
    const vttData =
      "WEBVTT\n\n" +
      srtData
        .replace(/\r/g, "")
        .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
        .replace(/^\d+\s/gm, "");
    return vttData;
  };

  const fetchAndConvertSubtitles = async (url: string): Promise<string | null> => {
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
    const parsed: Subtitle[] = []; // Specify the type for parsed as an array of Subtitle
    const lines = vttString.split("\n");

    lines.forEach((line) => {
      if (line.includes("-->")) {
        const timeRange = line.split("-->")[0].trim();
        const formattedTime = formatVTTTime(timeRange.split(".")[0]);
        parsed.push({ time: formattedTime, text: "" }); // Correctly typed object
      } else if (
        line.trim() !== "" &&
        !line.startsWith("WEBVTT") &&
        !line.startsWith("NOTE") &&
        !line.startsWith("STYLE") &&
        parsed.length > 0
      ) {
        // Ensure that parsed is not empty before trying to access its last element
        const lastSubtitle = parsed[parsed.length - 1];
        if (!/^\d+$/.test(line.trim())) {
          // Check if the line is not just numbers
          lastSubtitle.text += line.trim() + " ";
        }
      }
    });

    setTranscript(parsed); // Set the parsed subtitles
  };

  const formatVTTTime = (timeString: string) => {
    const parts = timeString.split(":");
    if (parts.length === 3) {
      return parts[0] + ":" + parts[1] + ":" + parts[2].split(",")[0];
    }
    return timeString;
  };

  // Function to handle language change
  const changeLanguage = (event: SelectChangeEvent<string>) => {
    setSubtitlesLang(event.target.value as string);
    console.log("Language changed to:", event.target.value);
  };
  const downloadVideo = async (url: string): Promise<void> => {
    if (!url) {
      snackbar("error", "No video URL found.");
      return;
    }

    // Trim the fileName and set a default if empty
    const sanitizedFileName = fileName.trim() !== "" ? fileName.trim() : "download";
    const fileNameWithExtension = sanitizedFileName.endsWith(".mp4")
      ? sanitizedFileName
      : `${sanitizedFileName}.mp4`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to initiate download
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = fileNameWithExtension;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to fetch video for download:", error);
      snackbar("error", "Failed to download video. Please try again.");
    }
  };

  const downloadSubtitles = async () => {
    const subtitlesUrl = subtitlesUrlMap[subtitlesLang];
    if (!subtitlesUrl) {
      snackbar("error", "No subtitles URL found.");
      return;
    }

    try {
      const response = await fetch(subtitlesUrl);
      if (!response.ok) throw new Error("Network response was not ok.");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const subtitlesFileName = `${fileName}_${subtitlesLang}.vtt`;

      // Create a temporary anchor element to initiate download
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = subtitlesFileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to fetch subtitles for download:", error);
      snackbar("error", "Failed to download subtitles. Please try again.");
    }
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
        {!isLoading && currentVideoUrl && (
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ width: "100%", position: "relative", paddingTop: "56.25%" }}>
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ReactPlayer
                    key={subtitlesLang}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", borderRadius: "15px" }}
                    url={currentVideoUrl}
                    playing={false}
                    controls={true}
                    config={{
                      file: {
                        attributes: { crossOrigin: "anonymous" },
                        tracks: availableLanguages.map((lang) => ({
                          kind: "subtitles",
                          src: subtitlesUrlMap[lang],
                          srcLang: lang,
                          label: LANGUAGE_DICTIONARY[lang.toUpperCase()] || lang.toUpperCase(),
                          default: lang === subtitlesLang,
                        })),
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={() => downloadVideo(currentVideoUrl)}
                startIcon={<CloudDownload />}
                sx={{ mb: 2, width: "100%" }}
              >
                Download Video
              </Button>
              <Button
                variant="contained"
                onClick={downloadSubtitles}
                startIcon={<Subtitles />}
                sx={{ mb: 2, width: "100%" }}
              >
                Download Subtitles
              </Button>
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
              {transcript.length > 0 && (
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
                  {transcript.map((subtitle, index) => (
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
        )}
      </Box>
    </>
  );
};

export default VideoPage;
