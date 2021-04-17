import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons as Icon } from 'react-native-vector-icons'

import axios from 'axios';

export default function App() {

  const [gameSize, setGameSize] = useState(6)
  const [newGame, setNewGame] = useState(0)
  const [winScore, setWinScore] = useState(5)
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [canEdit, setCanEdit] = useState(false)
  const [gameState, setGameState] = useState(Array(gameSize + 1).fill(0).map(row => new Array(gameSize + 1).fill(0)))

  const Save = (state, currentP) => {
    axios.post("http://192.168.0.112:3001/save", {
      gameState: state,
      playerWon: currentP,
      gameSize: gameSize
    }).then(() => { console.log('Save Success') })
  }

  const NewGame = () => {
    let plus = newGame
    setNewGame(plus + 1)
  }

  const Plus = () => {
    let plus = gameSize
    setGameSize(plus + 1)
  }

  const Minus = () => {
    if (gameSize <= 3) {
      Alert.alert('Minimum Game Size is 3!')
    } else {
      let plus = gameSize
      setGameSize(plus - 1)
    }
  }

  const HorizontalCheck = (arr, row, col, currentP) => {
    //Horizontal Check
    let leftSide = 0
    let rightSide = 0
    let hitCount = 0
    let c = col
    let ws = winScore - 1

    if (col - ws >= 0) { leftSide = col - ws }
    else { leftSide = 0 }

    if (col + ws < gameSize) { rightSide = col + ws }
    else { rightSide = gameSize - 1 }

    //Check LeftSide
    while (c >= leftSide && hitCount < winScore) {
      if (arr[row][c] == currentP) {
        hitCount++
        c--
      } else {
        c = col
        break
      }
    }

    c = col + 1

    //Check RightSide
    while (c <= rightSide && hitCount < winScore) {
      if (arr[row][c] == currentP) {
        hitCount++
        c++
      } else {
        c = col
        break
      }
    }

    //Win Check
    if (hitCount >= winScore && currentP == 1) {
      Alert.alert("Player 1 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState.toString(), currentP)
    } else if (hitCount >= winScore && currentP == -1) {
      Alert.alert("Player 2 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState.toString(), currentP)
    }

  }

  const VerticalCheck = (arr, row, col, currentP) => {
    //Vertical Check
    let topSide = 0
    let bottomSide = 0
    let hitCount = 0
    let r = row
    let ws = winScore - 1

    if (row - ws >= 0) { topSide = row - ws }
    else { topSide = 0 }

    if (row + ws < gameSize) { bottomSide = col + ws }
    else { bottomSide = gameSize - 1 }

    //Check TopSide
    while (r >= topSide && hitCount < winScore) {
      if (arr[r][col] == currentP) {
        hitCount++
        r--
      } else {
        r = row
        break
      }
    }

    r = row + 1

    //Check BottomSide
    while (r <= bottomSide && hitCount < winScore) {
      if (arr[r][col] == currentP) {
        hitCount++
        r++
      } else {
        r = row
        break
      }
    }

    //Win Check
    if (hitCount >= winScore && currentP == 1) {
      Alert.alert("Player 1 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    } else if (hitCount >= winScore && currentP == -1) {
      Alert.alert("Player 2 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    }
  }

  const DiagonalBackCheck = (arr, row, col, currentP) => {
    let topLeftRowSide = 0
    let topLeftColSide = 0
    let bottomRightRowSide = 0
    let bottomRightColSide = 0
    let hitCount = 0
    let r = row
    let c = col
    let ws = winScore - 1

    //Check TopLeftSide
    if (row - ws >= 0 && col - ws >= 0) {
      topLeftRowSide = row - ws
      topLeftColSide = col - ws
    } else {
      topLeftRowSide = 0
      topLeftColSide = 0
    }

    //Check bottomRightSide
    if (row + ws < gameSize && col + ws < gameSize) {
      bottomRightRowSide = row + ws
      bottomRightColSide = col + ws
    } else {
      bottomRightRowSide = 0
      bottomRightColSide = 0
    }

    //Check TopLeftSide
    while (r >= topLeftRowSide && c >= topLeftColSide && hitCount < winScore) {
      if (arr[r][c] == currentP) {
        hitCount++
        r--
        c--
      } else {
        r = row
        c = col
        break
      }
    }

    r = row + 1
    c = col + 1

    //Check BottomRightSide
    while (r <= bottomRightRowSide && c <= bottomRightColSide && hitCount < winScore) {
      if (arr[r][c] == currentP) {
        hitCount++
        r++
        c++
      } else {
        r = row
        c = col
        break
      }
    }

    //Win Check
    if (hitCount >= winScore && currentP == 1) {
      Alert.alert("Player 1 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    } else if (hitCount >= winScore && currentP == -1) {
      Alert.alert("Player 2 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    }

  }

  const CheckTopRight = (arr, row, col, currentP) => {
    let topRightRowSide = 0
    let topRightColSide = 0
    let hitCount = 0
    let r = row
    let c = col
    let ws = winScore - 1

    //Check TopRightSide
    if (row - ws >= 0 && col + ws < gameSize) {
      topRightRowSide = row - ws
      topRightColSide = col + ws
    } else {
      topRightRowSide = 0
      topRightColSide = 0
    }

    while (r >= topRightRowSide || c <= topRightColSide && hitCount < winScore) {
      if (arr[r][c] == currentP) {
        hitCount++
        r--
        c++
      } else {
        break
      }
    }
    return hitCount
  }

  const CheckBottomLeft = (arr, row, col, currentP) => {
    let bottomLeftRowSide = 0
    let bottomLeftColSide = 0
    let hitCount = 0
    let r = row
    let c = col
    let ws = winScore - 1

    //Check bottomLeftSide
    if (row + ws < gameSize && col - ws >= 0) {
      bottomLeftRowSide = row + ws
      bottomLeftColSide = col - ws
    } else {
      bottomLeftRowSide = 0
      bottomLeftColSide = 0
    }

    while (r <= bottomLeftRowSide || c >= bottomLeftColSide && hitCount < winScore) {
      if (arr[r][c] == currentP) {
        hitCount++
        r++
        c--
      } else {
        break
      }
    }
    return hitCount
  }

  const DiagonalCheck = (arr, row, col, currentP) => {

    let hitCount = 0

    hitCount += CheckTopRight(arr, row, col, currentP)
    hitCount += CheckBottomLeft(arr, row, col, currentP)
    hitCount--

    //Win Check
    if (hitCount >= winScore && currentP == 1) {
      Alert.alert("Player 1 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    } else if (hitCount >= winScore && currentP == -1) {
      Alert.alert("Player 2 won")
      hitCount = 0
      setCanEdit(true)
      Save(gameState, currentP)
    }
  }

  const GetWinner = (row, col) => {
    let arr = gameState

    HorizontalCheck(arr, row, col, currentPlayer)
    VerticalCheck(arr, row, col, currentPlayer)
    DiagonalBackCheck(arr, row, col, currentPlayer)
    DiagonalCheck(arr, row, col, currentPlayer)

  }

  const RenderTile = (row, col) => {
    var value = gameState[row][col]
    switch (value) {
      case 1: return <Icon name='close' style={styles.tileX} />
      case -1: return <Icon name='circle-outline' style={styles.tileO} />
      default: return <View />
    }
  }

  const onTilePress = (row, col) => {
    var currentP = currentPlayer;
    var value = gameState[row][col]
    if (value !== 0) { return; }

    // Set tile with player selected
    var arr = gameState.slice();
    arr[row][col] = currentP;
    setGameState(arr)

    //Win Check
    GetWinner(row, col)

    //Switch player
    var nextPlayer = (currentP == 1) ? -1 : 1
    setCurrentPlayer(nextPlayer)

  }

  useEffect(() => {
    if (gameSize > 0 && gameSize != null) {
      if (gameSize < 3) {
        Alert.alert('Minimum of game size is 3!')
        setGameSize(3)
      } else {
        setCanEdit(false)
        if (gameSize == 3) { setWinScore(3) }
        else if (gameSize <= 6) { setWinScore(4) }
        else { setWinScore(5) }

        setGameState(Array(gameSize + 1).fill(0).map(row => new Array(gameSize + 1).fill(0)))
        setCurrentPlayer(1)
      }
    }
  }, [gameSize, newGame]);

  return (
    <View style={styles.container}>
      <Text>XO Game</Text>
      <Text style={{ marginTop: 20 }}>Game Size : </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={() => Minus()} style={styles.button}><Text style={{ fontSize: 40, color: 'red' }}>-</Text></TouchableOpacity>
        <TextInput
          style={styles.TextBox}
          keyboardType='numeric'
          defaultValue={gameSize.toString()}
          editable={false}
        />
        <TouchableOpacity onPress={() => Plus()} style={styles.button}><Text style={{ fontSize: 40, color: 'blue' }}>+</Text></TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ marginBottom: 15, paddingTop: 30 }}
        onPress={() => NewGame()}
      >
        <Text style={{ fontSize: 24, color: 'blue' }}>New Game</Text>
      </TouchableOpacity>

      <ScrollView
        directionalLockEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {
          [...Array(gameSize)].map((el, indexR) => {
            return (
              <View key={indexR} style={{ flexDirection: 'row' }}>
                {[...Array(gameSize)].map((el, indexC) => {
                  return (
                    <TouchableOpacity disabled={canEdit} key={indexC} style={styles.tile} onPress={() => onTilePress(indexR, indexC)}>
                      {RenderTile(indexR, indexC)}
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          })
        }

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  tile: {
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileX: {
    color: 'red',
    fontSize: 42,
  },
  tileO: {
    color: 'blue',
    fontSize: 38,
  },
  TextBox: {
    borderWidth: 1,
    width: 50,
    height: 40,
    textAlign: 'center',
  },
  button: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
