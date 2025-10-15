import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { UploadFile, Share, Email } from '@mui/icons-material';

export default function ContractDashboard() {
  const [search, setSearch] = useState('');
  const [contracts, setContracts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('https://contract-backend-production-4875.up.railway.app/docs#/default/upload_contract_upload_post', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newContract = {
        name: uploadedFile.name,
        summary: data.summary || 'No summary returned',
      };

      setContracts((prev) => [...prev, newContract]);
      setAuditLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          action: `Uploaded contract: ${uploadedFile.name}`,
          user: 'CurrentUser',
        },
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload and process contract.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Contract Review Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button variant="contained" component="label" startIcon={<UploadFile />}>
            Upload Contract
            <input hidden type="file" onChange={handleFileUpload} />
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Audit Logs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Uploaded Contracts</Typography>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Summary</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract, index) => (
                  <TableRow key={index}>
                    <TableCell>{contract.name}</TableCell>
                    <TableCell>{contract.summary}</TableCell>
                    <TableCell align="right">
                      <Button startIcon={<Share />}>Share</Button>
                      <Button startIcon={<Email />}>Email</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Audit Log</Typography>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs
                  .filter((log) => log.action.includes(search))
                  .map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
