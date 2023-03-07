import { StyleSheet, View, Text } from 'react-native';
import { Button, Modal, TextInput, useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { PaperSelect } from 'react-native-paper-select';
import { createTrip, formatDate, monthToNumberMap, runTransaction } from '../util';


export default function SaveTripComponent({ db, openSaveTrip, setOpenSaveTrip, setTrip, trip, checkInDate, checkOutDate }) {
  const [contract, setContract] = useState({
    value: '',
    selected_id: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const [borrowedFromLastYear, setBorrowedFromLastYear] = useState(undefined);
  const [borrowedFromNextYear, setBorrowedFromNextYear] = useState(undefined);
  const [borrowYear, setBorrowYear] = useState({
    value: '',
    selected_id: '',
    list: [],
    selectedList: [],
    error: '',
  });

  const theme = useTheme();

  const styles = StyleSheet.create({
    addContractContainer: {
      margin: '5%',
      backgroundColor: theme.colors.tertiary,
      margin: 20,
      height: 450,
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
    tripContainer: {
      display: 'flex',
    },
    resortNameStyle: {
      marginHorizontal: 10,
      marginVertical: 10,
      fontSize: 34
    },
    viewAndRoomStyle: {
      marginHorizontal: 10,
      fontSize: 20
    },
    dateRangeStyle: {
      marginHorizontal: 10,
      fontSize: 20
    },
    pointsStyle: {
      marginHorizontal: 10,
      fontSize: 20
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
    contractSelect: {
      marginHorizontal: 5,
      marginBottom: -5,
      marginTop: 5,
    },
    borrowFromInputContainer: {
      marginHorizontal: 5,
      marginVertical: 5,
    }
  });

  const fetchContracts = async () => {
    if (db !== undefined) {
      const foundContracts = await runTransaction(db, 'select * from contract order by contract_id ASC;');

      const builtContracts = await Promise.all(foundContracts.map(async contract => {
        const resort = await runTransaction(db, `select * from resort where resort_id = ${contract.home_resort_id}`);
        const stringFromContract = resort[0].name + ' - ' + contract.use_year + ' - ' + contract.points + 'pts'
        return { _id: contract.contract_id, value: stringFromContract }
      }));
      setContract({ ...contract, list: [{_id: -1, value: "Save Without Contract"}, ...builtContracts] })
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchContracts();
    }
  }, [db])

  const onDismissSaveTrip = () => {
    setOpenSaveTrip(false)
  }

  const handleSelectContract = async (value) => {
    setContract({
      ...contract,
      value: value.text,
      selected_id: value.selectedList[0]?._id,
      selectedList: value.selectedList,
      error: '',
    });
  }

  const handleUpdateBorrowFrom = (value, setState) => {
    setState(value)
  }

  const saveTrip = async () => {
    const selectedContract = contract.selected_id;
    if (selectedContract === -1) {
      const newTrip = {
        contract_id: null,
        points: trip.points,
        pointsBorrowedFromLastYear: borrowedFromLastYear ? borrowedFromLastYear : 0,
        pointsBorrowedFromNextYear: borrowedFromNextYear ? borrowedFromNextYear : 0,
        resortName: trip.resortName,
        viewTypeName: trip.viewTypeName,
        roomTypeName: trip.roomTypeName,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      }
      const savedTrip = await createTrip(db, newTrip);
      console.log(savedTrip)
      onDismissSaveTrip()
      return
    }
    const newTrip = {
      contract_id: contract.selected_id,
      points: trip.points,
      pointsBorrowedFromLastYear: borrowedFromLastYear ? borrowedFromLastYear : 0,
      pointsBorrowedFromNextYear: borrowedFromNextYear ? borrowedFromNextYear : 0,
      resortName: trip.resortName,
      viewTypeName: trip.viewTypeName,
      roomTypeName: trip.roomTypeName,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate
    }
    const savedTrip = await createTrip(db, newTrip);
    onDismissSaveTrip()
  }

  return (
    <Modal visible={openSaveTrip} onDismiss={onDismissSaveTrip} contentContainerStyle={styles.addContractContainer}>
      <View style={styles.modalTitleRow}>
        <Text style={styles.modalTitle}>Save Trip</Text>
      </View>
      <View style={styles.tripContainer}>
        <Text style={styles.resortNameStyle}>{trip.resortName}</Text>
        <Text style={styles.viewAndRoomStyle}>{trip.viewTypeName} - {trip.roomTypeName}</Text>
        <Text style={styles.dateRangeStyle}>{formatDate(checkInDate)} - {formatDate(checkOutDate)}</Text>
        <Text style={styles.pointsStyle}>{trip.points} points</Text>
      </View>
      <View style={styles.contractSelect}>
        <PaperSelect
          hideSearchBox={true}
          theme={theme}
          label="Contract"
          value={contract.value}
          onSelection={(value) => { handleSelectContract(value) }}
          arrayList={[...contract.list]}
          selectedArrayList={[...contract.selectedList]}
          errorText={contract.error}
          multiEnable={false}
        />
      </View>
      <View style={styles.borrowFromInputContainer}>
        {console.log(contract.selected_id)}
        <TextInput disabled={contract.selectedList.length === 0 || contract.selected_id === -1} mode='outlined' label='Amount Borrowed from Last Year' value={borrowedFromLastYear} onChangeText={text => handleUpdateBorrowFrom(text, setBorrowedFromLastYear)}></TextInput>
      </View>
      <View style={styles.borrowFromInputContainer}>
        <TextInput disabled={contract.selected_id === undefined || contract.selected_id === -1} mode='outlined' label='Amount Borrowed from Next Year' value={borrowedFromNextYear} onChangeText={text => handleUpdateBorrowFrom(text, setBorrowedFromNextYear)}></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={saveTrip} labelStyle={styles.saveButtonText} mode="contained">Save</Button>
      </View>
    </Modal>
  )
}