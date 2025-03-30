import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Patient } from '../types';

interface PatientsTableProps {
  patients: Patient[];
}

const PatientsTable: React.FC<PatientsTableProps> = ({ patients = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [sortField, setSortField] = useState<keyof Patient>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!patients || patients.length === 0) {
      setFilteredPatients([]);
      return;
    }

    const filtered = patients.filter((patient) =>
      (patient.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.caretakerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortField] ?? '';
    const bValue = b[sortField] ?? '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPatients.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + rowsPerPage);

  const renderPatient = ({ item }: { item: Patient }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.age}</Text>
      <Text style={styles.cell}>{item.gender}</Text>
      <Text style={styles.cell}>{item.doctorName}</Text>
      <Text style={styles.cell}>{item.caretakerName}</Text>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => handleSort('name')} style={styles.headerCell}>
          <Text style={styles.headerText}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('age')} style={styles.headerCell}>
          <Text style={styles.headerText}>Age</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('gender')} style={styles.headerCell}>
          <Text style={styles.headerText}>Gender</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('doctorName')} style={styles.headerCell}>
          <Text style={styles.headerText}>Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('caretakerName')} style={styles.headerCell}>
          <Text style={styles.headerText}>Caretaker</Text>
        </TouchableOpacity>
        <Text style={styles.headerCell}>Actions</Text>
      </View>

      {/* Patient List */}
      <FlatList
        data={paginatedPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>&lt; Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>Next &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#1EAEDB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#1EAEDB',
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
  },
  paginationInfo: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default PatientsTable;
