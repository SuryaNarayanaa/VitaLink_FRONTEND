import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Table, Row } from 'react-native-reanimated-table';
import { COLORS, FONT_FAMILY } from '../../constants/Theme';
import { usePatient } from '../../hooks/api/patient/usePatient';

const chartConfig = {
  backgroundGradientFrom: "#a7b9ff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#fab7c5",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 1,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    stroke: "rgba(0,0,0,0.2)",
    strokeWidth: 0.5,
    strokeDasharray: "0",
  },
};

export default function Profile() {
  const { getPatientDashboard, isLoading, error } = usePatient();

  interface PatientData {
    patient: {
      ID: string;
      _id: string;
      name: string;
      age: number;
      gender: string;
      target_inr_min: number;
      target_inr_max: number;
      latestINR?: number; // Optional, as it might not exist
      prescription?: Record<string, string>;
      doctor: string;
      therapy: string;
      therapy_start_date: string;
      medical_history?: string[];
      side_effects?: string;
      lifestyle_changes?: string;
      other_medication?: string;
      prolonged_illness?: string;
      contact: string;
      kin_name: string;
      kin_contact: string;
    };
    chart_data: { labels: string[]; values: number[] };
    missed_doses: string[];
  }

  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPatientDashboard();

      if (data) {
        try {
          // Ensure chart_data is an array of objects
          const chartDataArray = Array.isArray(data.chart_data)
            ? data.chart_data
            : Object.entries(data.chart_data).map(([label, value]) => ({ label, value }));

          setPatientData({
            patient: {
              ID: data.patient.ID,
              _id: data.patient._id,
              name: data.patient.name,
              age: data.patient.age,
              gender: data.patient.gender,
              target_inr_min: data.patient.target_inr_min,
              target_inr_max: data.patient.target_inr_max,
              latestINR: data.patient.latestINR || null,
              prescription: data.patient.prescription || {},
              doctor: data.patient.doctor,
              therapy: data.patient.therapy,
              therapy_start_date: data.patient.therapy_start_date,
              medical_history: data.patient.medical_history || [],
              side_effects: data.patient.side_effects || '',
              lifestyle_changes: data.patient.lifestyle_changes || '',
              other_medication: data.patient.other_medication || '',
              prolonged_illness: data.patient.prolonged_illness || '',
              contact: data.patient.contact,
              kin_name: data.patient.kin_name,
              kin_contact: data.patient.kin_contact,
            },
            chart_data: {
              labels: chartDataArray.map((item: any) => item.label || ''), // Ensure labels are strings
              values: chartDataArray.map((item: any) => item.value || 0), // Ensure values are numbers
            },
            missed_doses: data.missed_doses || [],
          });
          console.log("after"); // This will execute if no error occurs
        } catch (error) {
          console.error("Error setting patient data:", error); // Log any error that occurs
        }
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary_color} />
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!patientData) {
    return null;
  }

  const { patient, chart_data, missed_doses } = patientData;
  const tableHead = ['Day', 'Dose'];
  const tableData = Object.entries(patient?.prescription || {}).map(([day, dose]) => [day, dose]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.subInfo}>{`(Age: ${patient.age}, Gender: ${patient.gender})`}</Text>

        <View style={styles.divider} />

        <View style={styles.targetInr}>
          <Text style={styles.label}>Target INR:</Text>
          <Text style={styles.value}>{`${patient.target_inr_min} - ${patient.target_inr_max}`}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.LatestInrSection}>
          <View style={styles.LatestInrValue}>
            <Text style={styles.label}>Latest INR:</Text>
            <Text style={styles.value}>{patient.latestINR || 'N/A'}</Text>
          </View>
          <Text style={styles.timestamp}>AS OF 00:00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={['Doctor', patient.doctor]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Caregiver', patient.kin_name]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy', patient.therapy]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy Start Date', patient.therapy_start_date]} style={styles.tableRow} textStyle={styles.tableText} />
          </Table>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>INR Values</Text>
          <BarChart
            style={styles.chart}
            data={{
              labels: chart_data.labels,
              datasets: [{ data: chart_data.values }],
            }}
            width={Dimensions.get('window').width * 0.75}
            height={250}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero={true}
            withInnerLines={true}
            chartConfig={chartConfig}
          />
        </View>

        <View style={styles.missedDoses}>
          <Text style={styles.sectionTitle}>MISSED DOSES:</Text>
          {missed_doses.map((date, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listDot} />
              <Text style={styles.missedDate}>{date}</Text>
            </View>
          ))}
        </View>

        {/* Prescription Table */}
        <View style={styles.prescriptionTable}>
          <Text style={styles.sectionTitle}>Prescription</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={tableHead} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                style={styles.tableRow}
                textStyle={styles.tableText}
              />
            ))}
          </Table>
        </View>

        {/* Additional Information */}
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>SIDE EFFECTS: {patient.side_effects || 'None'}</Text>
          <Text style={styles.infoText}>LIFESTYLE CHANGES: {patient.lifestyle_changes || 'None'}</Text>
          <Text style={styles.infoText}>OTHER MEDICATION: {patient.other_medication || 'None'}</Text>
          <Text style={styles.infoText}>PROLONGED ILLNESS: {patient.prolonged_illness || 'None'}</Text>
        </View>

        {/* Contact Table */}
        <View style={styles.contactTable}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={['Contact', patient.contact]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Kin Name', patient.kin_name]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Kin Contact', patient.kin_contact]} style={styles.tableRow} textStyle={styles.tableText} />
          </Table>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  background: {
    flex: 1,
    backgroundColor: '#ffffff99',
    backdropFilter: 'blur(5px)'
  },
  container: {
    flex: 1,
    padding:10,
    fontFamily: FONT_FAMILY.primary,
  },
  card: {
    backgroundColor: '#ffffff99', 
    backdropFilter: 'blur(5px)',
    padding: 40,
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subInfo: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  LatestInrSection:{
    alignItems:'center',
    gap:10
  },
  LatestInrValue:{
    flexDirection:'row',
    gap:15,
    alignItems:'center'
  },
  targetInr:{
    flexDirection:'row',
    alignItems:'center',
    gap:20
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4, 4, 4, 0.8)',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight:'bold',
    color: 'black',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    height: 40,
    backgroundColor: 'transparent',
  },
  tableText: {
    margin: 6,
    color: 'black',
    fontSize: 14, // Add a font size to ensure it's valid
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#f4f4f4',
  },
  tableHeaderText: {
    margin: 6,
    color: '#333',
    fontWeight: 'bold',
  },
  medicalHistory: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily:FONT_FAMILY.secondary,
    marginBottom: 10,
  },
  medicalInfo: {
    color: '#666',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius:6,
    backgroundColor:'transparent'
  },
  missedDoses: {
    marginTop: 20,
  },
  missedDate: {
    color:'black',
    alignItems:'center',
    marginLeft: 10,
  },
  listItem:{
    fontFamily:FONT_FAMILY.secondary,
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 10,
    marginLeft:23
  },
  listDot: {
    width: 5.5, 
    height: 5.5,
    borderRadius: 4, 
    backgroundColor: 'black', 
    marginRight: 7, 
  },
  prescriptionTable: {
    marginTop: 20,
  },
  additionalInfo: {
    marginTop: 20,
  },
  infoText: {
    color: '#666',
    marginBottom: 5,
  },
  contactTable: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary_color,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});




