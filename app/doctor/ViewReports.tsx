import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Platform, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { showToast } from '../../components/ui/CustomToast';
import Toast from 'react-native-toast-message';
import * as QRCode from 'qrcode';

interface INRReport {
  inr_value: number;
  location_of_test: string;
  date: string;
  file_name?: string;
  file_path?: string;
  type?: string;
  instructions?: string;
}

interface ReportData {
  patient_ID:string;
  patient_name: string;
  inr_report: INRReport;
}

interface PatientDetailResponse {
  patient: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    contact: string;
    therapy: string;
    therapy_start_date: string;
    target_inr: {
      min: number;
      max: number;
    };
    // Other fields
  };
  user: any;
  chart_data: any[];
  missed_doses: string[];
}

const getStatusColor = (value: number) => {
  if (value < 2.0) return '#2196F3'; // Low - Blue
  if (value >= 2.0 && value <= 3.0) return '#4CAF50'; // Normal - Green
  if (value > 3.0 && value < 4.0) return '#FF9800'; // High - Orange
  return '#E41E4F'; // Critical - Red (using the app's primary color for critical)
};

const getStatus = (value: number) => {
  if (value < 2.0) return 'Low';
  if (value >= 2.0 && value <= 3.0) return 'Normal';
  if (value > 3.0 && value < 4.0) return 'High';
  return 'Critical';
};

const formatDate = (dateString: string) => {
  // Handle various date formats
  let date: Date;
  
  // Try to parse if it's already a valid ISO string
  if (dateString.includes('T') || dateString.includes('-')) {
    date = new Date(dateString);
  } else if (dateString.includes('/')) {
    // Handle DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      date = new Date(dateString);
    }
  } else {
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if parsing fails
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Function to fetch patient details
const fetchPatientDetails = async (patientId: string): Promise<PatientDetailResponse | null> => {
  try {
    const response = await apiClient.get<PatientDetailResponse>(`/doctor/view-patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return null;
  }
};

const generateQRCode = async (data: string): Promise<string> => {
  try {
    return new Promise<string>((resolve, reject) => {
      QRCode.toString(data, {
        type: 'svg',
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (err: Error | null | undefined, svgString: string) => {
        if (err) {
          console.error('Error generating QR code:', err);
          resolve('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="#ffffff"/>
              <text x="60" y="60" font-family="Arial" font-size="12" text-anchor="middle">QR Error</text>
            </svg>`
          ));
        } else {
          // Convert SVG to data URL
          const dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
          resolve(dataURL);
        }
      });
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Return empty string in case of error
    return '';
  }
};

// Function to create HTML content for the PDF
const createReportHTML = async (report: ReportData, patientDetails?: PatientDetailResponse): Promise<string> => {
  const status = getStatus(report.inr_report.inr_value);
  const statusColor = getStatusColor(report.inr_report.inr_value);
  
  // Format the therapy start date if available
  const therapyStartDateFormatted = patientDetails?.patient?.therapy_start_date 
    ? formatDate(patientDetails.patient.therapy_start_date) 
    : 'N/A';
    
  // Generate a report ID
  const reportId = `${report.patient_ID}-${new Date().getTime().toString().substring(8)}`;
  
  // Create QR code data
  const qrCodeData = JSON.stringify({
    reportId: reportId,
    patientId: report.patient_ID,
    patientName: report.patient_name,
    inrValue: report.inr_report.inr_value,
    testDate: report.inr_report.date,
    generatedAt: new Date().toISOString(),
    verificationUrl: `https://vitalink.com/verify/${reportId}`
  });
  
  // Generate QR code data URL
  const qrCodeDataURL = await generateQRCode(qrCodeData);
  
  return `    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', 'Helvetica', sans-serif;
            padding: 0;
            color: #2D3748;
            background-color: #f3f4f6;
            line-height: 1.6;
          }
          
          .page-container {
            max-width: 100%;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
          }
          
          /* Header Styles */
          .header {
            background: linear-gradient(135deg, #E41E4F, #ff6b81);
            color: white;
            padding: 20px 25px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: -150px;
            right: -150px;
          }
          
          .header::after {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            bottom: -100px;
            left: -100px;
          }
          
          .logo-container {
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 5;
          }
          
          .logo {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .logo span {
            color: #fff;
            font-weight: 300;
            opacity: 0.9;
          }
          
          h1 {
            font-size: 26px;
            font-weight: 600;
            margin: 12px 0 8px;
            position: relative;
            z-index: 5;
            letter-spacing: 0.5px;
          }
          
          .report-date {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 5;
          }
          
          /* Content Styles */
          .content {
            padding: 25px;
          }
          
          .card {
            background-color: white;
            border-radius: 12px;
            margin-bottom: 28px;
            box-shadow: 0 2px 14px rgba(0, 0, 0, 0.06);
            overflow: hidden;
            border: 1px solid #edf2f7;
          }
          
          .card-header {
            background-color: #f8fafc;
            padding: 16px 22px;
            border-bottom: 1px solid #edf2f7;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2D3748;
            display: flex;
            align-items: center;
          }
          
          .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 18px;
            background-color: #E41E4F;
            margin-right: 12px;
            border-radius: 2px;
          }
          
          .card-body {
            padding: 10px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .info-item {
            margin-bottom: 12px;
          }
          
          .info-label {
            font-weight: 500;
            color: #718096;
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 16px;
            color: #2D3748;
            font-weight: 500;
          }
          
          /* Highlight Box */
          .highlight-box {
            background-color: ${statusColor};
            color: white;
            border-radius: 10px;
            padding: 10px 5px;
            text-align: center;
            margin: 5px 0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .highlight-box::before {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: -120px;
            right: -80px;
          }
          
          .status-label {
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 6px;
            font-weight: 500;
          }
          
          .status-value {
            font-size: 26px;
            font-weight: 700;
          }
          
          .inr-value {
            font-size: 42px;
            font-weight: 700;
            margin: 12px 0;
            letter-spacing: -1px;
          }
          
          /* Table Styles */
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 18px 0;
            font-size: 14px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          }
          
          th {
            background-color: #f8fafc;
            padding: 14px 18px;
            text-align: left;
            font-weight: 600;
            color: #4A5568;
            border-bottom: 2px solid #edf2f7;
          }
          
          td {
            padding: 14px 18px;
            border-bottom: 1px solid #edf2f7;
          }
          
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          .status-cell {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            min-width: 80px;
          }
          
          .status-low {
            background-color: #2196F3;
          }
          
          .status-normal {
            background-color: #4CAF50;
          }
          
          .status-high {
            background-color: #FF9800;
          }
          
          .status-critical {
            background-color: #E41E4F;
          }
          
          /* Recommendations Section */
          .recommendations {
            padding: 5px 0;
          }
          
          .recommendation-text {
            background-color: #f8fafc;
            border-left: 4px solid ${statusColor};
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 6px;
            color: #4A5568;
            font-size: 15px;
          }
          
          .next-steps {
            margin-top: 15px;
          }
          
          .next-steps h4 {
            font-size: 17px;
            font-weight: 600;
            color: #2D3748;
            margin-bottom: 10px;
          }
          
          .steps-list {
            list-style-position: inside;
            margin-left: 5px;
          }
          
          .steps-list li {
            margin-bottom: 8px;
            position: relative;
            padding-left: 28px;
            list-style-type: none;
          }
          
          .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #4CAF50;
            font-weight: bold;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            background-color: rgba(76, 175, 80, 0.1);
            border-radius: 50%;
          }
          
          /* Authentication Section */
          .authentication-card {
            background-color: white;
          }
          
          .authentication-container {
            display: flex;
            justify-content: center;
          }
          
          .qr-section {
            display: flex;
            align-items: center;
            padding: 10px 0;
          }
          
          .qr-code {
            background-color: white;
            display: inline-block;
            padding: 12px;
            border-radius: 8px;
            margin-right: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            border: 1px solid #edf2f7;
          }
          
          .authentication-info {
            flex: 1;
          }
          
          .report-id {
            font-family: 'Courier New', monospace;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          
          .qr-note {
            font-size: 12px;
            color: #718096;
            margin-top: 12px;
            font-style: italic;
          }
          
          /* Footer Styles */
          .footer {
            background-color: #2D3748;
            padding: 25px 22px;
            color: white;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
          }
          
          .footer::before {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
            bottom: -100px;
            right: -100px;
          }
          
          .footer-logo {
            margin-right: 20px;
          }
          
          .logo-small {
            font-size: 20px;
            font-weight: 700;
            color: white;
          }
          
          .logo-small span {
            color: #ff6b81;
            font-weight: 300;
          }
          
          .footer-content {
            flex: 1;
          }
          
          .footer p {
            margin-bottom: 5px;
            font-size: 12px;
            opacity: 0.9;
          }
          
          .footer .logo-text {
            color: #ff6b81;
            font-weight: 600;
          }
          
          @media print {
            body {
              background-color: white;
            }
            .page-container {
              box-shadow: none;
              margin: 0;
              margin-inline: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="header">
            <div class="logo-container">
              <div class="logo">Vita<span>Link</span></div>
            </div>
            <h1>Patient INR Report</h1>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>
          
          <div class="content">
            <!-- Patient Information Section -->
            <div class="card">
              <div class="card-header">
                <div class="section-title">Patient Information</div>
              </div>
              <div class="card-body">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Patient Name</div>
                    <div class="info-value">${report.patient_name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Patient ID</div>
                    <div class="info-value">${report.patient_ID}</div>
                  </div>
                  
                  ${patientDetails ? `
                    <div class="info-item">
                      <div class="info-label">Age</div>
                      <div class="info-value">${patientDetails.patient.age} years</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Gender</div>
                      <div class="info-value">${patientDetails.patient.gender}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Contact</div>
                      <div class="info-value">${patientDetails.patient.contact}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Therapy</div>
                      <div class="info-value">${patientDetails.patient.therapy || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Therapy Start Date</div>
                      <div class="info-value">${therapyStartDateFormatted}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Target INR Range</div>
                      <div class="info-value">${patientDetails.patient.target_inr ? `${patientDetails.patient.target_inr.min} - ${patientDetails.patient.target_inr.max}` : 'N/A'}</div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
            
            <!-- Current INR Test -->
            <div class="card">
              <div class="card-header">
                <div class="section-title">Current INR Test Results</div>
              </div>
              <div class="card-body">
                <div class="highlight-box">
                  <div class="status-label">INR Value</div>
                  <div class="inr-value">${report.inr_report.inr_value.toFixed(1)}</div>
                  <div class="status-value">${status}</div>
                </div>
                
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Test Type</div>
                    <div class="info-value">${report.inr_report.type || 'INR Test'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Test Location</div>
                    <div class="info-value">${report.inr_report.location_of_test}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Test Date</div>
                    <div class="info-value">${formatDate(report.inr_report.date)}</div>
                  </div>
                  ${report.inr_report.instructions ? `
                  <div class="info-item">
                    <div class="info-label">Instructions</div>
                    <div class="info-value">${report.inr_report.instructions}</div>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>
            
            <!-- INR History Table -->
            ${patientDetails && patientDetails.chart_data && patientDetails.chart_data.length > 0 ? `
              <div class="card">
                <div class="card-header">
                  <div class="section-title">INR History</div>
                </div>
                <div class="card-body">
                  <table>
                    <thead>
                      <tr>
                        <th>Test Date</th>
                        <th>INR Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${patientDetails.chart_data.slice(0, 5).map(item => {
                        const itemStatus = getStatus(item.inr_value);
                        const statusClass = itemStatus.toLowerCase().replace(' ', '-');
                        return `
                          <tr>
                            <td>${formatDate(item.date)}</td>
                            <td style="text-align: center">${item.inr_value.toFixed(1)}</td>
                            <td><span class="status-cell status-${statusClass}">${itemStatus}</span></td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}
            
          </div>
          
          <div class="footer">
            <div class="footer-logo">
              <div class="logo-small">Vita<span>Link</span></div>
            </div>
            <div class="footer-content">
              <p>This is an official medical document generated by the <span class="logo-text">VitaLink</span> system</p>
              <p>&copy; ${new Date().getFullYear()} PSG Institute of Medical Sciences & Research. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Function to generate and share the PDF
const generateAndSharePDF = async (report: ReportData): Promise<void> => {
  try {
    // First show a loading toast
    showToast({
      title: 'Generating Report',
      message: 'Please wait while we prepare the report...',
      type: 'info'
    });
    
    // Fetch more detailed patient information
    const patientDetails = await fetchPatientDetails(report.patient_ID);
    
    // Create the HTML content
    const htmlContent = await createReportHTML(report, patientDetails || undefined);
    
    // Generate the PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    
    // Get the file name
    const filename = `VitaLink_Report_${report.patient_ID}_${new Date().getTime()}.pdf`;
    
    // New file path with proper name
    const pdfPath = FileSystem.documentDirectory + filename;
    
    // Move the file to give it a proper name
    await FileSystem.moveAsync({
      from: uri,
      to: pdfPath,
    });
    
    // Check if sharing is available
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'View Report',
        UTI: 'com.adobe.pdf',
      });
      
      showToast({
        title: 'Report Shared',
        message: 'Your report has been successfully shared',
        type: 'success'
      });
    } else {
      showToast({
        title: 'Sharing Unavailable',
        message: 'Cannot share files on this device',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    showToast({
      title: 'Error',
      message: 'Failed to generate report. Please try again.',
      type: 'error'
    });
  }
};

const viewPDFInApp = async (report: ReportData): Promise<void> => {
  try {
    showToast({
      title: 'Loading Report',
      message: 'Please wait while we prepare the report...',
      type: 'info'
    });

    const patientDetails = await fetchPatientDetails(report.patient_ID);
    const htmlContent = await createReportHTML(report, patientDetails || undefined);

    // This will open the PDF in a print preview modal
    await Print.printAsync({
      html: htmlContent,
      // Optional: customize the print options
      printerUrl: undefined, // This ensures it opens in preview mode
    });

    showToast({
      title: 'Report Loaded',
      message: 'Report opened in preview mode',
      type: 'success'
    });

  } catch (error) {
    console.error('Error viewing PDF:', error);
    showToast({
      title: 'Error',
      message: 'Failed to load report. Please try again.',
      type: 'error'
    });
  }
};

interface ReportOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  report: ReportData | null;
  onGeneratePDF: () => void;
  onDownloadPDF: () => void;
}

// Modal component to show report options
const ReportOptionsModal: React.FC<ReportOptionsModalProps> = ({ 
  isVisible, 
  onClose, 
  report, 
  onGeneratePDF, 
  onDownloadPDF 
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Options</Text>
            <Text style={styles.modalSubtitle}>Patient: {report?.patient_name}</Text>
            
            {/* View PDF Option */}
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                onClose();
                if (report) viewPDFInApp(report);
              }}
            >
              <Ionicons name="eye" size={24} color="#4CAF50" />
              <View style={styles.modalOptionTextContainer}>
                <Text style={styles.modalOptionTitle}>View Report</Text>
                <Text style={styles.modalOptionDescription}>View the PDF report within the app</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Generate PDF Option */}
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                onClose();
                onGeneratePDF();
              }}
            >
              <Ionicons name="share" size={24} color="#2196F3" />
              <View style={styles.modalOptionTextContainer}>
                <Text style={styles.modalOptionTitle}>Share Report</Text>
                <Text style={styles.modalOptionDescription}>Share the PDF report with others</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Download PDF Option */}
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                onClose();
                onDownloadPDF();
              }}
            >
              <Ionicons name="download" size={24} color="#E41E4F" />
              <View style={styles.modalOptionTextContainer}>
                <Text style={styles.modalOptionTitle}>Download Report</Text>
                <Text style={styles.modalOptionDescription}>Save the PDF report to device</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function ViewReports() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'today' | 'all'>('today');
  const [savedFilesModalVisible, setSavedFilesModalVisible] = useState(false);
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  const queryclient = useQueryClient();
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  
  const {data:patientReport, isLoading, isError, error} = useQuery({
    queryKey: ["patient_reports", filterType],
    queryFn: async () => {
       const response = await apiClient.get<{reports:ReportData[]}>(`/doctor/reports?typ=${filterType}`)
       return response.data.reports
    }
  })

  const fetchReports = async () => {
    await queryclient.invalidateQueries({queryKey:["patient_reports"]})
  }

  // Report item press handler
  const handleReportPress = (report: ReportData) => {
    setSelectedReport(report);
    setModalVisible(true);
  }

  // Safe handlers for modal actions
  const handleGeneratePDF = () => {
    if (selectedReport) {
      generateAndSharePDF(selectedReport);
    }
  }

  const handleDownloadPDF = () => {
    if (selectedReport) {
      generateAndDownloadPDF(selectedReport);
    }
  }

  const generateAndDownloadPDF = async (report: ReportData): Promise<void> => {
  try {
    showToast({
      title: 'Generating Report',
      message: 'Please wait while we prepare the report for download...',
      type: 'info'
    });

    const patientDetails = await fetchPatientDetails(report.patient_ID);
    const htmlContent = await createReportHTML(report, patientDetails || undefined);
    const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });

    if (Platform.OS === 'android') {
      const filename = `VitaLink_Report_${report.patient_name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      
      try {
        const downloadsDir = FileSystem.documentDirectory + 'Downloads/';
        const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
        
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        }

        const destinationPath = downloadsDir + filename;
        console.log(destinationPath)
        await FileSystem.copyAsync({
          from: uri,
          to: destinationPath
        });

        showToast({
          title: 'Download Complete',
          message: `Report saved to app Downloads folder as ${filename}`,
          type: 'success'
        });

      } catch (error) {
        console.error('Error saving file:', error);
        showToast({
          title: 'Save Error',
          message: 'Failed to save file to Downloads folder. Please try sharing instead.',
          type: 'error'
        });
      }

      } else if (Platform.OS === 'ios') {
      const filename = `VitaLink_Report_${report.patient_name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      
      try {
        const documentsPath = FileSystem.documentDirectory + filename;
        console.log(documentsPath)
        await FileSystem.copyAsync({
          from: uri,
          to: documentsPath
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(documentsPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save PDF Report',
            UTI: 'com.adobe.pdf',
            saveToFiles: true,
          } as any);

          showToast({
            title: 'Save Dialog Opened',
            message: 'Choose a location to save your PDF report.',
            type: 'success'
          });
        } else {
          showToast({
            title: 'File Saved',
            message: `Report saved to app documents as ${filename}`,
            type: 'success'
          });
        }
        } catch (error) {
        console.error('Error saving file:', error);
        showToast({
          title: 'Save Error',
          message: 'Failed to save file. Please try sharing instead.',
          type: 'error'
        });
      }

    } else {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save PDF Report',
          UTI: 'com.adobe.pdf',
          saveToFiles: true,
        } as any);

        showToast({
          title: 'Save Dialog Opened',
          message: 'Choose a location to save your PDF report.',
          type: 'success'
        });
      } else {
        showToast({
          title: 'Save Unavailable',
          message: 'File saving is not available on this platform.',
          type: 'error'
        });
      }
    }

  } catch (error) {
    console.error('Error generating or saving PDF:', error);
    showToast({
      title: 'Error',
      message: 'Failed to generate or save the report. Please try again.',
      type: 'error'
    });
    }
  };


  const renderReportItem = ({ item }: { item: ReportData }) => {
    const status = getStatus(item.inr_report.inr_value);
    const statusColor = getStatusColor(item.inr_report.inr_value);
    
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => handleReportPress(item)}
      >
        <View style={styles.reportHeader}>
          <View>
            <Text style={styles.patientName}>Patient: {item.patient_name}</Text>
            <Text style={styles.patientId}>Location: {item.inr_report.location_of_test}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>Status: {status}</Text>
          </View>
        </View>
        <View style={styles.reportContent}>
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>Test Type:</Text>
            <Text style={styles.detailValue}>{item.inr_report.type || 'INR Test'}</Text>
          </View>
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>INR Value:</Text>
            <Text style={styles.detailValue}>{item.inr_report.inr_value.toFixed(1)} INR</Text>
          </View>
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(item.inr_report.date)}</Text>
          </View>
          {item.inr_report.instructions && (
            <View style={styles.reportDetail}>
              <Text style={styles.detailLabel}>Instructions:</Text>
              <Text style={styles.detailValue}>{item.inr_report.instructions}</Text>
            </View>
          )}
          {item.inr_report.file_name && (
            <View style={styles.reportDetail}>
              <Text style={styles.detailLabel}>Document:</Text>
              <Text style={styles.detailValue}>{item.inr_report.file_name}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => handleReportPress(item)}
        >
          <Text style={styles.viewDetailsText}>View Full Report</Text>
          <Ionicons name="document-text-outline" size={16} color="#E41E4F" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={48} color="#999" />
      <Text style={styles.emptyText}>No reports found</Text>
      <Text style={styles.emptySubtext}>
        {filterType === 'today' 
          ? 'No reports submitted today' 
          : 'No reports available'
        }</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'today' && styles.activeTab]}
          onPress={() => setFilterType('today')}
        >
          <Text style={[styles.filterTabText, filterType === 'today' && styles.activeTabText]}>
            Today's Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'all' && styles.activeTab]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterTabText, filterType === 'all' && styles.activeTabText]}>
            All Reports</Text>
        </TouchableOpacity>
      </View>
      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E41E4F" />
          <Text style={styles.loaderText}>Loading reports...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#E41E4F" />
          <Text style={styles.errorText}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchReports}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={patientReport}
          keyExtractor={(item, index) => `${item.patient_name}-${index}`}
          renderItem={renderReportItem}          contentContainerStyle={[
            styles.listContainer,
            (!patientReport || patientReport.length === 0) && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchReports}
              colors={["#E41E4F"]}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />)}
      {/* Report Options Modal */}
      <ReportOptionsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        report={selectedReport}
        onGeneratePDF={handleGeneratePDF}
        onDownloadPDF={handleDownloadPDF}
      />
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // Add padding for notch on iOS
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  backButton: {
    padding: 8,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E41E4F',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#E41E4F',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width:Dimensions.get('window').width - 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientId: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  reportContent: {
    marginBottom: 12,
  },
  reportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Platform.OS === 'ios' ? 12 : 16, // Different border radius per platform
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    // Add touch feedback appropriate for each platform
    ...Platform.select({
      android: {
        paddingVertical: 2, // Android needs more touch area
      },
      ios: {
        paddingVertical: 4,
      },
    }),
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#E41E4F',
    marginRight: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E41E4F',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalOptionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E41E4F',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // FAB styles
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E41E4F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  savedFilesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  savedFilesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  savedFilesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  savedFilesContent: {
    flex: 1,
    padding: 16,
  },
  savedFilesSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  filesList: {
    paddingBottom: 20,
  },
  fileItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fileItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileInfo: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
});