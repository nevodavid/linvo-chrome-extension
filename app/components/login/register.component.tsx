import React, { Component } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { UserActions } from '../../store/actions/user';
import { RegisterResponse } from '../../services/user.service';
import {Link} from "react-router-dom";

const Title = styled.h1`
    color: #ffce00;
    text-align: center;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const RegisterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Error = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
      .min(2, 'Name is too short!')
      .max(10, 'Name is too long!')
      .required('Name is required'),
  password: Yup.string()
      .min(2, 'Password is too short!')
      .max(50, 'Password is too long!')
      .required('Password is required'),
  email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
});

interface RegisterComponentProps {
    register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
}

class RegisterComponent extends Component<RegisterComponentProps> {
  register = async (fullName: string, email: string, password: string) => {
    const { register } = this.props;
    await register(fullName, email, password);
  }

  render() {
    return (
      <RegisterContainer>
        <Title>Register</Title>
        <Formik
          initialValues={{
            fullName: '',
            password: '',
            email: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            this.register(values.fullName, values.email, values.password);
          }}
        >
          {({ errors, handleSubmit, handleBlur, handleChange, values }) => (
            <form onSubmit={handleSubmit}>
              <InputWrapper>
                <div>
                  <input value={values.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="Full name" type="text" name="fullName" />
                  <Error>{errors && errors.fullName}</Error>
                </div>
                <div>
                  <input value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" type="text" name="email" />
                  <Error>{errors && errors.email}</Error>
                </div>
                <div>
                  <input value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Password" type="password" name="password" />
                  <Error>{errors && errors.password}</Error>
                </div>
                <div>
                  <input type="submit" value="Register!" />
                </div>
                <Link to="/login" style={{ marginTop: 10, color: 'white', textAlign: 'center', textDecoration: 'none' }}>Already a registered? click here to login</Link>
              </InputWrapper>
            </form>
        )}
        </Formik>
      </RegisterContainer>
    );
  }
}

export default connect(() => ({}), (dispatch) => ({
  register: (name: string, email: string, password: string) => dispatch(UserActions.register(name, email, password))
}))(RegisterComponent);
