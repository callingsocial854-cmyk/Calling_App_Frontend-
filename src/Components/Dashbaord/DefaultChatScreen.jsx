import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Phone, Menu } from "@mui/icons-material";

const DefaultChatScreen = () => {
  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          maxWidth: 420,
          width: "100%",
          padding: 4,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Icon Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 3,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 140,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Laptop Screen */}
            <Box
              sx={{
                width: 120,
                height: 80,
                border: "3px solid #333",
                borderRadius: 2,
                backgroundColor: "#fff",
                position: "relative",
                display: "flex",
              }}
            >
              {/* Green sidebar with menu lines */}
              <Box
                sx={{
                  width: "40%",
                  backgroundColor: "#25d366",
                  borderRadius: "4px 0 0 4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  padding: 1,
                }}
              >
                <Menu sx={{ color: "#fff", fontSize: 12 }} />
                <Box
                  sx={{
                    width: "70%",
                    height: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: "70%",
                    height: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: "70%",
                    height: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
              </Box>

              {/* White section with phone icon */}
              <Box
                sx={{
                  width: "60%",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <Phone
                  sx={{
                    color: "#25d366",
                    fontSize: 28,
                    transform: "rotate(90deg)",
                  }}
                />
              </Box>
            </Box>

            {/* Laptop Base */}
            <Box
              sx={{
                position: "absolute",
                bottom: -8,
                width: 140,
                height: 6,
                backgroundColor: "#333",
                borderRadius: "0 0 8px 8px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 30,
                  height: 2,
                  backgroundColor: "#333",
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            color: "#111",
            marginBottom: 2,
            fontSize: "1.375rem",
          }}
        >
          Download ConnectQuery app for Mobile
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "#667781",
            marginBottom: 3,
            lineHeight: 1.6,
            fontSize: "0.875rem",
          }}
        >
          To make voice calls and enjoy a smoother experience, download the
          ConnectQuery mobile app from the Play Store.
        </Typography>

        {/* Download Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d4f4dd",
            color: "#06843a",
            textTransform: "none",
            padding: "8px 28px",
            borderRadius: 6,
            fontWeight: 500,
            fontSize: "0.9375rem",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#c5ead0",
              boxShadow: "none",
            },
          }}
        >
          Download
        </Button>
      </Paper>
    </Box>
  );
};

export default DefaultChatScreen;
