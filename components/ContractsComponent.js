import { StyleSheet, View, Text } from 'react-native'; import Constants from 'expo-constants';
import { useTheme } from 'react-native-paper';

export function ContractsComponent() {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      padding: 10,
      alignItems: 'center'
    },
    statusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: theme.colors.primaryContainer,
    },
  });

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.statusBar}></View>
        <Text>Enter your contracts here!</Text>
      </View>
    </>
  )
}