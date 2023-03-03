import { StyleSheet, View, Text, ScrollView } from 'react-native'; import Constants from 'expo-constants';
import { Button, useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { removeContract, runTransaction } from '../util';
import UseYearComponent from './UseYearComponent';
import AddContractComponent from './AddContractComponent';

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
  const [openAddContract, setOpenAddContract] = useState(false);

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
    scrollContainer: {
      width: '90%',
      height: Constants.height
    }
  });

  const fetchContracts = async () => {
    if (db !== undefined) {
      const foundContracts = await runTransaction(db, 'select * from contract order by contract_id ASC;');
      let builtContracts = contracts;
      await Promise.all(foundContracts.map(async (contract) => {
        const homeResortName = await runTransaction(db, `select name from resort where resort_id = ${contract.home_resort_id}`)
        if (builtContracts[contract.use_year].filter(contactInContracts => contactInContracts.contract_id === contract.contract_id).length === 0) {
          const allotmentsForContract = await runTransaction(db, `select * from point_allotment where contract_id = ${contract.contract_id}`)
          const foundContract = { contract_id: contract.contract_id, homeResort: homeResortName[0].name, points: contract.points, use_year: contract.use_year, allotments: allotmentsForContract };
          const currentContractsForUseYear = [...builtContracts[contract.use_year], foundContract];
          builtContracts = { ...builtContracts, [contract.use_year]: currentContractsForUseYear };
        }
      }));
      setContracts(builtContracts)
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchContracts();
    }
  }, [db])

  const handleDeleteContract = (contract_id, use_year) => {
    const contractsForUseYear = [...contracts[use_year]];
    const contractToRemove = contractsForUseYear.filter(cont => cont.contract_id === contract_id)[0];
    removeContract(db, contractToRemove);
    const newContractListForUseYear = contractsForUseYear.filter(cont => cont.contract_id !== contract_id)
    setContracts({...contracts, [use_year]: newContractListForUseYear})
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.pageTitle}>
          <Text style={{ fontSize: 45, fontWeight: 'bold', textAlign: 'center', color: '#00232c' }}>Contracts</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {contracts.February.length > 0 ? <UseYearComponent contractsForUseYear={contracts.February} useYear={'February'} handleDeleteContract={handleDeleteContract}/> : ''}  
          {contracts.March.length > 0 ? <UseYearComponent contractsForUseYear={contracts.March} useYear={'March'} handleDeleteContract={handleDeleteContract} /> : ''}        
          {contracts.April.length > 0 ? <UseYearComponent contractsForUseYear={contracts.April} useYear={'April'} handleDeleteContract={handleDeleteContract} /> : ''}
          {contracts.June.length > 0 ? <UseYearComponent contractsForUseYear={contracts.June} useYear={'June'} handleDeleteContract={handleDeleteContract} /> : ''}
          {contracts.August.length > 0 ? <UseYearComponent contractsForUseYear={contracts.August} useYear={'August'} handleDeleteContract={handleDeleteContract} /> : ''}  
          {contracts.September.length > 0 ? <UseYearComponent contractsForUseYear={contracts.September} useYear={'September'} handleDeleteContract={handleDeleteContract} /> : ''}        
          {contracts.October.length > 0 ? <UseYearComponent contractsForUseYear={contracts.October} useYear={'October'} handleDeleteContract={handleDeleteContract} /> : ''}
          {contracts.December.length > 0 ? <UseYearComponent contractsForUseYear={contracts.December} useYear={'December'} handleDeleteContract={handleDeleteContract} /> : ''}
          <View style={styles.buttonContainer}>
            <Button style={styles.addButton} labelStyle={styles.addButtonText} onPress={() => setOpenAddContract(true)} mode="contained">Add New Contract</Button>
          </View>
        </ScrollView>
        <AddContractComponent db={db} contracts={contracts} openAddContract={openAddContract} setContracts={setContracts} setOpenAddContract={setOpenAddContract} />
      </View>
    </>
  )
}
