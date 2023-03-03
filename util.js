export function formatDate(date) {
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
          if (date.getDay() == 5 || date.getDay() == 6) {
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
        let currentDate = new Date(range.startDate);
        let totalPointsNeeded = 0;
        let dates = [];
        while (currentDate < range.endDate) {
          const amountForDay = await fetchPointsForNight(db, viewType.view_type_id, formatDate(currentDate), currentDate);
          // add the date need for that day to the response obj
          // total the amount for the whole stay
          totalPointsNeeded = totalPointsNeeded + amountForDay;
          // add the points need for that day to the response obj
          dates.push({
            date: currentDate.toLocaleDateString(),
            points: amountForDay
          });
          currentDate.setDate(currentDate.getDate() + 1);
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


export const monthToNumberMap = new Map();
monthToNumberMap.set('January', 1);
monthToNumberMap.set('February', 2);
monthToNumberMap.set('March', 3);
monthToNumberMap.set('April', 4);
monthToNumberMap.set('May', 5);
monthToNumberMap.set('June', 6);
monthToNumberMap.set('July', 7);
monthToNumberMap.set('August', 8);
monthToNumberMap.set('September', 9);
monthToNumberMap.set('October', 10);
monthToNumberMap.set('November', 11);
monthToNumberMap.set('December', 12);

export const createContract = async (db, contract) => {
  const { home_resort_id, points, use_year, expiration } = contract;

  const query = `INSERT INTO CONTRACT (home_resort_id, points, use_year, expiration) 
                  VALUES(${home_resort_id}, ${points}, "${use_year}", ${expiration}) RETURNING *;`
  const insertedContract = await runTransaction(db, query);
  // create the point allotment rows for this contract
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth()
  let previousYear = currentDate.getFullYear() - 1

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
  const builtContract = {...insertedContract[0], allotments: pointAllotments}
  return builtContract;
}

export const createPointAllotment = async (db, pointsAllotment) => {
  const { contract_id, year, points_available, points_banked, points_borrowed } = pointsAllotment;

  const query = `INSERT INTO POINT_ALLOTMENT (contract_id, year, points_available, points_banked, points_borrowed) 
                  VALUES(${contract_id}, ${year}, "${points_available}", ${points_banked}, ${points_borrowed}) RETURNING *;`
  const insertedAllotment = await runTransaction(db, query);
  return insertedAllotment[0];
}