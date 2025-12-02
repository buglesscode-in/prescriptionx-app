import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { EnterpriseData } from '@/interfaces/enterprise';
import { MedicationData } from '@/interfaces/template';

// Register fonts if needed, or use default Helvetica
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0F172A', // Slate-900
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // Slate-200
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
    marginTop: -20,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4F46E5', // Indigo-600 (Primary)
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: -20,
    objectFit: 'contain',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1E293B', // Slate-800
  },
  subText: {
    fontSize: 10,
    color: '#64748B', // Slate-500
  },
  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F8FAFC', // Slate-50
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Slate-100
  },
  patientInfoCol: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 8,
    color: '#64748B', // Slate-500
    marginBottom: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155', // Slate-700
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#4F46E5', // Indigo-600 (Primary)
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // Slate-200
    paddingBottom: 4,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate-200
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E2E8F0', // Slate-200
    backgroundColor: '#F1F5F9', // Slate-100
    padding: 8,
  },
  tableCol: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E2E8F0', // Slate-200
    padding: 8,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569', // Slate-600
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
    color: '#334155', // Slate-700
  },
  adviceSection: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate-200
    borderRadius: 6,
    backgroundColor: '#F8FAFC', // Slate-50
    color: '#334155', // Slate-700
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8', // Slate-400
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', // Slate-200
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
          {clinic?.logoUrl && <Image style={styles.logo} src={clinic.logoUrl} />}
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
          <View style={[styles.tableColHeader, { width: '10%' }]}>
            <Text style={styles.tableCellHeader}>#</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '30%' }]}>
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
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={[styles.tableCol, { width: '30%' }]}>
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
