import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import { useEffect, useState } from 'react';
registerTranslation('en-GB', enGB)
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { BottomNavigation, MD3LightTheme as DefaultTheme, Provider } from 'react-native-paper';
import CalculatorComponent from './components/CalculatorComponent';
import { ContractsComponent } from './components/ContractsComponent';
import { runTransaction } from './util';
import { TripsComponent } from './components/TripsComponent';

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(undefined);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'calculator', title: 'Caclulator', focusedIcon: 'calculator', unfocusedIcon: 'calculator' },
    { key: 'trip', title: 'Trips', focusedIcon: 'calendar', unfocusedIcon: 'calendar' },
    { key: 'contract', title: 'Contracts', focusedIcon: 'file-document', unfocusedIcon: 'file-document' },
  ])

  async function openDatabase() {

    const localFolder = FileSystem.documentDirectory + 'SQLite'
    const dbName = 'dvcCalc.db'
    const localURI = localFolder + '/' + dbName

    const existingDB = SQLite.openDatabase(dbName)

    const queryResults = await runTransaction(existingDB, 'select * from trip');
    console.log('check existing db')
    if (queryResults === undefined) {
      console.log('need to instantiate db')

      if (!(await FileSystem.getInfoAsync(localFolder)).exists) {
        await FileSystem.makeDirectoryAsync(localFolder)
      }

      let asset = Asset.fromModule(require('./assets/db/dvcCalc.db'))

      if (!asset.downloaded) {
        await asset.downloadAsync().then(value => {
          asset = value
        })

        let remoteURI = asset.localUri

        await FileSystem.copyAsync({
          from: remoteURI,
          to: localURI
        }).catch(error => {
          console.log('asset copyDatabase - finished with error: ' + error)
        })
      } else {
        // for iOS  -Asset is downloaded on call Asset.fromModule(), just copy from cache to local file
        if (asset.localUri || asset.uri.startsWith("asset") || asset.uri.startsWith("file")) {

          let remoteURI = asset.localUri || asset.uri

          await FileSystem.copyAsync({
            from: remoteURI,
            to: localURI
          }).catch(error => {
            console.log("local copyDatabase - finished with error: " + error)
          })
        } else if (asset.uri.startsWith("http") || asset.uri.startsWith("https")) {
          let remoteURI = asset.uri

          await FileSystem.downloadAsync(remoteURI, localURI)
            .catch(error => {
              console.log("local downloadAsync - finished with error: " + error)
            })
        }
      }
      if (db !== undefined) {
        await db.closeAsync()
      }
      setDb(SQLite.openDatabase(dbName));
    } else {
      setDb(existingDB)
    }
  }

  useEffect(() => {
    openDatabase();
  }, [])

  const theme = {
    "colors": {
      "primary": "#00232c",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "#d5edf1",
      "onPrimaryContainer": "rgb(0, 31, 39)",
      "secondary": "#d5edf1",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(206, 230, 240)",
      "onSecondaryContainer": "rgb(6, 30, 37)",
      "tertiary": "#f7fbfc",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(223, 224, 255)",
      "onTertiaryContainer": "rgb(21, 25, 55)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(251, 252, 254)",
      "onBackground": "rgb(25, 28, 29)",
      "surface": "#c3dddf",
      "onSurface": "rgb(25, 28, 29)",
      "surfaceVariant": "rgb(219, 228, 232)",
      "onSurfaceVariant": "rgb(64, 72, 75)",
      "outline": "rgb(112, 120, 124)",
      "outlineVariant": "rgb(191, 200, 204)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(46, 49, 50)",
      "inverseOnSurface": "rgb(239, 241, 242)",
      "inversePrimary": "rgb(89, 213, 248)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(238, 245, 248)",
        "level2": "rgb(231, 240, 244)",
        "level3": "rgb(223, 236, 240)",
        "level4": "rgb(221, 234, 239)",
        "level5": "rgb(216, 231, 236)"
      },
      "surfaceDisabled": "rgba(25, 28, 29, 0.12)",
      "onSurfaceDisabled": "rgba(25, 28, 29, 0.38)",
      "backdrop": "rgba(41, 50, 53, 0.4)"
    }
  };

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'calculator':
        return <CalculatorComponent jumpTo={jumpTo} db={db} />;
      case 'contract':
        return <ContractsComponent db={db} index={index} />;
      case 'trip':
        return <TripsComponent db={db} index={index} />;
    }
  }

  return (
    <Provider theme={theme}>
      {db ? <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        theme={theme}
        barStyle={{
          height: 60,
          justifyContent: 'center',
        }}
      /> : ''}
    </Provider>
  );
}
