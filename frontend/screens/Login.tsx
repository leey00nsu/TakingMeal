import React, { useCallback, useState } from "react";
import { Button, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userReducer";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submitHandler = useCallback(() => {
    dispatch(setUser({ userId: id, userAge: "초등학교", userGender: "남성" }));
  }, [id, password]);

  return (
    <>
      <TextInput
        placeholder="아이디를 입력하세요."
        value={id}
        onChangeText={(text) => {
          setId(text);
        }}
        style={{
          width: "80%",
          fontSize: 15,
          marginHorizontal: 10,
        }}
      />
      <TextInput
        placeholder="비밀번호을 입력하세요."
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        style={{
          width: "80%",
          fontSize: 15,
          marginHorizontal: 10,
        }}
      />
      <Button title="가보자고" onPress={submitHandler} />
    </>
  );
};

export default Login;
