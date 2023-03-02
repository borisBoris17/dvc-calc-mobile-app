import { StyleSheet, View, Text, ScrollView } from 'react-native'; import Constants from 'expo-constants';
import { Button, Card, Modal, TextInput, useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { PaperSelect } from 'react-native-paper-select';
import { runTransaction } from '../util';
import UseYearComponent from './UseYearComponent';

const contracts = [{
  contractId: 3,
  homeResort: 'Animal Kingdom',
  points: 100,
  useYear: 'February'
}]

const contractsSameUseYear = [{
  contractId: 1,
  homeResort: 'Riviera',
  points: 200,
  useYear: 'February'
}, {
  contractId: 2,
  homeResort: 'Old Key West',
  points: 150,
  useYear: 'February'
}]

export function ContractsComponent({db}) {
  const [contractPoints, setContractPoints] = useState(undefined);
  const [openAddContract, setOpenAddContract] = useState(false);
  const [homeResort, setHomeResort] = useState({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const [useYear, setUseYear] = useState({
    value: '',
    list: [
      { _id: 'feb', value: 'February' },
      { _id: 'mar', value: 'March' },
      { _id: 'apr', value: 'April' },
      { _id: 'jun', value: 'June' },
      { _id: 'aug', value: 'August' },
      { _id: 'sep', value: 'September' },
      { _id: 'oct', value: 'October' },
      { _id: 'dec', value: 'December' },
    ],
    selectedList: [],
    error: '',
  });

  const fetchResorts = async () => {
    if (db !== undefined) {
      const foundResorts = await runTransaction(db, 'select * from resort order by resort_id ASC;');
      const builtResorts = foundResorts.map(resort => {
        return { _id: resort.resort_id, value: resort.name }
      });
      setHomeResort({...homeResort, list: builtResorts})
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchResorts();
    }
  }, [db])

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      display: 'flex',
    },
    statusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: theme.colors.primaryContainer,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: '10%',
    },
    addButtonText: {
      fontSize: 20,
      paddingLeft: 10,
      paddingRight: 10
    },
    pageTitle: {
      marginVertical: 20,
      textAlign: 'center'
    },
    addContractContainer: {
      margin: '5%',
      backgroundColor: theme.colors.tertiary,
      margin: 20,
      height: 500,
      width: '90%',
      borderRadius: 5,
    },
    modalTitleRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 3,
      borderBottomColor: theme.colors.primary,
      alignItems: 'center'
    },
    modalTitle: {
      flex: 1,
      fontSize: 24,
      borderBottomColor: theme.colors.primary,
      margin: 10
    },
    saveButton: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    saveButtonText: {
      fontSize: 18,
      paddingLeft: 10,
      paddingRight: 10
    },
    contractInputSection: {
      flex: 1,
      display: 'flex'
    },
    scrollContainer: {
      width: '90%',
      height: Constants.height
    }
  });

  const onDismissAddContracts = () => {
    setContractPoints(undefined)
    setUseYear({...useYear, value: ''})
    setHomeResort({...homeResort, value: ''})
    setOpenAddContract(false)
  }

  const handlePointsChange = (value) => {
    setContractPoints(value)
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.pageTitle}>
          <Text style={{ fontSize: 45, fontWeight: 'bold', textAlign: 'center', color: '#00232c' }}>Contracts</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
          <UseYearComponent contractsForUseYear={contractsSameUseYear} useYear={'February'}/>
          <UseYearComponent contractsForUseYear={contracts} useYear={'February'}/>
        <View style={styles.buttonContainer}>
          <Button style={styles.addButton} labelStyle={styles.addButtonText} onPress={() => setOpenAddContract(true)} mode="contained">Add New Contract</Button>
        </View>
        </ScrollView>
        <Modal visible={openAddContract} onDismiss={onDismissAddContracts} contentContainerStyle={styles.addContractContainer}>
          <View style={styles.modalTitleRow}>
            <Text style={styles.modalTitle}>Add New Contract</Text>
          </View>
          <View style={styles.contractInputSection}>
          <PaperSelect
              label="Home Resort"
              value={homeResort.value}
              onSelection={(value) => {
                setHomeResort({
                  ...homeResort,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: '',
                });
              }}
              arrayList={[...homeResort.list]}
              selectedArrayList={[...homeResort.selectedList]}
              errorText={homeResort.error}
              multiEnable={false}
            />
            <TextInput label='Points' value={contractPoints} onChange={value => handlePointsChange(value)}></TextInput>
            <PaperSelect
              label="Use Year"
              value={useYear.value}
              onSelection={(value) => {
                setUseYear({
                  ...useYear,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: '',
                });
              }}
              arrayList={[...useYear.list]}
              selectedArrayList={[...useYear.selectedList]}
              errorText={useYear.error}
              multiEnable={false}
            />
            <Button onPress={onDismissAddContracts} labelStyle={styles.addButtonText} style={styles.saveButton}>Save</Button>
          </View>

        </Modal>
      </View>
    </>
  )
}