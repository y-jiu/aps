import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Login as LoginAction } from '../../modules/user';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(credentials.username, credentials.password)
    dispatch(LoginAction(credentials.username as string, credentials.password as string));
  };

  return (
    <Container>
      <LoginBox>
        <Title>{t('login.title')}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder={t('login.username')}
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <Input
            type="password"
            placeholder={t('login.password')}
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <LoginButton type="submit">{t('login.signIn')}</LoginButton>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const LoginButton = styled.button`
  padding: 0.8rem;
  background-color: #00CCC0;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #00B3A8;
  }
`; 