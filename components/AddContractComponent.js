import { StyleSheet, View, Text } from 'react-native';
import { Button, Modal, TextInput, useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { PaperSelect } from 'react-native-paper-select';
import { createContract, displayToastMessage, expirationDateMap, runTransaction } from '../util';


export default function AddContractComponent({ db, contracts, openAddContract, setContracts, setOpenAddContract }) {
  const [contractPoints, setContractPoints] = useState('');
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
    saveButtonText: {
      fontSize: 20,
      paddingLeft: 10,
      paddingRight: 10
    },
    addContractContainer: {
      margin: '5%',
      backgroundColor: theme.colors.tertiary,
      margin: 20,
      height: 350,
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
    homeResortSelect: {
      marginHorizontal: 5,
      marginVertical: 10,
    },
    pointsInput: {
      marginHorizontal: 5,
      marginBottom: 10,
    },
    useYearSelect: {
      marginHorizontal: 5,
      marginVertical: 10,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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

  useEffect(() => {
    if (db !== undefined) {
      fetchResorts();
    }
  }, [db])

  const saveSaveContract = async () => {
    if (homeResort.value && contractPoints && useYear.value) {
      const newContract = {
        home_resort_id: homeResort.selected_id,
        points: Number(contractPoints),
        use_year: useYear.value,
        expiration: expirationDateMap.get(homeResort.value),
      }
      const createdContract = await createContract(db, newContract);
      const currentContractsForUseYear = [...contracts[createdContract.use_year], { contract_id: createdContract.contract_id, homeResort: homeResort.value, points: createdContract.points, use_year: createdContract.use_year, allotments: createdContract.allotments }];
      const newContracts = { ...contracts, [createdContract.use_year]: currentContractsForUseYear };
      setContracts(newContracts)
      displayToastMessage('Contract Saved Successfully')
    }
    onDismissAddContracts();
  }

  const onDismissAddContracts = () => {
    setContractPoints(undefined)
    setUseYear({ ...useYear, value: '', selectedList: [] })
    setHomeResort({ ...homeResort, value: '', selectedList: [] })
    setOpenAddContract(false)
  }

  const handlePointsChange = (text) => {
    setContractPoints(text)
  }

  return (
    <Modal visible={openAddContract} onDismiss={onDismissAddContracts} contentContainerStyle={styles.addContractContainer}>
      <View style={styles.modalTitleRow}>
        <Text style={styles.modalTitle}>Add New Contract</Text>
      </View>
      <View style={styles.contractInputSection}>
        <View style={styles.homeResortSelect}>
          <PaperSelect
            hideSearchBox={true}
            theme={theme}
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
        </View>
        <View style={styles.pointsInput}>
          <TextInput mode='outlined' label='Points' value={contractPoints} onChangeText={text => handlePointsChange(text)}></TextInput>
        </View>
        <View style={styles.useYearSelect}>
          <PaperSelect
            hideSearchBox={true}
            theme={theme}
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
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={saveSaveContract} labelStyle={styles.saveButtonText} mode="contained">Save</Button>
        </View>
      </View>

    </Modal>
  )
}