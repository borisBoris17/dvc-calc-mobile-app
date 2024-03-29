import moment from 'moment';
import Toast from 'react-native-root-toast';
import dbUpgrade from './assets/db/db-upgrades.json';

export const upgradeDbVersion = async (db) => {
  await runTransaction(db, 'create table if not exists version (version integer);');

  const queryResults = await runTransaction(db, 'select version from version;');

  let currentVersion = 1
  if (queryResults.length !== 0) {
    currentVersion = queryResults[0].version
  } else {
    await runTransaction(db, 'update version set version = 1;');
  }
  if (currentVersion < dbUpgrade.version) {
    upgradeFrom(db, currentVersion)
  }
}

const upgradeFrom = async (db, previousVersion) => {
  let statements = [];
  let version = dbUpgrade.version - (dbUpgrade.version - previousVersion) + 1;
  let length = Object.keys(dbUpgrade.upgrades).length;

  for (let i = 0; i < length; i += 1) {
    let upgrade = dbUpgrade.upgrades[`to_v${version}`];

    if (upgrade) {
      statements = [...statements, ...upgrade];
    } else {
      break;
    }

    version++;
  }

  statements = [...statements, `REPLACE into version (version) VALUES (${dbUpgrade.version})`];

  for (let i = 0; i < statements.length; i += 1) {
    await runTransaction(db, statements[i]);
  }
}

export function formatDateForQuery(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export function formatDate(date) {
  return date.format('LL')
}

export const displayToastMessage = (msg) => {
  Toast.show(msg, {
    duration: Toast.length.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: {
      marginBottom: 80
    }
  });
}

export const monthToNumberMap = new Map();
monthToNumberMap.set('January', 0);
monthToNumberMap.set('February', 1);
monthToNumberMap.set('March', 2);
monthToNumberMap.set('April', 3);
monthToNumberMap.set('May', 4);
monthToNumberMap.set('June', 5);
monthToNumberMap.set('July', 6);
monthToNumberMap.set('August', 7);
monthToNumberMap.set('September', 8);
monthToNumberMap.set('October', 9);
monthToNumberMap.set('November', 10);
monthToNumberMap.set('December', 11);

export const expirationDateMap = new Map();
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

export const runTransaction = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        undefined,
        (_, { rows: { _array } }) => resolve(_array),
        (txObj, error) => {
          console.log('Error ', error, sql)
          resolve(undefined)
        }
      );
    })
  })
}

function fetchPointsForNight(db, viewTypeId, dateStr, date) {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM point_value WHERE view_type_id = ? and start_date <= ? and end_date >= ? ORDER BY view_type_id ASC',
        [viewTypeId, dateStr, dateStr],
        (_, { rows: { _array } }) => {
          if (date.day() == 5 || date.day() == 6) {
            resolve(_array[0]?.weekend_rate);
          }
          resolve(_array[0]?.weekday_rate);
        },
        (txObj, error) => console.log('Error fetch points ', error)
      );
    })
  });
}

export async function fetchResults(db, range) {
  const foundResorts = await runTransaction(db, 'select * from resort;');
  const resortArray = [];
  await Promise.all(foundResorts.map(async (resort) => {
    const foundRoomTypes = await runTransaction(db, `SELECT * FROM room_type WHERE resort_id = ${resort.resort_id} ORDER BY room_type_id ASC`);
    let roomTypeArray = [];
    await Promise.all(foundRoomTypes.map(async (roomType) => {
      const foundViewTypes = await runTransaction(db, `SELECT * FROM view_type WHERE room_type_id = ${roomType.room_type_id} ORDER BY view_type_id ASC`);
      const viewTypeArray = [];
      await Promise.all(foundViewTypes.map(async (viewType) => {
        let currentDate = moment(range.startDate);
        let totalPointsNeeded = 0;
        let dates = [];
        while (currentDate < range.endDate) {
          const amountForDay = await fetchPointsForNight(db, viewType.view_type_id, formatDateForQuery(currentDate), currentDate);
          // add the date need for that day to the response obj
          // total the amount for the whole stay
          totalPointsNeeded = totalPointsNeeded + amountForDay;
          // add the points need for that day to the response obj
          dates.push({
            date: currentDate.format('l'),
            points: amountForDay
          });
          currentDate = currentDate.add(1, 'd');
        }
        viewTypeArray.push({
          view_type_id: viewType.view_type_id,
          view_type_name: viewType.name,
          totalPoints: totalPointsNeeded,
          dates: dates
        });
      }));
      roomTypeArray.push({
        room_type_id: roomType.room_type_id,
        room_type_name: roomType.name,
        number_bedrooms: roomType.number_bedrooms,
        viewTypes: viewTypeArray
      });
    }));
    resortArray.push({
      resort_id: resort.resort_id,
      resort_name: resort.name,
      roomTypes: roomTypeArray
    });
  }));
  const responseObj = {
    'resorts': resortArray
  };
  return responseObj;
}

export const createContract = async (db, contract) => {
  const { home_resort_id, points, use_year, expiration } = contract;

  const query = `INSERT INTO CONTRACT (home_resort_id, points, use_year, expiration) 
                  VALUES(${home_resort_id}, ${points}, "${use_year}", ${expiration}) RETURNING *;`
  const insertedContract = await runTransaction(db, query);
  // create the point allotment rows for this contract
  const currentDate = moment();
  const currentMonth = currentDate.month()
  let previousYear = currentDate.year() - 1

  const lastYearToCreateAllotment = insertedContract[0].expiration - 1;
  const pointAllotments = []
  while (previousYear <= lastYearToCreateAllotment) {
    const pointsAllotment = {
      contract_id: insertedContract[0].contract_id,
      year: previousYear,
      points_available: insertedContract[0].points,
      points_banked: 0,
      points_borrowed: 0,
    }
    const newAllotment = await createPointAllotment(db, pointsAllotment);

    pointAllotments.push({
      point_allotment_id: newAllotment.point_allotment_id,
      contract_id: newAllotment.contract_id,
      year: newAllotment.year,
      points_available: newAllotment.points_available,
      points_banked: newAllotment.points_banked,
      points_borrowed: newAllotment.points_borrowed,
    })
    previousYear++
  }
  const builtContract = { ...insertedContract[0], allotments: pointAllotments }
  return builtContract;
}

export const createPointAllotment = async (db, pointsAllotment) => {
  const { contract_id, year, points_available, points_banked, points_borrowed } = pointsAllotment;

  const query = `INSERT INTO POINT_ALLOTMENT (contract_id, year, points_available, points_banked, points_borrowed) 
                  VALUES(${contract_id}, ${year}, "${points_available}", ${points_banked}, ${points_borrowed}) RETURNING *;`
  const insertedAllotment = await runTransaction(db, query);
  return insertedAllotment[0];
}

export const removeContract = async (db, contract) => {
  await runTransaction(db, `update trip set contract_id = null, borrowed_from_prev = 0, borrowed_from_next = 0 where contract_id = ${contract.contract_id}`)
  await Promise.all(contract.allotments.map(async allotment => {
    const deleteAllotmentQuery = `delete from point_allotment where point_allotment_id = ${allotment.point_allotment_id}`
    await runTransaction(db, deleteAllotmentQuery);
  }))
  const deleteContractQuery = `delete from contract where contract_id = ${contract.contract_id};`
  await runTransaction(db, deleteContractQuery)
}

export const createTrip = async (db, trip) => {
  const { contract_id, points, pointsBorrowedFromLastYear, pointsBorrowedFromNextYear, resortName, viewTypeName, roomTypeName, checkInDate, checkOutDate } = trip

  const query = `INSERT INTO TRIP (contract_id, resort_name, room_type_name, view_type_name, check_in_date, check_out_date, points, borrowed_from_prev, borrowed_from_next)
                  VALUES (${contract_id}, "${resortName}", "${roomTypeName}", "${viewTypeName}", "${checkInDate.toISOString()}", "${checkOutDate.toISOString()}", ${points}, ${pointsBorrowedFromLastYear}, ${pointsBorrowedFromNextYear}) RETURNING *;`

  const insertedTrip = await runTransaction(db, query);
  return insertedTrip[0];
}

export const removeTrip = async (db, trip) => {
  const dropTripQuery = `delete from trip where trip_id = ${trip.trip_id};`
  const foundTrip = (await runTransaction(db, `select * from trip where trip_id = ${trip.trip_id}`))[0]
  if (trip.contract_id === null) {
    await runTransaction(db, dropTripQuery);
  } else {
    const checkInDateObj = new Date(foundTrip.check_in_date);
    const monthOfTripMonthIndex = checkInDateObj.getMonth();
    const yearOfTrip = checkInDateObj.getFullYear()
    const contractOnTrip = (await runTransaction(db, `select * from contract where contract_id = ${foundTrip.contract_id}`))[0];
    const useYearOnContractMonthIndex = monthToNumberMap.get(contractOnTrip.use_year);
    let yearForPointAllotment = yearOfTrip;
    if (monthOfTripMonthIndex < useYearOnContractMonthIndex) {
      yearForPointAllotment -= 1;
    }
    const mainAllotmentForTrip = (await runTransaction(db, `select * from point_allotment where contract_id = ${foundTrip.contract_id} and year = ${yearForPointAllotment}`))[0]
    const allotmentForLastYear = (await runTransaction(db, `select * from point_allotment where contract_id = ${foundTrip.contract_id} and year = ${yearForPointAllotment - 1}`))[0]
    const allotmentForNextYear = (await runTransaction(db, `select * from point_allotment where contract_id = ${foundTrip.contract_id} and year = ${yearForPointAllotment + 1}`))[0]

    const newPointsForMain = mainAllotmentForTrip.points_available + (foundTrip.points - foundTrip.borrowed_from_prev - foundTrip.borrowed_from_next)
    const newPointsForLast = allotmentForLastYear.points_available + foundTrip.borrowed_from_prev
    const newPointsForNext = allotmentForNextYear.points_available + foundTrip.borrowed_from_next

    await runTransaction(db, `update point_allotment set points_available = ${newPointsForMain} where point_allotment_id = ${mainAllotmentForTrip.point_allotment_id}`)
    await runTransaction(db, `update point_allotment set points_available = ${newPointsForLast} where point_allotment_id = ${allotmentForLastYear.point_allotment_id}`)
    await runTransaction(db, `update point_allotment set points_available = ${newPointsForNext} where point_allotment_id = ${allotmentForNextYear.point_allotment_id}`)
    await runTransaction(db, dropTripQuery);
  }
}

export const updatePointAllotments = async (db, allotmentsToUpdate) => {
  if (allotmentsToUpdate.length === 0) {
    return
  }
  await Promise.all(allotmentsToUpdate.map(async (allotment) => {
    await runTransaction(db, `update point_allotment set points_available = ${allotment.points_available} where point_allotment_id = ${allotment.point_allotment_id}`)
  }))
}