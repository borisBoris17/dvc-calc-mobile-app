import { StyleSheet, View, Text, ScrollView } from 'react-native'; import Constants from 'expo-constants';
import { Button, Card, Modal, TextInput, useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { PaperSelect } from 'react-native-paper-select';
import { createContract, fetchResorts, runTransaction } from '../util';
import UseYearComponent from './UseYearComponent';

const contracts1 = [{
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

const expirationDateMap = new Map();
expirationDateMap.set('Riviera', 2070);
expirationDateMap.set('Vero Beach', 2042);
expirationDateMap.set('Saratoga Springs', 2054);
expirationDateMap.set('Polynesian', 2066);
expirationDateMap.set('Old Key West', 2042);
expirationDateMap.set('Hilton Head Island', 2042);
expirationDateMap.set('Grand Floridian', 2064);
expirationDateMap.set('Grand Californian', 2060);
expirationDateMap.set('Copper Creek', 2068);
expirationDateMap.set('Boulder Ridge', 2042);
expirationDateMap.set('Boardwalk', 2042);
expirationDateMap.set('Beach Club', 2042);
expirationDateMap.set('Bay Lake Tower', 2060);
expirationDateMap.set('Aulani', 2062);
expirationDateMap.set('Animal Kingdom Lodge', 2057);

export function ContractsComponent({ db }) {
  const [contracts, setContracts] = useState({
    February: [],
    March: [],
    April: [],
    June: [],
    August: [],
    September: [],
    October: [],
    December: [],
  })
  const [contractPoints, setContractPoints] = useState('');
  const [openAddContract, setOpenAddContract] = useState(false);
  const [homeResort, setHomeResort] = useState({
    value: '',
    selected_id: '',
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

  const fetchResorts = async () => {
    if (db !== undefined) {
      const foundResorts = await runTransaction(db, 'select * from resort order by resort_id ASC;');
      const builtResorts = foundResorts.map(resort => {
        return { _id: resort.resort_id, value: resort.name }
      });
      setHomeResort({ ...homeResort, list: builtResorts })
    }
  }

  const fetchContracts = async () => {
    if (db !== undefined) {
      const foundContracts = await runTransaction(db, 'select * from contract order by contract_id ASC;');
      let builtContracts = contracts;
      await Promise.all(foundContracts.map(async (contract) => {
        const homeResortName = await runTransaction(db, `select name from resort where resort_id = ${contract.home_resort_id}`)
        if (builtContracts[contract.use_year].filter(contactInContracts => contactInContracts.contract_id === contract.contract_id).length === 0) {
          const allotmentsForContract = await runTransaction(db, `select * from point_allotment where contract_id = ${contract.contract_id}`)
          const foundContract = { contract_id: contract.contract_id, homeResort: homeResortName[0].name, points: contract.points, useYear: contract.use_year, allotments: allotmentsForContract };
          const currentContractsForUseYear = [...builtContracts[contract.use_year], foundContract];
          builtContracts = { ...builtContracts, [contract.use_year]: currentContractsForUseYear };
        }
      }));
      setContracts(builtContracts)
    }
  }

  function updateContracts(contract, homeResort) {
    
    return newContracts;
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchResorts();
      fetchContracts();
    }
  }, [db])

  const saveSaveContract = async () => {
    const newContract = {
      home_resort_id: homeResort.selected_id,
      points: Number(contractPoints),
      use_year: useYear.value,
      expiration: expirationDateMap.get(homeResort.value),
    }
    const createdContract = await createContract(db, newContract);
    const currentContractsForUseYear = [...contracts[createdContract.use_year], { contract_id: createdContract.contract_id, homeResort: homeResort.value, points: createdContract.points, useYear: createdContract.use_year, allotments: createdContract.allotments }];
    const newContracts = { ...contracts, [createdContract.use_year]: currentContractsForUseYear };
    setContracts(newContracts)
    onDismissAddContracts();
  }

  const onDismissAddContracts = () => {
    setContractPoints(undefined)
    setUseYear({ ...useYear, value: '' })
    setHomeResort({ ...homeResort, value: '' })
    setOpenAddContract(false)
  }

  const handlePointsChange = (text) => {
    setContractPoints(text)
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.pageTitle}>
          <Text style={{ fontSize: 45, fontWeight: 'bold', textAlign: 'center', color: '#00232c' }}>Contracts</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {contracts.February.length > 0 ? <UseYearComponent contractsForUseYear={contracts.February} useYear={'February'} /> : ''}  
          {contracts.March.length > 0 ? <UseYearComponent contractsForUseYear={contracts.March} useYear={'March'} /> : ''}        
          {contracts.April.length > 0 ? <UseYearComponent contractsForUseYear={contracts.April} useYear={'April'} /> : ''}
          {contracts.June.length > 0 ? <UseYearComponent contractsForUseYear={contracts.June} useYear={'June'} /> : ''}
          {contracts.August.length > 0 ? <UseYearComponent contractsForUseYear={contracts.August} useYear={'August'} /> : ''}  
          {contracts.September.length > 0 ? <UseYearComponent contractsForUseYear={contracts.September} useYear={'September'} /> : ''}        
          {contracts.October.length > 0 ? <UseYearComponent contractsForUseYear={contracts.October} useYear={'October'} /> : ''}
          {contracts.December.length > 0 ? <UseYearComponent contractsForUseYear={contracts.December} useYear={'December'} /> : ''}
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
                  selected_id: value.selectedList[0]?._id,
                  selectedList: value.selectedList,
                  error: '',
                });
              }}
              arrayList={[...homeResort.list]}
              selectedArrayList={[...homeResort.selectedList]}
              errorText={homeResort.error}
              multiEnable={false}
            />
            <TextInput label='Points' value={contractPoints} onChangeText={text => handlePointsChange(text)}></TextInput>
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
            <Button onPress={saveSaveContract} labelStyle={styles.addButtonText} style={styles.saveButton}>Save</Button>
          </View>

        </Modal>
      </View>
    </>
  )
}
