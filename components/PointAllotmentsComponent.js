import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { monthToNumberMap, updatePointAllotments } from '../util';


export default function PointAllotmentsComponent({ db, contract, handleRemoveContract, fetchContracts }) {
  const [errorMsg, setErrorMsg] = useState('')
  const [editPoints, setEditPoints] = useState(false)
  const [allotmentsToUpdate, setAllotmentsToUpdate] = useState([])
  const theme = useTheme();

  const styles = StyleSheet.create({
    yearRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    yearLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.primary,
    },
    errorContainer: {
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 18
    },
    availablePoints: {
      fontSize: 16,
      marginRight: 3,
      color: theme.colors.primary,
    },
    pointInput: {
      width: 130,
      textAlign: 'right',
    },
    removeButtonRow: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 5,
    },
    editButton: {
      flex: 1,
      margin: 5,
      marginLeft: 'auto'
    },
    saveButton: {
      flex: 1,
      margin: 5,
      marginLeft: 'auto'
    },
    removeButton: {
      margin: 5,
      marginLeft: 'auto'
    },
    removeButtonLabel: {
      color: 'red'
    },
    editButtonLabel: {
      fontWeight: 'bold',
    },
    saveButtonLabel: {
      fontWeight: 'bold',
    },
  });


  const handleAllotmentPointChange = (text, allotment) => {
    if (isNaN(text)) {
      setErrorMsg('Enter a valid number');
    }
    const newAllotmentsToUpdate = allotmentsToUpdate.map(altmnt => {
      if (altmnt.point_allotment_id === allotment.point_allotment_id) {
        return {
          ...altmnt,
          points_available: text,
        };
      } else {
        return altmnt
      }
    });
    setAllotmentsToUpdate(newAllotmentsToUpdate)
  }

  const buildAvailablePointsBlock = (contract) => {
    const availablePoints = filterToRelaventYears(contract)
    return (
      availablePoints?.map((availablePoint, index) => (
        <React.Fragment key={index}>
          <View style={styles.yearRow}>
            <Text style={styles.yearLabel}>{availablePoint.year}</Text>
            <Text style={styles.availablePoints}>{`${availablePoint.points_available} pts`}</Text>
            {editPoints ? <><TextInput label='New Value' style={styles.pointInput} value={`${getMatchingAllotmentToUpdate(availablePoint.point_allotment_id).points_available}`} onChangeText={text => handleAllotmentPointChange(text, availablePoint)}></TextInput></> : ''}
          </View>
        </React.Fragment>
      )))
  }

  const getMatchingAllotmentToUpdate = (allotmentId) => {
    return allotmentsToUpdate.filter(allotment => allotment.point_allotment_id === allotmentId)[0]
  }

  const filterToRelaventYears = (contract) => {
    const { contract_id, use_year, points: fullPoints } = contract
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    let yearToDisplay = currentYear
    // convert useYear to - based index
    // for feb its 1 
    const useYearIndex = monthToNumberMap.get(contract.use_year);
    // fetch all the yearly point rows for the contract - display the current and the next two (3 total)
    if (useYearIndex > currentMonth) {
      yearToDisplay = currentYear - 1;
    }
    const lastYearToDisplay = yearToDisplay + 2;
    const availablePoints = [];
    while (yearToDisplay <= lastYearToDisplay) {
      // fetch yearly point for contract and year

      const foundYearlyPoints = contract.allotments.filter(yearlyPoint => yearlyPoint.contract_id === contract_id && yearlyPoint.year === yearToDisplay)[0]
      if (foundYearlyPoints != undefined) {
        availablePoints.push(foundYearlyPoints);
      }
      yearToDisplay++;
    }
    return availablePoints;
  }

  const handleEditPointAllotments = (contract) => {
    setAllotmentsToUpdate(filterToRelaventYears(contract))
    setEditPoints(true)
  }

  const handleSavePointAllotments = () => {
    setEditPoints(false)
    updatePointAllotments(db, allotmentsToUpdate);
    fetchContracts()
  }

  return (
    <View>
      {errorMsg !== '' ? <View style={styles.errorContainer}><Text style={styles.errorText}>{errorMsg}</Text></View> : ''}
      <View style={styles.availablePoints}>
        {buildAvailablePointsBlock(contract)}
      </View>
      <View style={styles.removeButtonRow}>
        {editPoints ?
          <TouchableOpacity style={styles.saveButton} onPress={() => handleSavePointAllotments(contract)}>
            <Text style={styles.saveButtonLabel}>Save Yearly Points</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditPointAllotments(contract)}>
            <Text style={styles.editButtonLabel}>Edit Yearly Points</Text>
          </TouchableOpacity>}
        {editPoints ?
          <TouchableOpacity style={styles.removeButton} onPress={() => setEditPoints(false)}>
            <Text style={styles.saveButtonLabel}>Cancel</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveContract(contract.contract_id, contract.use_year)}>
            <Text style={styles.removeButtonLabel}>Remove</Text>
          </TouchableOpacity>}
      </View>
    </View>
  )
}