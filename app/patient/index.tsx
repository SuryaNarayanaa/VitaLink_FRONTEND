import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import {Table,Row} from 'react-native-reanimated-table'
import {COLORS, FONT_FAMILY} from '../../constants/Theme'
import {processColor} from 'react-native'

const dummyData = {
  name: 'Sathiya A',
  age: 47,
  gender: 'F',
  targetINR: '2.5 - 3.5',
  latestINR: 0,
  doctor: {
    id: 'DOC00002',
    name: 'Dr. P. Ramasamy',
  },
  therapy: 'Acitrom',
  therapyStartDate: '24/01/2025',
  medicalHistory: 'RHD- Post MVR/Recurrent CVA/ 27 years',
  missedDoses: [
    '31-01-2025',
    '30-01-2025',
    '29-01-2025',
    '28-02-2025',
    '28-01-2025',
    '27-02-2025',
    '27-01-2025',
    '26-03-2025',
    '26-02-2025',  
    '26-01-2025',
  ],
  prescription: {
    MON: '4.0 mg',
    TUE: '4.0 mg',
    WED: '4.0 mg',
    THU: '4.0 mg',
    FRI: '4.0 mg',
    SAT: '4.0 mg',
    SUN: '4.0 mg',
  },
  sideEffects: 'None',
  lifestyleChanges: 'None',
  otherMedication: 'None',
  prolongedIllness: 'None',
  contact: {
    phone: '+91 99946 92093',
    kin: {
      name: 'Nandini',
      contact: '+91 98947 69912',
    },
  },
  inrdata: {
    labels: ["March"],
    datasets: [
      {
        data: [20]
      }
    ]
  },
  xAxis:{
    valueFormatter:['Mar','May'],
    graunlarityEnabled:true,
    grauularity:1
  }
};

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
  const tableHead = ['Day', 'Dose'];
  const tableData = Object.entries(dummyData.prescription).map(([day, dose]) => [day, dose]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{dummyData.name}</Text>
        <Text style={styles.subInfo}>{`(Age: ${dummyData.age}, Gender: ${dummyData.gender})`}</Text>

        <View style={styles.divider} />

        <View style={styles.targetInr}>
          <Text style={styles.label}>Target INR:</Text>
          <Text style={styles.value}>{dummyData.targetINR}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.LatestInrSection}>
          <View style={styles.LatestInrValue}>
            <Text style={styles.label}>Latest INR:</Text>
            <Text style={styles.value}>{dummyData.latestINR}</Text>
          </View>
          <Text style={styles.timestamp}>AS OF 00:00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={['Doctor', dummyData.doctor.id]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Caregiver', dummyData.doctor.name]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy', dummyData.therapy]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy Start Date', dummyData.therapyStartDate]} style={styles.tableRow} textStyle={styles.tableText} />
          </Table>
        </View>

        <View style={styles.medicalHistory}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <Text style={styles.medicalInfo}>{dummyData.medicalHistory}</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>INR Values</Text>
          <View style={{ paddingHorizontal: 20 }}>
          <BarChart style={styles.chart} data={dummyData.inrdata} 
          width={Dimensions.get('window').width * 0.75} height={250} yAxisLabel='' 
          yAxisSuffix="" fromZero={true} withInnerLines={true} chartConfig={chartConfig}/></View>
        </View>

        <View style={styles.missedDoses}>
          <Text style={styles.sectionTitle}>MISSED DOSES:</Text>
          {dummyData.missedDoses.map((date, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listDot} />
              <Text style={styles.missedDate}>{date}</Text>
            </View>
          ))}
        </View>

        <View style={styles.prescriptionTable}>
          <Text style={styles.sectionTitle}>Prescription</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000 ' }}>
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

        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>SIDE EFFECTS: {dummyData.sideEffects}</Text>
          <Text style={styles.infoText}>LIFESTYLE CHANGES: {dummyData.lifestyleChanges}</Text>
          <Text style={styles.infoText}>OTHER MEDICATION: {dummyData.otherMedication}</Text>
          <Text style={styles.infoText}>PROLONGED ILLNESS: {dummyData.prolongedIllness}</Text>
        </View>

        <View style={styles.contactTable}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={['Contact', dummyData.contact.phone]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Kin Name', dummyData.contact.kin.name]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Kin Contact', dummyData.contact.kin.contact]} style={styles.tableRow} textStyle={styles.tableText} />
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
});




