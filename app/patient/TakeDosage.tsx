import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_FAMILY } from '@/constants/Theme';
import { Check, X, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';

const ITEMS_PER_PAGE = 10; 


const missedDoses = [
  '01-02-2025', '01-03-2025', '02-02-2025', '02-03-2025',
  '03-02-2025', '03-03-2025', '04-02-2025', '04-03-2025',
  '05-02-2025', '05-03-2025', '06-02-2025', '06-03-2025',
  '07-02-2025', '07-03-2025', '08-02-2025', '08-03-2025',
  '09-02-2025', '09-03-2025', '10-02-2025', '10-03-2025',
  '11-02-2025', '11-03-2025', '12-02-2025', '12-03-2025',
  '13-02-2025', '13-03-2025', '14-02-2025', '14-03-2025',
  '15-02-2025', '15-03-2025', '16-02-2025', '16-03-2025',
  '17-02-2025', '17-03-2025', '18-02-2025', '18-03-2025',
  '19-02-2025', '19-03-2025', '20-02-2025', '20-03-2025',
  '21-02-2025', '21-03-2025', '22-02-2025', '22-03-2025',
  '23-02-2025', '23-03-2025', '24-02-2025', '24-03-2025',
  '25-01-2025', '25-02-2025', '25-03-2025', '26-01-2025',
  '26-02-2025', '26-03-2025', '27-02-2025', '27-03-2025',
  '28-01-2025', '28-02-2025', '28-03-2025', '29-01-2025',
  '30-01-2025', '31-01-2025'
];

const recentMissedDoses = [
  '27-03-2025', '28-01-2025', '28-02-2025', '28-03-2025',
  '29-01-2025', '30-01-2025', '31-01-2025'
];

export default function TakeDosage() {
  const [takenDates, setTakenDates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(missedDoses.length / ITEMS_PER_PAGE);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return missedDoses.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDatePress = (date: string) => {
    setTakenDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      }
      return [...prev, date];
    });
  };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Missed Doses</Text>
          <Text style={styles.description}>
            Below are the missed doses for the last 7 days. Click on the date to mark it as taken.
          </Text>

          <View style={styles.recentDatesGrid}>
            {recentMissedDoses.map((date, index) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateBox,
                  takenDates.includes(date) && styles.takenDate,
                ]}
                onPress={() => handleDatePress(date)}
              >
                <Text style={[
                  styles.dateText,
                  takenDates.includes(date) && styles.takenDateText
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.missedDosesSection}>
            <Text style={styles.sectionTitle}>Missed Doses</Text>
            <Text style={styles.sectionSubtitle}>Recent missed medications</Text>
            <View style={styles.missedDosesGrid}>
            {getPaginatedData().map((dose,index) => (
              <View key={index} style={styles.missedDoseItem}>
                <View style={styles.missedDoseHeader}>
                  <AlertCircle size={20} color="#FF5252" />
                </View>
                <Text style={styles.missedDoseMedication}>
                  {dose}
                </Text>
              </View>
            ))}
            </View>
          </View>

          <View style={styles.paginationControls}>
            <TouchableOpacity
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.disabledButton,
              ]}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
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
    backdropFilter: 'blur(5px)',
    padding: 20,
    marginBottom:20,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  recentDatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 30,
  },
  dateBox: {
    backgroundColor: COLORS.background_missed_doses,
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  takenDate: {
    backgroundColor: '#4CAF50',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  takenDateText: {
    color: '#fff',
  },
  fullListTitle: {
    marginTop: 20,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal:10,
  },
  paginationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A9CCE3',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationInfo: {
    fontSize: 16,
    color: '#333',
  },
  missedDosesList: {
    marginTop: 10,
  },
  missedDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },

  missedDosesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  missedDosesSection: {
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  missedDoseItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    width: '45%',
  },
  missedDoseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missedDoseDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  missedDoseMedication: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  missedDoseReason: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});