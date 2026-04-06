import React, { useState, useEffect } from "react";
import { FiActivity, FiPlus, FiInbox, FiClock, FiSearch } from "react-icons/fi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Skeleton,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQueriesThunk } from "../../features/queryThunks";
import { fetchAllQueries } from "../../api/queryApi";
import db from "../../app/db";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  "& .MuiTableHead-root": {
    backgroundColor: theme.palette.grey[50],
  },
  "& .MuiTableCell-head": {
    fontWeight: 600,
    color: theme.palette.text.secondary,
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
  },
  "& .MuiTableCell-body": {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
}));

const QueryRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[1],
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const Dashboard = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [unreadMap, setUnreadMap] = useState({});
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useSelector((state) => state.network.isOnline);

  const fetchQueries = async () => {
    try {
      if (isOnline) {
        const res = await fetchAllQueries({
          search: searchTerm,
          status: "Active",
        });
        setQueries(res.data);
        setName(res.data.name);
        setLoading(false);
        await db.queries.clear();
        await db.queries.bulkPut(res?.data?.queries);
      } else {
        const localQueries = await db.queries.toArray();
        setQueries({ queries: localQueries });
        setName("Offline User");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [searchTerm]);

  useEffect(() => {
    socket.emit("getUnreadCount");

    socket.on("getUnreadCountResponse", (res) => {
      console.log(res);
      if (!res?.data) return;

      const map = {};
      res.data.forEach((item) => {
        map[item.queryId] = {
          unreadCount: item.unreadCount,
          totalAgents: item.totalAgents,
        };
      });

      setUnreadMap(map);
    });

    return () => {
      socket.off("getUnreadCountResponse");
    };
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleViewQuery = (queryId) => {
    // navigate("/messages", { state: { queryId } });
    navigate(`/messages/${queryId}`);
  };

  const EmptyQueriesState = () => (
    <Paper sx={{ p: isXs ? 4 : 6, textAlign: "center" }}>
      <Box sx={{ color: theme.palette.text.secondary, mb: 2 }}>
        <FiInbox size={isXs ? 48 : 64} />
      </Box>
      <Typography variant={isXs ? "h6" : "h5"} gutterBottom>
        No Queries Found
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, px: isXs ? 1 : 6 }}
      >
        No queries match your current filters. Try adjusting your search or
        create a new query.
      </Typography>
      <Button
        variant="contained"
        startIcon={<FiPlus />}
        onClick={() => navigate("/newQueries")}
        size={isXs ? "medium" : "large"}
      >
        Create New Query
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ p: isXs ? 2 : 3, mt: isXs ? 8 : 10 }}>
      <Box sx={{ mb: isXs ? 2 : 4 }}>
        <Typography variant={isXs ? "h5" : "h4"} fontWeight="700" gutterBottom>
          Welcome {name}
        </Typography>
      </Box>

      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        ></Box>
      </Box>

      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: isXs ? "column" : "row",
              gap: isXs ? 2 : 0,
              padding: isXs ? "20px 10px 10px 10px" : "25px 10px 10px 10px",
            }}
          >
            <Typography
              variant={isXs ? "h6" : "h5"}
              fontWeight="600"
              textAlign={isXs ? "center" : "left"}
            >
              My Active Queries ({queries?.queries?.length})
            </Typography>
            {queries?.queries?.length > 0 && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => navigate("/newQueries")}
                sx={{
                  fontSize: isXs ? "12px" : "25px",
                  width: isXs ? "100%" : "auto",
                }}
              >
                New Query
              </Button>
            )}
          </Box>

          <Box sx={{ px: isXs ? 2 : 3, pb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: isXs ? "13px" : "16px",
                },
              }}
            />
          </Box>

          <Box sx={{ p: 1 }}>
            {loading ? (
              <Box sx={{ p: 2 }}>
                {Array.from(new Array(5)).map((_, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 2, mb: 2, p: 2 }}>
                    <Skeleton variant="text" width="10%" height={40} />
                    <Skeleton variant="text" width="40%" height={40} />
                    <Skeleton variant="text" width="10%" height={40} />
                    <Skeleton variant="text" width="10%" height={40} />
                    <Skeleton variant="text" width="20%" height={40} />
                  </Box>
                ))}
              </Box>
            ) : queries?.queries?.length > 0 ? (
              <StyledTableContainer
                component={Paper}
                elevation={0}
                sx={{
                  maxHeight: isXs ? 400 : 500,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "4px",
                  },
                }}
              >
                <Table
                  stickyHeader
                  sx={{ minWidth: isXs ? 300 : 800, tableLayout: "fixed" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: isXs ? "10%" : "10%",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 2,
                          fontWeight: "600",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "50%" : "60%",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 2,
                          fontWeight: "600",
                        }}
                      >
                        Query
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "20%" : "15%",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 2,
                          fontWeight: "600",
                        }}
                      >
                        Threads
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "20%" : "15%",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 2,
                          fontWeight: "600",
                        }}
                      >
                        Unread
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {queries?.queries?.map((query, index) => {
                      const unreadData = unreadMap[query._id] || {};
                      const unreadCount = unreadData.unreadCount || 0;
                      const totalAgents =
                        unreadData.totalAgents ??
                        query?.acceptedAgents?.length ??
                        0;

                      return (
                        <QueryRow
                          key={query._id}
                          hover
                          onClick={() => handleViewQuery(query._id)}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              #{index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: isXs ? 2 : 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {query.description}
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight="500"
                              sx={{ marginTop: "10px" }}
                            >
                              {formatDate(query.updatedAt)}{" "}
                              {formatTime(query.updatedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={totalAgents}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {unreadCount > 0 ? (
                              <Chip
                                label={unreadCount}
                                size="small"
                                color="error"
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                0
                              </Typography>
                            )}
                          </TableCell>
                        </QueryRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            ) : (
              <EmptyQueriesState />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
