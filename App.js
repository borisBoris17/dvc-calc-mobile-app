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

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('db.db'));

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

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenProps={{db: db}}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Search"
            >
              {(props) => <SearchComponent {...props} db={db} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Results"
            component={ResultsComponent}>
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
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
