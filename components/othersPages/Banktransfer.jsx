import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function BankTransferPayment({ orderId }) {
  const [file, setFile] = useState(null);
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserId(user?.user_id || 0);
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setSnackbar({ open: true, message: 'กรุณาอัปโหลดสลิปการโอน', severity: 'warning' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('user_id', userId);
    formData.append('reference', reference);
    formData.append('slip', file);

    try {
      const response = await fetch(`${API_BASE_URL}/bank-transfers`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: 'ส่งข้อมูลสำเร็จ', severity: 'success' });

        setTimeout(() => {
          window.location.href = '/payment/banktransfer';
        }, 1000);
      } else {
        setSnackbar({ open: true, message: result.message || 'เกิดข้อผิดพลาด', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        ชำระเงินผ่านการโอนบัญชีธนาคาร
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography>ชื่อบัญชี: บริษัท สมาร์ทฟาร์ม จำกัด</Typography>
        <Typography>เลขที่บัญชี: 123-4-56789-0</Typography>
        <Typography>ธนาคาร: กสิกรไทย (KBank)</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="หมายเลขอ้างอิง (ถ้ามี)"
          variant="outlined"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <Button variant="contained" component="label">
          อัปโหลดสลิปการโอน
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Button>

        {file && <Typography>ไฟล์ที่เลือก: {file.name}</Typography>}

        <Button
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการชำระเงิน'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}