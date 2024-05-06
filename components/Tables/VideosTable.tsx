import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  useTheme,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/router";
import { AutorenewOutlined, CheckCircleOutlineOutlined } from "@mui/icons-material";
import type { LanguageMap } from "@/dataClasses/LanguageDictionary";

const formatDate = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Specify whether to use 12-hour format
  };
  return {
    date: date.toLocaleDateString("en-US"), // Assuming 'en-US' or choose appropriate locale
    time: date.toLocaleTimeString("en-US", options).toUpperCase(), // Convert to upper case for AM/PM
  };
};

const determineStatus = (video: VideoData) => {
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

const getLanguageFullForm = (langCode: string): string => {
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
export interface VideoData {
  user_id: string;
  languages: string;
  video_id: string;
  file_name: string;
  time_stamp: string;
  video_uploaded: boolean;
  srt_en: boolean;
  srt_fr: boolean;
  srt_tr: boolean;
  srt_ar: boolean;
  srt_de: boolean;
}

interface VideosTableProps {
  data: VideoData[];
}

const VideosTable: React.FC<VideosTableProps> = ({ data, onDelete }) => {
  const theme = useTheme();
  const router = useRouter();

  const processedVideos = data.map((video) => {
    const { date, time } = formatDate(video.time_stamp);
    return {
      ...video,
      name: video.file_name.replace(/\.mp4$/, ""),
      fileType: video.file_name.split(".").pop(),
      time,
      date,
      status: determineStatus(video),
      languages: getLanguageFullForm(video.languages),
    };
  });

  const goToVideo = (video: VideoData) => {
    const languageList = getSubtitleLanguageList(video);
    const videoIdCoded = encodeURIComponent(video.video_id);
    const fileNameCoded = encodeURIComponent(video.file_name);
    const languageListCoded = encodeURIComponent(languageList.join(","));

    router.push({
      pathname: "/video",
      query: { videoId: videoIdCoded, fileName: fileNameCoded, languages: languageListCoded },
    });
  };

  const getSubtitleLanguageList = (video: VideoData) => {
    const languagesList: string[] = [];

    if (video.srt_en) {
      languagesList.push("en");
    }
    if (video.srt_de) {
      languagesList.push("de");
    }
    if (video.srt_fr) {
      languagesList.push("fr");
    }
    if (video.srt_ar) {
      languagesList.push("ar");
    }
    if (video.srt_tr) {
      languagesList.push("tr");
    }

    return languagesList;
  };

  const renderActions = (video: VideoData) => (
    <>
      {/* <Tooltip title="Edit" placement="top" arrow>
        <IconButton onClick={() => console.log("Edit")}>
          <EditOutlinedIcon sx={{ fill: "#006FEE" }} />
        </IconButton>
      </Tooltip> */}
      <Tooltip title="Delete" placement="top" arrow>
        <IconButton onClick={() => onDelete(video.video_id)}>
          <DeleteOutlinedIcon sx={{ fill: "#EE0000" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="View" placement="top" arrow>
        <IconButton onClick={() => goToVideo(video)}>
          <VisibilityOutlinedIcon sx={{ fill: status === "Processing" ? "#ccc" : "#17C964" }} />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 830 }}>
        <Table stickyHeader aria-label="videos table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>Name</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>File Type</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>Upload Time</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>Upload Date</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>Status</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }}>Languages</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.info.main }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedVideos.map((video, index) => (
              <TableRow hover key={index} sx={{ "& > *": { bgcolor: theme.palette.info.light } }}>
                <TableCell>{video.name}</TableCell>
                <TableCell>{video.fileType}</TableCell>
                <TableCell>{video.time}</TableCell>
                <TableCell>{video.date}</TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      backgroundColor: video.status === "Processing" ? "#E6F1FE" : "#F6FFED",
                      color: video.status === "Processing" ? "#006FEE" : "#0E793C",
                      border: 2,
                      borderColor: video.status === "Processing" ? "#006FEE" : "#0E793C",
                    }}
                    icon={
                      video.status === "Processing" ? (
                        <AutorenewOutlined sx={{ fill: "#006FEE" }} />
                      ) : (
                        <CheckCircleOutlineOutlined sx={{ fill: "#0E793C" }} />
                      )
                    }
                    label={video.status}
                  />
                </TableCell>
                <TableCell>{video.languages}</TableCell>
                <TableCell align="center">{renderActions(video)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VideosTable;
