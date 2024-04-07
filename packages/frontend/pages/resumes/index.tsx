import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Paper,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const resumes = [
  { id: 1, title: "Software Engineer Resume", content: "Content of the first resume..." },
  { id: 2, title: "Project Manager Resume", content: "Content of the second resume..." },
  // Add more resume data here
];

const ResumePage = () => {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Handle file upload logic here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = (id: any) => {
    // Handle delete logic here
    console.log("Delete resume with id:", id);
  };

  const handleEdit = (id: any) => {
    // Handle edit logic here
    console.log("Edit resume with id:", id);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resumes
      </Typography>
      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item key={resume.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {resume.title}
                </Typography>
                <Typography variant="body2">{resume.content}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(resume.id)} startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(resume.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        variant="outlined"
        sx={{ p: 3, mt: 3, textAlign: "center", ...(isDragActive && { bgcolor: "action.hover" }) }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the resumes here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop some resumes here, or click to select resumes</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ResumePage;
