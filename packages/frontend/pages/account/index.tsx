import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography, IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function AccountsPage() {
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    password: "password123",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    skills: "React, Material-UI, JavaScript",
  });

  // Handlers
  const handleEditSave = () => {
    setIsEditable(!isEditable);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        {/* Left side fields */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            value={profile.firstName}
            onChange={handleChange}
            name="firstName"
            disabled={!isEditable}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            value={profile.lastName}
            onChange={handleChange}
            name="lastName"
            disabled={!isEditable}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={profile.email}
            onChange={handleChange}
            name="email"
            disabled={!isEditable}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            value={profile.phoneNumber}
            onChange={handleChange}
            name="phoneNumber"
            disabled={!isEditable}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            value={profile.password}
            onChange={handleChange}
            name="password"
            disabled={!isEditable}
            margin="normal"
            type="password"
          />
        </Grid>

        {/* Right side profile picture */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <Avatar src="/profile-pic.jpg" sx={{ width: 100, height: 100, mb: 2 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="primary" component="label">
              <CameraAltIcon />
              <input type="file" hidden />
              <Typography variant="body2">Change Picture</Typography>
            </IconButton>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Full width fields */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="About Me"
            variant="outlined"
            value={profile.aboutMe}
            onChange={handleChange}
            name="aboutMe"
            disabled={!isEditable}
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Skills"
            variant="outlined"
            value={profile.skills}
            onChange={handleChange}
            name="skills"
            disabled={!isEditable}
            multiline
            margin="normal"
          />
        </Grid>

        {/* Edit/Save Button */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
            onClick={handleEditSave}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {isEditable ? "Save" : "Edit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
