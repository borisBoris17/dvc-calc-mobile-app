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
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        undefined,
        (_, { rows: { _array } }) => resolve(_array),
        (txObj, error) => console.log('Error ', error)
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