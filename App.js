import { StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchComponent from './components/SearchComponent';
import ResultsComponent from './components/ResultsComponent';
import {
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import { useEffect, useState } from 'react';
registerTranslation('en-GB', enGB)
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { runTransaction } from './util'
import { MD3LightTheme as DefaultTheme, Provider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('db.db'));
  const [resorts, setResorts] = useState([]);

  async function openDatabase() {

    const localFolder = FileSystem.documentDirectory + 'SQLite'
    const dbName = 'dvcCalc.db'
    const localURI = localFolder + '/' + dbName
  
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
      // for iOS - Asset is downloaded on call Asset.fromModule(), just copy from cache to local file
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
    await db.closeAsync()
    setDb(SQLite.openDatabase(dbName));
  }

  useEffect(() => {
    openDatabase();
  }, [])

  const fetchResorts = async () => {
    const foundResorts = await runTransaction(db, 'select * from resort order by resort_id ASC;');
    const builtResorts = foundResorts.map(resort => {
      return { selected: true, name: resort.name }
    });
    setResorts(builtResorts)
  }

  useEffect(() => {
    fetchResorts();
  }, [db])

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#00232c',
      secondary: '#d5edf1',
      tertiary: '#d5edf1',
      surface: '#c3dddf',
      primaryContainer: '#d5edf1',
    },
  };

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenProps={{db: db}}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Search"
            >
              {(props) => <SearchComponent {...props} db={db} resorts={resorts} setResorts={setResorts} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Results">
              {(props) => <ResultsComponent {...props} resorts={resorts} setResorts={setResorts} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: 'red'
  },
  dateRangeButton: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#c3dddf'
  }
});
