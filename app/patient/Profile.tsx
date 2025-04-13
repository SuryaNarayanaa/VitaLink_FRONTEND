import { View, Text,ScrollView,StyleSheet } from 'react-native'
import { Table, Row } from 'react-native-reanimated-table';
import { COLORS, FONT_FAMILY } from '../../constants/Theme';
import React from 'react'
import { usePatientContext } from '@/hooks/context/PatientContext'
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';
import { ReportFormResponse } from '@/types/patient';
import Chart from '@/components/Patient/Chart';

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return { formattedDate, formattedTime };
};


const Profile = () => {
  const { patientData } = usePatientContext();
  const { patient, chart_data, missed_doses } = patientData || { patient: {}, chart_data: [], missed_doses: [] };

  const tableHead = ['Day', 'Dose'];
  const tableData = patient?.dosage_schedule?.map((item) => [item.day, item.dosage]) || [];

  const latestInrDateTime = patient.inr_reports?.[0]?.date
    ? formatDateTime(patient.inr_reports[0].date)
    : null;

  
  const {data:reportData = null,isLoading,isError} = useQuery({
    queryKey:['reports'],
    queryFn: async () => {
      const response = await apiClient.get<ReportFormResponse>('/patient/report')
      return response.data
    }
  })
  
  return (
    <ScrollView style={styles.container}>
      <View className='bg-[#ffffff99] backdrop:blur-md p-11 m-[15px] rounded-2xl'>
        <Text className='text-2xl font-bold text-[#2a2626]'>{patient.name}</Text>
        <Text className='mt-2 font-semibold  text-[#555252] tracking-wide'>{`(Age: ${patient.age}, Gender: ${patient.gender})`}</Text>

        <View className='h-[1px] bg-[#555050c9] w-full my-5'/>

        <View className='flex flex-row items-center justify-start gap-x-5'>
          <Text className='text-xl font-bold'>Target INR  :</Text>
          <Text className='text-xl font-bold tracking-wide'>{`${patient.target_inr_min} - ${patient.target_inr_max}`}</Text>
        </View>

        <View className='h-[1px] bg-[#555050c9] w-full my-5'/>

        <View className='flex items-center gap-3'>
          <View className='flex flex-row items-center justify-center gap-x-3'>
            <Text className='font-bold text-xl'>Latest INR :</Text>
            <Text className="font-bold text-xl">
              {patient.inr_reports?.[0]
                ? `${patient.inr_reports[0].inr_value.toFixed(1)}`
                : 'N/A'}
            </Text>
          </View>
          {latestInrDateTime ? (
            <View className='flex flex-row gap-x-2'>
              <Text className='font-semibold text-[#333]'>AS OF :</Text>
              <Text className='font-semibold text-black'>{latestInrDateTime.formattedDate}</Text>
              <Text className='font-semibold text-black'>{latestInrDateTime.formattedTime}</Text>
            </View>
          ) : (
            <Text style={styles.timestamp}>AS OF: N/A</Text>
          )}
        </View>

        

        <View style={styles.table}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#000' }}>
            <Row data={['Doctor', patient.doctor]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Caregiver', patient.kin_name]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy', patient.therapy]} style={styles.tableRow} textStyle={styles.tableText} />
            <Row data={['Therapy Start Date', patient.therapy_start_date]} style={styles.tableRow} textStyle={styles.tableText} />
          </Table>
        </View>

        <View className="mt-3">
          <Text className="text-xl font-bold text-gray-800 my-2">Medical History</Text>
          <View>
          {patient.medical_history && patient.medical_history.length > 0 ? (
          patient.medical_history.map((item, index) => (
          <View key={index} className="bg-transparent mb-4">
            <Text className="text-lg text-gray-900">
              Diagnosis: {item.diagnosis}
            </Text>
            <Text className="text-base text-gray-700 mt-1">
              Duration: {item.duration_value} {item.duration_unit}
            </Text>
          </View>
          ))
          ) : (
          <Text className="text-base text-gray-700">No medical history available</Text>
          )}
          </View>
        </View>

        {/*<Chart title='INR values' chartData={Array.isArray(chart_data) ? {} : chart_data}/>*/}

        <View className='mt-5'>
          <Text style={styles.sectionTitle}>MISSED DOSES:</Text>
          {missed_doses.map((date, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listDot} />
              <Text style={styles.missedDate}>{date}</Text>
            </View>
          ))}
        </View>

        <View className='mt-5'>
          <Text className='font-bold text-slate-800 mb-2 text-xl'>Prescription</Text>
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

        <View style={styles.additionalInfo}>
          <Text className='my-2 text-[#3b2e30] tracking-wide'>SIDE EFFECTS: {!isError? reportData?.sideEffects || 'None' : 'None'}</Text>
          <Text className='my-2 text-[#3b2e30] tracking-wide'>LIFESTYLE CHANGES: {!isError? reportData?.lifestyleChanges || 'None' : 'None'}</Text>
          <Text className='my-2 text-[#3b2e30] tracking-wide'>OTHER MEDICATION: {!isError? reportData?.otherMedication || 'None' : 'None'}</Text>
          <Text className='my-2 text-[#3b2e30] tracking-wide'>PROLONGED ILLNESS: {!isError? reportData?.prolongedIllness || 'None' : 'None'}</Text>
        </View>

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
  container: {
    flex: 1,
    padding:10,
    fontFamily: FONT_FAMILY.primary,
  },
  card: {
    backgroundColor: '#ffffff99',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  targetInr:{
    flexDirection:'row',
    alignItems:'center',
    gap:20
  },
  dateTimeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
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
    backgroundColor: 'transparent',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2626',
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
  medicalHistoryContainer: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3d3b3b',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555252',
    marginTop: 5,
  },
  noHistoryText: {
    fontSize: 14,
    color: 'gray',
  },
});


export default Profile