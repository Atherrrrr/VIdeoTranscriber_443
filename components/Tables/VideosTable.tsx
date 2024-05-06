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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/router";
import { AutorenewOutlined, CheckCircleOutlineOutlined } from "@mui/icons-material";

export interface VideoData {
  user_id: string;
  languages: string;
  video_id: string;
  file_name: string;
  time_stamp: string;
  video_uploaded: boolean;
  status: string;
  srt_en: boolean;
  srt_fr: boolean;
  srt_tr: boolean;
  srt_ar: boolean;
  srt_de: boolean;

  // Added properties specific to processed videos
  name: string; // name of the video without the file extension
  fileType: string; // type of the file determined by the extension
  time: string; // formatted time string
  date: string; // formatted date string
  languagesFullForm: string; // full form of the languages involved
}

interface VideosTableProps {
  data: VideoData[];
  onDelete: (videoId: string) => Promise<void>;
}
const VideosTable: React.FC<VideosTableProps> = ({ data, onDelete }) => {
  const theme = useTheme();
  const router = useRouter();

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
            {data.map((video, index) => (
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
