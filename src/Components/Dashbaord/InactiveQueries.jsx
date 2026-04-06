import React, { useState, useEffect } from "react";
import { FiActivity, FiPlus, FiInbox, FiClock, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  addCommentToQuery,
  fetchAllQueries,
  updateQueryStatus,
} from "../../api/queryApi";
import socket from "../../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const InactiveQueries = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [unreadMap, setUnreadMap] = useState({});
  const [queries, setQueries] = useState([]);
  const [name, setName] = useState("");
  const [currentQuery, setCurrentQuery] = useState(null);

  const fetchQueries = async () => {
    try {
      const res = await fetchAllQueries({
        search: searchTerm,
        status: "Inactive",
      });

      setQueries(res.data);
      setName(res.data.name);
      setLoading(false);
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

  const EmptyQueriesState = () => (
    <Paper sx={{ p: isXs ? 4 : 6, textAlign: "center" }}>
      <Box sx={{ color: theme.palette.text.secondary, mb: 2 }}>
        <FiInbox size={isXs ? 48 : 64} />
      </Box>
      <Typography
        variant={isXs ? "h6" : "h5"}
        sx={{ mb: 3, px: isXs ? 1 : 6 }}
        gutterBottom
      >
        No Inactive Queries Found
      </Typography>
    </Paper>
  );

  const handleQueryClick = (query) => {
    setCurrentQuery(query);
    setOpen(true);
  };

  const handleViewQuery = (queryId) => {
    navigate(`/messages/${queryId}`);
  };

  const handleReactiveQuery = async () => {
    try {
      await addCommentToQuery({
        comment: "Query has been reactivated.",
        queryId: currentQuery._id,
      });

      await updateQueryStatus({
        queryId: currentQuery._id,
        status: "Active",
      });
      fetchQueries();
      setCurrentQuery(null);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: isXs ? 2 : 3, mt: isXs ? 8 : 10 }}>
      {/* Statistics Grid */}

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
        >
          {/* <StatCardComponent
            title="Inactive Queries"
            value={stats.activeQueries}
            icon={<FiActivity size={isXs ? 24 : 32} />}
            color="primary"
          /> */}
        </Box>
      </Box>

      {/* Recent Queries Section */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Section Header */}
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
              My Inactive Queries ({queries?.queries?.length})
            </Typography>
          </Box>

          {/* Search Box */}
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

          {/* Table / Empty / Loading */}
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
                  sx={{ minWidth: isXs ? 300 : 800, tableLayout: "fixed" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: isXs ? "10%" : "10%",
                          fontSize: isXs ? "10px" : "0.875rem",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "20%" : "60%",
                          fontSize: isXs ? "10px" : "0.875rem",
                        }}
                      >
                        Query
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "20%" : "15%",
                          fontSize: isXs ? "10px" : "0.875rem",
                        }}
                      >
                        Threads
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "15%" : "15%",
                          fontSize: isXs ? "10px" : "0.875rem",
                        }}
                      >
                        Unread
                      </TableCell>
                      <TableCell
                        sx={{
                          width: isXs ? "20%" : "12%",
                          fontSize: isXs ? "10px" : "0.875rem",
                        }}
                      >
                        Status
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

                          <TableCell align="center">
                            <Button
                              sx={{
                                fontSize: isXs ? "10px" : "10px",
                                padding: "10px !important",
                              }}
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQueryClick(query);
                              }}
                            >
                              Re-active
                            </Button>
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

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Your Query"}</DialogTitle>
        <DialogContent
          dividers
          sx={{
            maxHeight: { xs: "70vh", sm: "75vh" }, // ✅ Responsive max height
            overflowY: "auto",
            paddingBottom: "20px",
          }}
        >
          {/* ===== Main Query Info ===== */}
          <div style={{ marginBottom: "10px" }}>
            <p style={{ margin: 0, fontWeight: "500" }}>
              {currentQuery?.description}
            </p>
            <small style={{ color: "gray" }}>
              {new Date(currentQuery?.updatedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <Divider sx={{ margin: "15px 0" }} />

          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Add comment here (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Type your comment..."
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          {/* ===== Comments Section ===== */}
          <div>
            {currentQuery?.comments?.length === 0 ? (
              <p style={{ color: "gray" }}>No comments yet.</p>
            ) : (
              currentQuery?.comments?.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    borderRadius: "8px",
                    marginBottom: "10px",
                    background: "#f9f9f9",
                    padding: "8px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0" }}>{comment.text}</p>
                  <small style={{ color: "gray" }}>
                    {new Date(comment.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleReactiveQuery()}>Re-active</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InactiveQueries;
