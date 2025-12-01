import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { EnterpriseData } from '@/interfaces/enterprise';
import { MedicationData } from '@/interfaces/template';

// Register fonts if needed, or use default Helvetica
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subText: {
    fontSize: 10,
    color: '#666',
  },
  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  patientInfoCol: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 8,
    color: '#888',
    marginBottom: 1,
  },
  value: {
    fontSize: 10,
    fontWeight: 'medium',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#d32f2f', // Red color for titles like 'Rx'
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  tableCol: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e0e0e0',
    padding: 5,
  },
  tableColWide: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e0e0e0',
    padding: 5,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
  },
  adviceSection: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#aaa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

interface PrescriptionPDFProps {
  clinic: EnterpriseData | null;
  patientDetails: string;
  patientAge: string;
  patientWeight: string;
  patientHeight: string;
  patientBmi: string;
  medications: MedicationData[];
  advice: string;
  notes: string;
  date: string;
}

export const PrescriptionPDF = ({
  clinic,
  patientDetails,
  patientAge,
  patientWeight,
  patientHeight,
  patientBmi,
  medications,
  advice,
  notes,
  date,
}: PrescriptionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.hospitalName}>{clinic?.hospitalName || 'Medical Center'}</Text>
          <Text style={styles.subText}>{clinic?.address || ''}</Text>
          <Text style={styles.subText}>{clinic?.phoneNumber || ''}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.doctorName}>{clinic?.doctorName || 'Doctor'}</Text>
          <Text style={styles.subText}>Lic: {clinic?.licenseNumber || 'N/A'}</Text>
          {clinic?.specialization && <Text style={styles.subText}>{clinic.specialization}</Text>}
        </View>
      </View>

      {/* Patient Info */}
      <View style={styles.patientInfo}>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>Patient Name</Text>
          <Text style={styles.value}>{patientDetails || 'N/A'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{patientAge || 'N/A'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>{patientWeight || 'N/A'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>{patientHeight || 'N/A'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>BMI</Text>
          <Text style={styles.value}>{patientBmi || 'N/A'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
      </View>

      {/* Rx Section */}
      <Text style={styles.sectionTitle}>Rx (Medications)</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: '5%' }]}>
            <Text style={styles.tableCellHeader}>#</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '25%' }]}>
            <Text style={styles.tableCellHeader}>Medicine</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Regimen</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Timing</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Duration</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Freq</Text>
          </View>
        </View>
        {medications.map((med, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCell}>{med.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{med.regimen}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{med.mealTime}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{med.duration}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{med.frequency}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Advice Section */}
      {advice && (
        <>
          <Text style={styles.sectionTitle}>Advice</Text>
          <View style={styles.adviceSection}>
            <Text>{advice}</Text>
          </View>
        </>
      )}

      {/* Notes Section */}
      {notes && (
        <>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.adviceSection}>
            <Text>{notes}</Text>
          </View>
        </>
      )}

      {/* Footer */}
      <Text style={styles.footer}>Generated by PrescriptionX | {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
);
