
import { Patient } from '@/types/doctor';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ScrollView 
} from 'react-native';

interface PatientTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
}

type SortField = 'name' | 'opnum' | 'age' | 'gender' | 'doctor' | 'caretakerName';
type SortDirection = 'asc' | 'desc';

const PatientTable: React.FC<PatientTableProps> = ({ patients, onViewPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Search and sort patients
  const filteredPatients = patients
  .filter((patient) => {
    const name = patient.name?.toLowerCase() || '';
    const opnum = patient.opnum?.toLowerCase() || '';
    const doctor = patient.doctor?.toLowerCase() || '';
    const caretaker = patient.caretakerName?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    return name.includes(term) || opnum.includes(term) || doctor.includes(term) || caretaker.includes(term);
  })
  .sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (aValue == null || bValue == null) return 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0; // default fallback if types don’t match
  });

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredPatients.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredPatients.length / entriesPerPage);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchLabel}>Search:</Text>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              setCurrentPage(1);
            }}
            placeholder="Search by name or OP#..."
          />
        </View>
      </View>
      
      <ScrollView horizontal={true} contentContainerStyle={{flexGrow : 1}}>
        <ScrollView contentContainerStyle={{flexGrow:1}}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('name')}
            >
              <Text style={styles.headerText}>Name</Text>
              {sortField === 'name' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('opnum')}
            >
              <Text style={styles.headerText}>OP #</Text>
              {sortField === 'opnum' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('age')}
            >
              <Text style={styles.headerText}>Age</Text>
              {sortField === 'age' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('gender')}
            >
              <Text style={styles.headerText}>Gender</Text>
              {sortField === 'gender' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('doctor')}
            >
              <Text style={styles.headerText}>Doctor Name</Text>
              {sortField === 'doctor' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerCell} 
              onPress={() => handleSort('caretakerName')}
            >
              <Text style={styles.headerText}>Caretaker Name</Text>
              {sortField === 'caretakerName' && (
                <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>View Patient</Text>
            </View>
          </View>
          
          {/* Table Rows */}
          {currentEntries.map((patient) => (
            <View key={patient.ID} style={styles.tableRow}>
              <View style={styles.cell}>
                <Text>{patient.name}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{patient.opnum}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{patient.age}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{patient.gender}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{patient.doctorName}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{patient.caretakerName}</Text>
              </View>
              <View style={styles.cell}>
                <TouchableOpacity onPress={() => onViewPatient(patient)}>
                  <Text style={styles.viewLink}>Click to View Patient</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      
      <View style={styles.paginationInfo}>
        <Text>
          Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredPatients.length)} of {filteredPatients.length} entries
        </Text>
      </View>
      
      <View style={styles.paginationControls}>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]} 
          onPress={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{'<<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]} 
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.currentPageIndicator}>
          <Text>{currentPage}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]} 
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]} 
          onPress={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>{'>>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  entriesLabel: {
    marginRight: 8,
  },
  entriesSelector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 8,
  },
  searchLabel: {
    marginRight: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: 150,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    padding: 12,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    padding: 12,
    width: 120,
  },
  viewLink: {
    color: '#2196F3',
  },
  paginationInfo: {
    marginTop: 16,
    marginBottom: 8,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
  pageButtonText: {
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  currentPageIndicator: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 8,
    minWidth: 30,
    alignItems: 'center',
  },
});

export default PatientTable;
