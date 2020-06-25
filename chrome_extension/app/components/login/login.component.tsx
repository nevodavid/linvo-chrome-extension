import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Error, InputWrapper, RegisterContainer } from './register.component';
import { UserActions } from '../../store/actions/user';

const Title = styled.h1`
    color: #ffce00;
    text-align: center;
`;

const SigninSchema = Yup.object().shape({
  password: Yup.string()
      .min(2, 'Password is too short!')
      .max(50, 'Password is too long!')
      .required('Password is required'),
  email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
});

interface LoginComponentProps {
    login: (email: string, password: string) => Promise<any>;
}
class LoginComponent extends Component<LoginComponentProps> {
  login = (email: string, password: string) => {
    const { login } = this.props;
    login(email, password);
  };

  render() {
    return (
      <RegisterContainer>
        <Title>Login</Title>
        <Formik
          initialValues={{
            password: '',
            email: '',
          }}
          validationSchema={SigninSchema}
          onSubmit={(values) => {
            this.login(values.email, values.password);
          }}
        >
          {({ errors, handleSubmit, handleBlur, handleChange, values }) => (
            <form onSubmit={handleSubmit}>
              <InputWrapper>
                <div>
                  <input value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" type="text" name="email" />
                  <Error>{errors && errors.email}</Error>
                </div>
                <div>
                  <input value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Password" type="password" name="password" />
                  <Error>{errors && errors.password}</Error>
                </div>
                <div>
                  <input type="submit" value="Login!" />
                </div>
                <Link to="/" style={{ marginTop: 10, color: 'white', textAlign: 'center', textDecoration: 'none' }}>Not registered? click here</Link>
              </InputWrapper>
            </form>
          )}
        </Formik>
      </RegisterContainer>
    );
  }
}

export default connect(() => ({}), (dispatch) => ({
  login: (email: string, password: string) => dispatch(UserActions.login(email, password))
}))(LoginComponent);
