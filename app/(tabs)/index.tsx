import { string } from "mathjs";
import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function App() {
    const [currentNumber, setCurrentNumber] = useState('');
    const [previousExpression, setPreviousExpression] = useState('');
    const [theme, setTheme] = useState('light');
    const [isNewCalculation, setIsNewCalculation] = useState(true);

    const buttons = [
        ['C', 'DEL', '%', '÷'],
        ['7', '8', '9', 'x'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['.', '0', '=',]
    ];

    const handleInput = useCallback((buttonPressed: string) => {
        if (buttonPressed === 'theme') {
            setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
            return;
        }

        setCurrentNumber(prev => {
            let newValue = prev;

            if (!isNaN(Number(buttonPressed)) || buttonPressed === '.') {
                if (isNewCalculation) {
                    newValue = buttonPressed;
                    setIsNewCalculation(false);
                } else {
                    if (buttonPressed === '.') {
                        // Kiểm tra xem số cuối cùng đã có dấu chấm chưa
                        const parts = newValue.split(/[+\-x÷]/);
                        const lastPart = parts[parts.length - 1];
                        if (lastPart.includes('.')) {
                            return newValue;
                        }
                    }
                    if (newValue === '0' && buttonPressed !== '.') {
                        return buttonPressed;
                    }
                    newValue = newValue + buttonPressed;
                }
            } else if (['x', '÷', '+', '-', '%'].includes(buttonPressed)) {
                setIsNewCalculation(false);
                if (['x', '÷', '+', '-', '%'].includes(newValue.slice(-1))) {
                    return newValue.slice(0, -1) + buttonPressed;
                }
                newValue = newValue + buttonPressed;
            } else if (buttonPressed === 'C') {
                newValue = '';
                setPreviousExpression('');
                setIsNewCalculation(true);
            } else if (buttonPressed === 'DEL') {
                newValue = removeLeadingZeros(newValue.slice(0, -1));
            } else if (buttonPressed === '=') {
                calculateResult();
                setIsNewCalculation(true);
                return newValue;
            }

            return removeLeadingZeros(newValue);
        });
    }, [currentNumber, isNewCalculation]);

    const removeLeadingZeros = (value : string) => {
      return value.replace(/^0+(?!\.)/, '') || '0';
    };

    const calculateResult = () => {
        try {
            let expression = currentNumber.replace(/x/g, '*').replace(/÷/g, '/');
            
            if (expression.includes('%')) {
                let parts = expression.split(/([+\-*/])/);
                for (let i = 0; i < parts.length; i++) {
                    if (parts[i].endsWith('%')) {
                        let num = parseFloat(parts[i].slice(0, -1));
                        if (i > 0 && ['+', '-'].includes(parts[i-1])) {
                            let baseNum = eval(parts.slice(0, i-1).join(''));
                            parts[i] = (baseNum * num / 100).toString();
                        } else {
                            parts[i] = (num / 100).toString();
                        }
                    }
                }
                expression = parts.join('');
            }

            let result = eval(expression);
            if (!isNaN(result) && isFinite(result)) {
                setPreviousExpression(`${currentNumber} =`);
                // Làm tròn kết quả đến 10 chữ số thập phân và loại bỏ số 0 thừa
                setCurrentNumber(Number(result.toFixed(10)).toString());
            } else {
                throw new Error('Invalid result');
            }
        } catch {
            Vibration.vibrate();
            setCurrentNumber('Error');
        }
    };

    const buttonStyle = (button : string) => {
      if (['x', '÷', '+', '-', '%', 'C', 'DEL'].includes(button)) {
          return [styles.button, styles.buttonOrange]; 
      }
      return button === '=' ? [styles.button, styles.buttonEqual] : styles.button;
  };

    return (
        <View style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}>
            <TouchableOpacity style={styles.themeButton} onPress={() => handleInput('theme')}>
                <Icon
                    name={theme === 'light' ? 'moon' : 'sunny'}
                    size={30}
                    color={theme === 'light' ? '#000' : '#fff'}
                />
            </TouchableOpacity>
            <View style={styles.resultContainer}>
                {previousExpression ? <Text style={styles.previousExpression}>{previousExpression}</Text> : null}
                <Text style={[styles.result, theme === 'dark' ? styles.darkText : styles.lightText]}>
                {currentNumber || '0'}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                {buttons.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.buttonRow}>
                        {row.map((button) => (
                            <TouchableOpacity
                                key={button}
                                style={buttonStyle(button)}
                                onPress={() => handleInput(button)}
                            >
                                <Text style={[styles.buttonText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                                    {button}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',  
        alignItems: 'center',
    },
    resultContainer: {
        width: '100%',
        padding: 20,
        alignItems: 'flex-end',
        maxHeight: 300,
        marginTop:100,
        borderWidth: 3,           
        borderColor: '#ffc107',       
        borderRadius: 10,
        borderStyle: 'solid',
    },
    result: {
      fontSize: 48,
      marginTop:15,
      flexShrink: 1, 
      
  },
    previousExpression: {
        fontSize: 24,
        color: '#888',
        textAlign: 'right',
        marginBottom: 5,
    },
    buttonContainer: {
        width: '100%',
        padding: 10,
        paddingBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    button: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        margin: 5,
    },
    buttonOrange: {
      backgroundColor: '#ffc107', 
  },
    buttonEqual: {
        width: '48%',
        backgroundColor: '#ffc107',
    },
    buttonText: {
        fontSize: 24,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
    darkTheme: {
        backgroundColor: '#202020',
    },
    lightTheme: {
        backgroundColor: '#fff',
    },
    themeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        backgroundColor: 'transparent',
    },
});
