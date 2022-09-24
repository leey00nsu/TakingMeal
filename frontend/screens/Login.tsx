import React, { useCallback, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/reducers/userReducer'
import { WithLocalSvg } from 'react-native-svg'
import Feathericon from 'react-native-vector-icons/Feather'

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submitHandler = useCallback(() => {
    dispatch(setUser({ userId: id, userAge: "초등학교", userGender: "남성" }));
  }, [id, password]);

  return (
    <View style={{backgroundColor: '#F2F2F2', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
    <View
    style={[styles.contents]}>
    <WithLocalSvg
        fill = "#000000"
        width={110}
        height={56}
        asset={require('../img/logo.svg')}
      />
      <Text
        style={{fontSize: 16, color: '#FF9843', marginTop: 10, marginBottom: 50, fontFamily: "LeferiBaseBold", letterSpacing: -0.5}}
      >밥 한끼하자</Text>
      <View
        style={[styles.loginInput]}
      >
      <Feathericon
              name="user"
              color='#B1B1B1'
              size={20}
            />
      <TextInput
        placeholder="아이디를 입력하세요."
        value={id}
        onChangeText={(text) => {
          setId(text);
        }}
        style={{
          fontFamily: "LeferiBaseRegular",
          width: '80%',
          fontSize: 15,
          marginHorizontal: 10, letterSpacing: -0.5
        }}
      />
      </View>
      
      <View
      style={[styles.loginInput]}>
        <Feathericon
              name="lock"
              color='#B1B1B1'
              size={20}
            />
        <TextInput
        secureTextEntry
        placeholder="비밀번호을 입력하세요."
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        style={{
          fontFamily: "LeferiBaseRegular",
          width: '80%',
          fontSize: 15,
          marginHorizontal: 10, letterSpacing: -0.5
        }}
      />
      </View>
      
      <TouchableOpacity onPress={submitHandler} activeOpacity={0.8}
         style={{backgroundColor:'#5AC9BC', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, height: 52, marginTop: 20, marginBottom: 25}} > 
        <Text style={{color: '#ffffff', fontSize: 16, fontFamily: "LeferiBaseRegular", letterSpacing: -0.5}}>로그인</Text>
      </TouchableOpacity>
      <Text style={{color: '#A4A4A4', fontFamily: "LeferiBaseRegular", letterSpacing: -0.5}}>Copyright 2022. 십시일반. All rights reserved.</Text>
    </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  contents: {
    width: '100%',
    paddingHorizontal: 22,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  },
  loginInput: {
    flexDirection:'row',
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius:15,
    backgroundColor: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: '#dfdfdf',
    shadowRadius: 15,
    elevation: 6,
  }
})
export default Login
