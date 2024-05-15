import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { VIDEO_PATH } from "@/hooks/Apihelper";
import { useSnackbar } from "@/store/snackbar";
import { accessTokenAtom } from "@/store/store";
import { useAtom } from "jotai";

interface VideoUploadModalProps {
  open: boolean;
  handleClose: () => void;
  fileName: string | undefined;
  videoId: string | undefined;
}

export const EditVideoModel: React.FC<VideoUploadModalProps> = ({
  open,
  handleClose,
  fileName,
  videoId,
}) => {
  const [videoName, setVideoName] = useState<string>("");
  const snackbar = useSnackbar();
  const theme = useTheme();
  const [accessToken] = useAtom(accessTokenAtom);

  const handleVideoNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoName(event.target.value);
  };

  useEffect(() => {
    if (fileName) {
      const newFileName = fileName.endsWith(".mp4") ? fileName.slice(0, -4) : fileName;
      setVideoName(newFileName);
    }
  }, [fileName, videoId]);

  const onClose = () => {
    // Clear form values
    setVideoName("");
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${VIDEO_PATH}/${videoId}`,
        {
          file_name: `${videoName}.mp4`,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      snackbar("success", "Video Updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error during video update:", error);
      snackbar("error", "Failed to update video. Please try again later.");
      onClose();
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.default",
    boxShadow: 24,
    p: 4,
    border: 2,
    borderColor: theme.palette.primary.main,
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Video Name
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="video-name">Video Name</InputLabel>
            <Input id="video-name" value={videoName} onChange={handleVideoNameChange} />
          </FormControl>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
              }}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </>
      </Box>
    </Modal>
  );
};
