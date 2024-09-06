import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";

export default function App(){
    const [darkMode, setDarkMode] = useState(false);
    const [currentNumber, setcurrentNumber] = useState('');
    const [lastName, setlastName ] = useState('');

    const buttons = ['C', 'DEL', '/',7,8,9, '*', 4,5,6,'-', 1,2,3, '+', 0, '.', '=']

    function calculator (){
      let lastArr = currentNumber[currentNumber.length-1];

      if(lastArr === '/' || lastArr==='*' || lastArr==='-' || lastArr==='+' || lastArr==='.' ){
        setcurrentNumber(currentNumber)
        return
      }
      
    }
}