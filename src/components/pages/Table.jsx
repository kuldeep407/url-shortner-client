import React, { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { AppContext } from "../../context/AppContext";
import ClicksOverTimeChart from "./ClicksOverTimeChart";
import DevicePieChart from "./DevicePieChart";
import QRCode from "react-qr-code";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function BasicTable() {
  const {
    data,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    redirectAndLog,
    searchLink,
    fetchLinks,
  } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [query, setQuery] = useState("");
  const [activeQR, setActiveQR] = useState(null);

  const handleOpen = (analytics, url) => {
    setSelectedAnalytics(analytics);
    setSelectedUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAnalytics([]);
  };

  const handleSearch = () => {
    const value = query.trim();

    if (value === "") {
      fetchLinks();
    } else {
      searchLink(value);
    }

    setCurrentPage(1);
  };

  const totalCount = data.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-[80%] mx-auto mt-[30px]">
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Link"
          className="border border-gray-300 rounded-sm outline-none px-3 py-3 w-full sm:w-[300px] md:w-[400px] mb-2 sm:mb-5"
        />
        <button
          onClick={handleSearch}
          className="bg-[#ff4141] text-white px-4 py-3 sm:px-5 sm:py-2.5 md:px-6 md:py-3 mb-5 font-medium text-sm sm:text-base rounded-sm hover:bg-[#e63a3a] transition-colors w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="short links table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>
                Original Url
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Short Url</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }}>
                QR Code
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Clicks</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Expiration Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ width: "25%", wordBreak: "break-word" }}>
                  <a href={row.originalUrl}>{row.originalUrl}</a>
                </TableCell>

                <TableCell>
                  <span
                    onClick={() => redirectAndLog(row.shortId)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.shortUrl}
                  </span>
                </TableCell>

                <TableCell>
                  <button
                    onClick={() =>
                      setActiveQR((prev) => (prev === row._id ? null : row._id))
                    }
                    className="text-sm"
                  >
                    {activeQR === row._id ? "Hide QR" : "Show QR"}
                  </button>

                  {activeQR === row._id && (
                    <div className="mt-2 bg-white p-2 rounded shadow-md inline-block">
                      <QRCode value={row.originalUrl} size={100} />
                    </div>
                  )}
                </TableCell>

                <TableCell>{row.clicks}</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {row.expiration
                    ? new Date(row.expiration) > new Date()
                      ? "Active"
                      : "Expired"
                    : "No Expiration"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpen(row.analytics, row.originalUrl)}
                    sx={{
                      backgroundColor: "#ff4141",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      mb: 1.5,
                      fontWeight: 500,
                      fontSize: "1rem",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#e63a3a",
                      },
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setCurrentPage(1);
          }}
        />
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Analytics for: <strong>{selectedUrl}</strong>
          </Typography>

          <ClicksOverTimeChart analytics={selectedAnalytics} />
          <DevicePieChart analytics={selectedAnalytics} />

          <div className="mt-5">
            {selectedAnalytics.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Timestamp</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Device</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Browser</strong>
                    </TableCell>
                    <TableCell>
                      <strong>IP</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Location</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedAnalytics.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{entry.device || "-"}</TableCell>
                      <TableCell>{entry.browser || "-"}</TableCell>
                      <TableCell>{entry.ip || "-"}</TableCell>
                      <TableCell>{entry.location || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2">
                No analytics data available for this URL.
              </Typography>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
