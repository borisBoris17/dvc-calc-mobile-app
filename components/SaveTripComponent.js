import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, HelperText, Modal, TextInput, useTheme } from 'react-native-paper';
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
  const [lastYearErrorMsg, setLastYearErrorMsg] = useState('');
  const [nextYearErrorMsg, setNextYearErrorMsg] = useState('');
  const [disableSave, setDisableSave] = useState(true)

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
    errorContainer: {
      display: 'flex',
    },
    errorMessage: {
      marginHorizontal: 10,
      marginVertical: 10,
      fontSize: 22,
      color: 'red',
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
    contractSelectText: {
      fontSize: 14,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
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
        let contractResortName = resort[0].name
        const stringFromContract = contractResortName + ' - ' + contract.use_year?.substring(0, 3) + ' - ' + contract.points + ' pts'
        return { _id: contract.contract_id, value: stringFromContract }
      }));
      setContract({ ...contract, list: [{ _id: -1, value: "Save Without Contract" }, ...builtContracts] })
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchContracts();
    }
  }, [db])

  const onDismissSaveTrip = () => {
    setLastYearErrorMsg('')
    setBorrowedFromLastYear(undefined)
    setBorrowedFromNextYear(undefined)
    setContract({
      value: '',
      selected_id: '',
      list: [],
      selectedList: [],
      error: '',
    })
    setOpenSaveTrip(false)
  }

  const handleSelectContract = async (value) => {
    setDisableSave(value.selectedList.length === 0);
    setContract({
      ...contract,
      value: value.text,
      selected_id: value.selectedList[0]?._id,
      selectedList: value.selectedList,
      error: '',
    });
  }

  const handleUpdateBorrowFrom = (value, setState, setErrorMsg) => {
    if (isNaN(value)) {
      setErrorMsg('Enter a valid number')
      setDisableSave(true)
    } else {
      setErrorMsg('')
      setDisableSave(false)
    }
    setState(value)
  }

  const saveTrip = async () => {
    const selectedContractId = contract.selected_id;
    if (selectedContractId === -1) {
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
      onDismissSaveTrip()
      return
    }
    const checkInDateObj = new Date(checkInDate);
    const monthOfTripMonthIndex = checkInDateObj.getMonth();
    const yearOfTrip = checkInDateObj.getFullYear()
    const selectedContract = (await runTransaction(db, `select * from contract where contract_id = ${selectedContractId}`))[0];
    const useYearOnContractMonthIndex = monthToNumberMap.get(selectedContract);
    const yearForPointAllotment = yearOfTrip;
    if (monthOfTripMonthIndex < useYearOnContractMonthIndex) {
      yearForPointAllotment -= 1;
    }
    const pointAllotmentForUseYear = (await runTransaction(db, `select * from point_allotment where contract_id = ${selectedContractId} and year = ${yearForPointAllotment}`))[0]
    let pointsOnCurrentPointAllotment = trip.points
    let pointAllotmentForLastYear = undefined
    let pointAllotmentForNextYear = undefined
    if (borrowedFromLastYear && borrowedFromLastYear != '') {
      pointsOnCurrentPointAllotment = pointsOnCurrentPointAllotment - borrowedFromLastYear
      pointAllotmentForLastYear = (await runTransaction(db, `select * from point_allotment where contract_id = ${selectedContractId} and year = ${yearForPointAllotment - 1}`))[0]
    }
    if (borrowedFromNextYear && borrowedFromNextYear != '') {
      pointsOnCurrentPointAllotment = pointsOnCurrentPointAllotment - borrowedFromLastYear
      pointAllotmentForNextYear = (await runTransaction(db, `select * from point_allotment where contract_id = ${selectedContractId} and year = ${yearForPointAllotment + 1}`))[0]
    }
    if (pointAllotmentForUseYear.points_available < pointsOnCurrentPointAllotment) {
      setContract({
        ...contract,
        error: 'Not enough points in the contract. You can save the trip without setting a Contract.',
      })
      return
    }
    if (pointAllotmentForLastYear) {
      if (pointAllotmentForLastYear.points_available < borrowedFromLastYear) {
        setLastYearErrorMsg(`Not enough points to borrow from ${yearForPointAllotment - 1}.`)
        return
      }
      await runTransaction(db, `update point_allotment set points_available = ${pointAllotmentForLastYear.points_available - borrowedFromLastYear} where point_allotment_id = ${pointAllotmentForLastYear.point_allotment_id}`)
    }
    if (pointAllotmentForNextYear) {
      if (pointAllotmentForNextYear.points_available < borrowedFromNextYear) {
        setNextYearErrorMsg(`Not enough points to borrow from ${yearForPointAllotment + 1}.`)
        return
      }
      await runTransaction(db, `update point_allotment set points_available = ${pointAllotmentForNextYear.points_available - borrowedFromNextYear} where point_allotment_id = ${pointAllotmentForNextYear.point_allotment_id}`)
    }
    await runTransaction(db, `update point_allotment set points_available = ${pointAllotmentForUseYear.points_available - pointsOnCurrentPointAllotment} where point_allotment_id = ${pointAllotmentForUseYear.point_allotment_id}`)
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
      <ScrollView>
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
            textInputStyle={styles.contractSelectText}
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
          <TextInput disabled={contract.selectedList.length === 0 || contract.selected_id === -1} mode='outlined' label='Amount Borrowed from Last Year' value={borrowedFromLastYear} onChangeText={text => handleUpdateBorrowFrom(text, setBorrowedFromLastYear, setLastYearErrorMsg)} error={lastYearErrorMsg.length > 0}></TextInput>
          {lastYearErrorMsg.length > 0 ? <HelperText type="error" >
            {lastYearErrorMsg}
          </HelperText> : null}
        </View>
        <View style={styles.borrowFromInputContainer}>
          <TextInput disabled={contract.selectedList.length === 0 || contract.selected_id === -1} mode='outlined' label='Amount Borrowed from Next Year' value={borrowedFromNextYear} onChangeText={text => handleUpdateBorrowFrom(text, setBorrowedFromNextYear, setNextYearErrorMsg)} error={nextYearErrorMsg.length > 0}></TextInput>
          {nextYearErrorMsg.length > 0 ? <HelperText type="error" >
            {nextYearErrorMsg}
          </HelperText> : null}
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={saveTrip} labelStyle={styles.saveButtonText} mode="contained" disabled={disableSave}>Save</Button>
        </View>
      </ScrollView>
    </Modal>
  )
}